"use client";

import { useActionState, useMemo, useState } from "react";
import { createPostAction, type PostFormState } from "@/app/actions/posts";
import { judgeLine, judgementLabel, LINE_LABELS } from "@/lib/mora";

const initialState: PostFormState = {};

function LineBadge({ text, target }: { text: string; target: number }) {
  const result = useMemo(() => judgeLine(text, target), [text, target]);
  const color =
    result.judgement === "exact"
      ? "text-emerald-600"
      : result.judgement === "invalid"
        ? "text-red-500"
        : "text-amber-600";

  return (
    <span className={`text-xs font-medium ${color}`}>
      {result.mora} 拍 ・ {judgementLabel(result.judgement)}
    </span>
  );
}

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const [lines, setLines] = useState(["", "", ""]);
  const targets = [5, 7, 5];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {targets.map((target, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-600">{LINE_LABELS[i]}</label>
            <LineBadge text={lines[i]} target={target} />
          </div>
          <input
            name={`line${i + 1}`}
            value={lines[i]}
            onChange={(e) => {
              const next = [...lines];
              next[i] = e.target.value;
              setLines(next);
            }}
            className="border border-stone-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
            required
            maxLength={40}
          />
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-sm text-stone-600">写真を添える(任意)</label>
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="text-sm"
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
        {pending ? "投稿しています…" : "詠む"}
      </button>
    </form>
  );
}
