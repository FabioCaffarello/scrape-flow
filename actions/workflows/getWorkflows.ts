"use server";

import { prisma } from "@/lib/prisma";

export async function GetWorkflows() {
  return prisma.workflow.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}
