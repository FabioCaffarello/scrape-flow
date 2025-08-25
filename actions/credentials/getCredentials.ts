"use server";

import prisma from "@/lib/prisma";

export async function GetCredentials() {
    return await prisma.credentials.findMany({
        orderBy: {
            name: "asc"
        }
    });
}
