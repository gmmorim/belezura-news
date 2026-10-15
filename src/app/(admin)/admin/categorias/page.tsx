import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesManager, CategoryItemData } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCategoriasPage() {
  let categories: CategoryItemData[] = [];

  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    categories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      order: c.order,
      isActive: c.isActive,
      postsCount: c._count.posts,
    }));
  } catch (error) {
    console.error("[LOAD_ADMIN_CATEGORIES_PAGE_ERROR]", error);
  }

  return <CategoriesManager initialCategories={categories} />;
}
