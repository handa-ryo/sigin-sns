"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/app/actions/register";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center">はじめる</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-600">ユーザー名</label>
          <input
            name="name"
            required
            minLength={2}
            maxLength={20}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-600">パスワード(6文字以上)</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stone-900 text-white py-2.5 font-medium hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "登録しています…" : "登録してはじめる"}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-6">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-stone-900 underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
