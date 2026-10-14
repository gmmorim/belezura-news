"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["News", "Beauty", "Business", "Fashion", "Lifestyle", "Review"];

export function AnimatedHeaderLogo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <Link
      href="/"
      className="group inline-flex flex-row items-center justify-center select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-none px-1 py-1 transition-transform duration-200 active:scale-[0.98] max-w-full"
      aria-label={`Belezura ${WORDS[index]} - Home`}
    >
      {/* Container flexível com alinhamento milimétrico items-center */}
      <div className="flex flex-row items-center justify-center gap-2 md:gap-3">
        {/* Logotipo oficial Belezura usando Next/Image com dimensões proporcionais */}
        <Image
          src="/images/belezura_logo_menu.webp"
          alt="Belezura"
          width={728}
          height={150}
          priority
          className="h-8 md:h-10 lg:h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 shrink-0"
        />

        {/* Palavra animada na tipografia Alleron em itálico e negrito, nivelada perfeitamente com a imagem */}
        <div className="relative inline-flex items-center h-8 md:h-10 lg:h-12 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            <motion.span
              key={WORDS[index]}
              initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-alleron font-bold italic tracking-wide text-black text-2xl md:text-3xl lg:text-4xl leading-none whitespace-nowrap inline-flex items-center"
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
}
