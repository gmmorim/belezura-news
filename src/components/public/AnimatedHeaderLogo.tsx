"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
      className="group inline-flex flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-none px-1 py-1 transition-transform duration-200 active:scale-[0.98] max-w-full"
      aria-label={`Belezura ${WORDS[index]} - Home`}
    >
      {/* Logotipo oficial Belezura com a tipografia exata da marca (letras 'e' e 'a' corretas) */}
      <img
        src="/images/logo-belezura-header.png"
        alt="Belezura"
        width={728}
        height={150}
        className="h-6 xs:h-7 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 shrink-0"
      />

      {/* Palavra animada na tipografia Alleron em itálico e negrito, apenas primeira letra maiúscula */}
      <div className="relative inline-flex items-center h-[22px] xs:h-[26px] sm:h-[34px] md:h-[40px] lg:h-[44px] xl:h-[48px] overflow-hidden shrink-0">
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
            className="font-alleron font-bold italic tracking-wide text-black text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap inline-block"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </Link>
  );
}
