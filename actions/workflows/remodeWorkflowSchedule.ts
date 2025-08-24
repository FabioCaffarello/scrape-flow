"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule(id: string) {
    await prisma.workflow.update({
        where: { id },
        data: {
            cron: null,
            nextRunAt: null
        }
    });

    revalidatePath(`/workflows`);
}