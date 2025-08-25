"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
    await prisma.credentials.delete({
        where: {
            name,
        },
    });

    revalidatePath("/credentials");
}