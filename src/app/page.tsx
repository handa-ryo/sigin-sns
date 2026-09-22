import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {posts.length === 0 && (
        <p className="text-center text-stone-400 py-20">
          まだ投稿がありません。最初の一句を詠んでみましょう。
        </p>
      )}
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="block bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500">{post.author.name}</span>
            {post.isPerfect && (
              <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-semibold">
                正調 五七五
              </span>
            )}
          </div>
          <div className="text-lg leading-8 tracking-wide whitespace-pre-line">
            {post.line1}
            <br />
            {post.line2}
            <br />
            {post.line3}
          </div>
          {post.imageUrl && (
            <div className="mt-4 relative w-full aspect-video overflow-hidden rounded-xl bg-stone-100">
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-4 text-sm text-stone-400">
            感想 {post._count.comments} 件
          </div>
        </Link>
      ))}
    </div>
  );
}
