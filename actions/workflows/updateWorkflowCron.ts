"use server";

import prisma from "@/lib/prisma";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({id, cron}: {id: string, cron: string}) {
    try {
        const interval = parser.parseExpression(cron, { utc: true});
        await prisma.workflow.update({
            where: { id },
            data: { 
                cron,
                nextRunAt: interval.next().toDate()
            }
        });
        
    } catch (error) {
        console.error("Invalid cron expre   ssion:", error);
        throw new Error("Invalid cron expression");
    }

    revalidatePath(`/workflows`);
}