"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const name = String(formData.get("name") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { name, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "ユーザー名またはパスワードが正しくありません" };
    }
    throw error;
  }

  return {};
}
