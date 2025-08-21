"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WorkflowStatus } from "@/types/workflow";

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const workflow = await prisma.workflow.findUnique({
    where: { id },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft status");
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
    },
  });

  revalidatePath("/workflows");
}
