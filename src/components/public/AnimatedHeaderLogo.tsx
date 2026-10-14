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
      className="group inline-flex flex-row items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-none px-1 py-1 transition-transform duration-200 active:scale-[0.98] max-w-full"
      aria-label={`Belezura ${WORDS[index]} - Home`}
    >
      {/* Logotipo oficial Belezura em tamanho proeminente no mobile (pelo menos 2x maior) */}
      <img
        src="/images/logo-belezura-header.png"
        alt="Belezura"
        width={728}
        height={150}
        className="h-10 xs:h-11 sm:h-13 md:h-14 lg:h-16 xl:h-18 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 shrink-0"
      />

      {/* Palavra animada na tipografia Alleron em escala expressiva (text-3xl/4xl no mobile até 6xl no desktop) */}
      <div className="relative inline-flex items-center h-[38px] xs:h-[44px] sm:h-[50px] md:h-[56px] lg:h-[64px] xl:h-[72px] overflow-hidden shrink-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={WORDS[index]}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-alleron font-bold italic tracking-wide text-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap inline-block"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </Link>
  );
}
