"use server";

import { prisma } from "@/lib/prisma";

export async function GetConsumedCredits() {
  const result = await prisma.workflowBalance.aggregate({
    _sum: { credits: true },
  });

  return result._sum.credits ?? 0;
}
