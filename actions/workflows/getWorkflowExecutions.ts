"use server";

import prisma from "@/lib/prisma";

export async function GetWorkflowExecutions(workflowId: string) {
    return await prisma.workflowExecution.findMany({
        where: {
            workflowId: workflowId
        },
        orderBy: {
            createdAt: "desc"
        },
    });
}