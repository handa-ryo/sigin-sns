"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "ユーザー名は2文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export interface RegisterState {
  error?: string;
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  }

  const { name, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { name } });
  if (existing) {
    return { error: "そのユーザー名は既に使われています" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, passwordHash } });

  await signIn("credentials", { name, password, redirectTo: "/" });

  return {};
}
