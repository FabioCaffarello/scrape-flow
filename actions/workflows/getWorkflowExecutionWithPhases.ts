"use server";

import { prisma } from "@/lib/prisma";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  return await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
