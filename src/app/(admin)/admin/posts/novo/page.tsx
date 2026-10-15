"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
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
      <PostForm />
    </Suspense>
  );
}
