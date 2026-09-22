"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/actions/login";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center">ログイン</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-600">ユーザー名</label>
          <input
            name="name"
            required
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-600">パスワード</label>
          <input
            type="password"
            name="password"
            required
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
          {pending ? "ログインしています…" : "ログイン"}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-6">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-stone-900 underline">
          こちらから登録
        </Link>
      </p>
    </div>
  );
}
