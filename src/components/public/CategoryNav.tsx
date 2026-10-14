"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  name: string;
  slug: string;
  isExternal?: boolean;
}

export const CATEGORIES: CategoryItem[] = [
  { name: "Início", slug: "/" },
  { name: "Beauty", slug: "/beauty" },
  { name: "Fashion", slug: "/fashion" },
  { name: "Business", slug: "/business" },
  { name: "Lifestyle", slug: "/lifestyle" },
  { name: "Reviews", slug: "/reviews" },
  { name: "Contato", slug: "#contato" },
  { name: "BLZURA AGÊNCIA", slug: "https://belezuraagencia.com.br", isExternal: true },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação por categorias"
      className="w-full border-y border-neutral-200 bg-white sticky top-0 z-40"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Scroll horizontal no Mobile e alinhado no Desktop sem backgrounds ou bordas */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-3 sm:py-3.5 w-full md:justify-center scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isAnchor = cat.slug.startsWith("#");
              const isExternal = !!cat.isExternal;
              const isActive =
                !isExternal &&
                !isAnchor &&
                (cat.slug === "/" ? pathname === "/" : pathname?.startsWith(cat.slug));

              const linkClasses = cn(
                "font-alleron whitespace-nowrap text-xs sm:text-sm tracking-widest uppercase transition-colors duration-200 select-none",
                isActive
                  ? "font-bold text-[#ff6305]"
                  : "font-semibold text-neutral-900 hover:text-[#ff6305]"
              );

              if (isExternal) {
                return (
                  <a
                    key={cat.name}
                    href={cat.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    {cat.name}
                  </a>
                );
              }

              if (isAnchor) {
                return (
                  <a
                    key={cat.name}
                    href={cat.slug}
                    className={linkClasses}
                  >
                    {cat.name}
                  </a>
                );
              }

              return (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  className={linkClasses}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
