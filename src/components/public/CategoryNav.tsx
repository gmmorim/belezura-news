"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  name: string;
  slug: string;
  badge?: string;
}

export const CATEGORIES: CategoryItem[] = [
  { name: "Início", slug: "/" },
  { name: "Beauty", slug: "/beauty" },
  { name: "Fashion", slug: "/fashion" },
  { name: "Business", slug: "/business" },
  { name: "Lifestyle", slug: "/lifestyle" },
  { name: "Reviews", slug: "/reviews" },
  { name: "Radar News", slug: "/radar", badge: "Trending" },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação por categorias"
      className="w-full border-y border-neutral-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Scroll horizontal suave para Mobile e alinhado/espaçado no Desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-5 lg:gap-7 overflow-x-auto no-scrollbar py-2 sm:py-3 w-full md:justify-center scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive =
                cat.slug === "/" ? pathname === "/" : pathname?.startsWith(cat.slug);

              return (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  className={cn(
                    "font-alleron relative whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 rounded-full flex items-center gap-1.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6305]",
                    isActive
                      ? "font-bold text-[#ff6305] bg-orange-50/90 shadow-sm shadow-orange-500/10"
                      : "font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70"
                  )}
                >
                  <span>{cat.name}</span>

                  {cat.badge && (
                    <span className="hidden xs:inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[#ff6305] text-white animate-pulse">
                      {cat.badge}
                    </span>
                  )}

                  {/* Indicador sutil de item ativo */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#ff6305] rounded-full sm:hidden" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
