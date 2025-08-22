"use server";

import { prisma } from "@/lib/prisma";

export async function GetWorkflowPhaseDetails(phaseId: string) {
  return await prisma.executionPhase.findUnique({
    where: { id: phaseId },
    include: {
      logs: {
        orderBy: { timestamp: "asc" },
      },
    },
  });
}
