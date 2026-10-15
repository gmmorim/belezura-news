import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewPostPage() {
  let categories: { id: string; name: string; slug: string }[] = [];
  let authors: { id: string; name: string; email: string }[] = [];

  try {
    const [cats, users] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.user.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      }),
    ]);
    categories = cats;
    authors = users;
  } catch (error) {
    console.error("[NEW_POST_PAGE_PREFETCH_ERROR]", error);
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#ff6305] animate-spin" />
          <p className="text-sm font-medium text-neutral-400">
            Carregando editor da matéria...
          </p>
        </div>
      }
    >
      <PostForm initialCategories={categories} initialAuthors={authors} />
    </Suspense>
  );
}
