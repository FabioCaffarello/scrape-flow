"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function DeleteWorkflow(id: string) {
  await prisma.workflow.delete({
    where: { id },
  });

  revalidatePath("/workflows");
}
