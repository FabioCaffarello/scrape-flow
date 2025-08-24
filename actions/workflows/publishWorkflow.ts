"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowStatus } from "@/types/workflow";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({id, flowDefinition}: {id: string, flowDefinition: string}) {
    const workflow = await prisma.workflow.findUnique({
        where: { id },
    });

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("only draft workflows can be published");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
        throw new Error("flow definition not valid");
    }

    if (!result.executionPlan) {
        throw new Error("no execution plan generated");
    }

    const creditsCost = CalculateWorkflowCost(flow.nodes);

    await prisma.workflow.update({
        where: { id },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            creditsCost,
            status: WorkflowStatus.PUBLISHED,
        },
    });

    revalidatePath(`/workflow/editor/${id}`);
}