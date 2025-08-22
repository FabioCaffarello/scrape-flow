import { prisma } from "@/lib/prisma";
import "server-only";
import {
  WorkflowExecutionStatus,
  ExecutionPhaseStatus,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import createLogCollector from "@/lib/log";
import { Browser, Page } from "puppeteer";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { ExecutorRegistry } from "@/lib/workflow/executor/registry";
import { AppNode } from "@/types/appNode";
import { TaskParamType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhase } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment = { phases: {} };

  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhasesStatuses(execution);

  let creditsConsumed = 0;
  let executionFalied = false;
  for (const phase of execution.phases) {
    // TODO: consume credits
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
    );
    if (!phaseExecution.success) {
      executionFalied = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    execution.id,
    execution.workflowId,
    executionFalied,
    creditsConsumed,
  );
  await cleanupEnvironment(environment);
  revalidatePath("/workflow/runs/");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: WorkflowExecutionStatus.RUNNING,
      startedAt: new Date(),
      workflowId,
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhasesStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: { in: execution.phases.map((phase: any) => phase.id) },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFalied: boolean,
  creditsConsumed: number,
) {
  const finalStatus = executionFalied
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      // ignore
      // this means that we have triggered other execution for this workflow
      // while an existing one was running
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
) {
  const logCollector: LogCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(`Executing phase ${phase.name} with credits: ${creditsRequired}`);

  // TODO: consume credits
  let success = await executePhase(phase, node, environment, logCollector);

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector);
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector,
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);

  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[],
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // Get input value from outputs in the environment
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node in:", node.id);
      return;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector,
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string): string =>
      environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string): void => {
      environment.phases[node.id].outputs[name] = value;
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((error) => console.error("can not close browser, reason:", error));
  }
  environment.browser = undefined;
  environment.page = undefined;
}
