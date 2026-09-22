import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PostForm from "@/components/PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">一句、詠む</h1>
      <p className="text-stone-500 text-sm mb-8">
        五・七・五で三句を詠んでください。字足らず・字余りは1拍まで許容されます。
      </p>
      <PostForm />
    </div>
  );
}
