"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { create } from "domain";
import { revalidatePath } from "next/cache";
import { en } from "zod/v4/locales";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data");
  }

  const encryptedValue = symmetricEncrypt(data.value);
  const result = await prisma.credentials.create({
    data: {
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("failed to create credential");
  }

  revalidatePath("/credentials");
}
