"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { judgePoem } from "@/lib/mora";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export interface PostFormState {
  error?: string;
}

export async function createPostAction(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "投稿するにはログインしてください" };
  }

  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim();
  const line3 = String(formData.get("line3") ?? "").trim();

  const poem = judgePoem(line1, line2, line3);
  if (!poem.isValid) {
    return { error: "五・七・五から大きく外れています。各句を見直してください(±1拍まで許容)" };
  }

  let imageUrl: string | undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return { error: "対応していない画像形式です(png / jpeg / webp / gif)" };
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return { error: "画像サイズは5MB以内にしてください" };
    }

    const ext = image.type.split("/")[1] === "jpeg" ? "jpg" : image.type.split("/")[1];
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      line1,
      line2,
      line3,
      mora1: poem.lines[0].mora,
      mora2: poem.lines[1].mora,
      mora3: poem.lines[2].mora,
      isPerfect: poem.isPerfect,
      imageUrl,
    },
  });

  revalidatePath("/");
  redirect(`/post/${post.id}`);
}
