import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CommentForm from "@/components/CommentForm";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">
      <article className="bg-white border border-stone-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-stone-500">{post.author.name}</span>
          {post.isPerfect && (
            <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-semibold">
              正調 五七五
            </span>
          )}
        </div>
        <div className="text-xl leading-10 tracking-wide">
          {post.line1}
          <br />
          {post.line2}
          <br />
          {post.line3}
        </div>
        {post.imageUrl && (
          <div className="mt-5 relative w-full aspect-video overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={post.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        )}
      </article>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">感想 ({post.comments.length})</h2>
        <CommentForm postId={post.id} />
        <ul className="flex flex-col gap-3">
          {post.comments.map((c) => (
            <li
              key={c.id}
              className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{c.author.name}</span>
                {c.isHaikuReward && (
                  <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-semibold">
                    見事な五七五 +5pt
                  </span>
                )}
              </div>
              <p className="whitespace-pre-line leading-7">{c.body}</p>
            </li>
          ))}
          {post.comments.length === 0 && (
            <p className="text-stone-400 text-sm">まだ感想がありません。</p>
          )}
        </ul>
      </section>
    </div>
  );
}
