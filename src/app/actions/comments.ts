"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { judgePoem } from "@/lib/mora";

const REWARD_POINTS = 5;

export interface CommentFormState {
  error?: string;
  success?: boolean;
  rewarded?: boolean;
}

export async function createCommentAction(
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "感想を送るにはログインしてください" };
  }

  const postId = String(formData.get("postId") ?? "");
  if (!postId) {
    return { error: "投稿が見つかりません" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { error: "投稿が見つかりません" };
  }

  const mode = String(formData.get("mode") ?? "free");

  if (mode === "haiku") {
    const line1 = String(formData.get("hLine1") ?? "").trim();
    const line2 = String(formData.get("hLine2") ?? "").trim();
    const line3 = String(formData.get("hLine3") ?? "").trim();

    const poem = judgePoem(line1, line2, line3);
    if (!poem.isValid) {
      return {
        error: "五・七・五から大きく外れています。各句を見直してください(±1拍まで許容)",
      };
    }

    const isReward = poem.isPerfect;

    await prisma.$transaction([
      prisma.comment.create({
        data: {
          postId,
          authorId: session.user.id,
          body: `${line1}\n${line2}\n${line3}`,
          isHaikuAttempt: true,
          isHaikuReward: isReward,
        },
      }),
      ...(isReward
        ? [
            prisma.user.update({
              where: { id: session.user.id },
              data: { points: { increment: REWARD_POINTS } },
            }),
          ]
        : []),
    ]);

    revalidatePath(`/post/${postId}`);
    return { success: true, rewarded: isReward };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "感想を入力してください" };
  }
  if (body.length > 300) {
    return { error: "感想は300文字以内で入力してください" };
  }

  await prisma.comment.create({
    data: {
      postId,
      authorId: session.user.id,
      body,
    },
  });

  revalidatePath(`/post/${postId}`);
  return { success: true, rewarded: false };
}
