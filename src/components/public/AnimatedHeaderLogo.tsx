"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const WORDS = ["News", "Beauty", "Business", "Fashion", "Lifestyle", "Review"];

export function AnimatedHeaderLogo() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setFade(true);
      }, 200);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  return (
    <Link
      href="/"
      className="group inline-flex flex-row items-baseline justify-center select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-none px-1 py-1 transition-transform duration-200 active:scale-[0.98] max-w-full"
      aria-label={`Belezura ${WORDS[index]} - Home`}
    >
      {/* Container com as classes estritamente requeridas: flex flex-row items-baseline justify-center gap-2 */}
      <div className="flex flex-row items-baseline justify-center gap-2">
        {/* Logotipo oficial Belezura renderizado via arquivo de vetor SVG logo-belezura.svg */}
        <Image
          src="/images/logo-belezura.svg"
          alt="Belezura"
          width={2010}
          height={410}
          priority
          className="h-6 md:h-8 lg:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 shrink-0"
        />

        {/* Palavra dinâmica em texto puro: text-black italic font-bold e proporção harmônica text-2xl md:text-3xl lg:text-4xl */}
        <span
          className={`font-alleron font-bold italic text-black text-2xl md:text-3xl lg:text-4xl leading-none whitespace-nowrap transition-opacity duration-200 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {WORDS[index]}
        </span>
      </div>
    </Link>
  );
}
