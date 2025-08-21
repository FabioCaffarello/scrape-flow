"use server";

import {
  createWorkflowSchema,
  acreateWorkflowSchemaType,
} from "@/schema/workflow";
import { redirect } from "next/navigation";
import { WorkflowStatus } from "@/types/workflow";
import { prisma } from "@/lib/prisma";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode, AppEdge } from "@/types/appNode";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data");
  }

  const initialFlow: { nodes: AppNode[]; edges: AppEdge[] } = {
    nodes: [],
    edges: [],
  };

  // lets add an entrypoint node to the workflow
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
