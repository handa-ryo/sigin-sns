import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "詩吟SNS",
  description: "五・七・五で綴る、詩吟投稿SNS",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const points = session?.user?.id
    ? (await prisma.user.findUnique({ where: { id: session.user.id }, select: { points: true } }))
        ?.points ?? 0
    : 0;

  return (
    <html lang="ja" className={`${notoSerifJP.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-serif">
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold tracking-wide">
              詩吟SNS
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {session?.user ? (
                <>
                  <span className="text-stone-500">
                    {session.user.name} さん・
                    <span className="text-amber-700 font-semibold">{points}pt</span>
                  </span>
                  <Link
                    href="/post/new"
                    className="rounded-full bg-stone-900 text-white px-4 py-1.5 hover:bg-stone-700"
                  >
                    投稿する
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button type="submit" className="text-stone-500 hover:text-stone-900">
                      ログアウト
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-600 hover:text-stone-900">
                    ログイン
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-stone-900 text-white px-4 py-1.5 hover:bg-stone-700"
                  >
                    はじめる
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
          詩吟SNS — 五・七・五で紡ぐ、ことばの座
        </footer>
      </body>
    </html>
  );
}
