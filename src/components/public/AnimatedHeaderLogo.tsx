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
      className="group inline-flex flex-row items-baseline justify-center gap-1.5 xs:gap-2 sm:gap-2.5 lg:gap-3.5 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6305] rounded-xl px-1 sm:px-2 py-1 transition-transform duration-200 active:scale-[0.98] max-w-full"
      aria-label={`Belezura ${WORDS[index]} - Home`}
    >
      {/* Título Belezura na tipografia Recoleta em escala fluida e responsiva */}
      <span className="font-recoleta text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-800 whitespace-nowrap inline-block shrink-0">
        Belezura
      </span>

      {/* Palavra animada na tipografia Alleron em linha única ao lado de Belezura */}
      <div className="relative inline-flex items-center h-[22px] xs:h-[26px] sm:h-[34px] md:h-[42px] lg:h-[52px] xl:h-[62px] overflow-hidden self-baseline shrink-0">
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
            className="font-alleron font-extrabold uppercase tracking-wider text-[#ff6305] text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap inline-block"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </Link>
  );
}
