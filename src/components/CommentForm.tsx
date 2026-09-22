"use client";

import { useActionState, useState } from "react";
import { createCommentAction, type CommentFormState } from "@/app/actions/comments";
import { judgeLine, judgementLabel } from "@/lib/mora";

const initialState: CommentFormState = {};

export default function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(createCommentAction, initialState);
  const [mode, setMode] = useState<"free" | "haiku">("free");
  const [hLines, setHLines] = useState(["", "", ""]);
  const targets = [5, 7, 5];

  return (
    <form action={formAction} className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="mode" value={mode} />

      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("free")}
          className={`px-3 py-1 rounded-full border ${
            mode === "free"
              ? "bg-stone-900 text-white border-stone-900"
              : "border-stone-300 text-stone-600"
          }`}
        >
          自由に感想
        </button>
        <button
          type="button"
          onClick={() => setMode("haiku")}
          className={`px-3 py-1 rounded-full border ${
            mode === "haiku"
              ? "bg-stone-900 text-white border-stone-900"
              : "border-stone-300 text-stone-600"
          }`}
        >
          五・七・五で返す(達成で+5pt)
        </button>
      </div>

      {mode === "free" ? (
        <textarea
          name="body"
          rows={3}
          maxLength={300}
          placeholder="感想を書く"
          className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {targets.map((target, i) => {
            const result = judgeLine(hLines[i], target);
            const color =
              result.judgement === "exact"
                ? "text-emerald-600"
                : result.judgement === "invalid"
                  ? "text-red-500"
                  : "text-amber-600";
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">{target}拍の句</span>
                  <span className={`text-xs font-medium ${color}`}>
                    {result.mora} 拍 ・ {judgementLabel(result.judgement)}
                  </span>
                </div>
                <input
                  name={`hLine${i + 1}`}
                  value={hLines[i]}
                  onChange={(e) => {
                    const next = [...hLines];
                    next[i] = e.target.value;
                    setHLines(next);
                  }}
                  className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
                  maxLength={40}
                />
              </div>
            );
          })}
        </div>
      )}

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {state.rewarded ? "見事な五・七・五でした!+5pt 獲得しました" : "感想を送りました"}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-stone-900 text-white px-5 py-2 text-sm font-medium hover:bg-stone-700 disabled:opacity-50"
      >
        {pending ? "送信しています…" : "送る"}
      </button>
    </form>
  );
}
