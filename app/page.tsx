"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import RippleGrid from "./components/RippleGrid";

const NAME = "Andrea Berrocal";
const NAME_WORDS = NAME.split(" ");
const LETTER_COUNT = NAME.replace(/\s/g, "").length;

type ScatterOffset = { x: number; y: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const createScatterOffsets = ({
  viewportWidth,
  viewportHeight,
  isCoarsePointer,
}: {
  viewportWidth: number;
  viewportHeight: number;
  isCoarsePointer: boolean;
}): ScatterOffset[] => {
  const base = Math.min(viewportWidth, viewportHeight);
  const minDist = Math.max(80, base * (isCoarsePointer ? 0.2 : 0.28));
  const maxDist = Math.max(140, base * (isCoarsePointer ? 0.38 : 0.52));
  const deadzoneX = Math.max(110, base * (isCoarsePointer ? 0.34 : 0.28));
  const deadzoneY = Math.max(80, base * (isCoarsePointer ? 0.25 : 0.22));

  return Array.from({ length: LETTER_COUNT }, () => {
    let x = 0;
    let y = 0;

    for (let tries = 0; tries < 30; tries++) {
      // 4 allowed zones: top-left, top-right, bottom-left, bottom-right
      const band = Math.floor(Math.random() * 4);

      let deg: number;
      if (band === 0)
        deg = 120 + Math.random() * 45; // top-left
      else if (band === 1)
        deg = 15 + Math.random() * 45; // top-right
      else if (band === 2)
        deg = 195 + Math.random() * 45; // bottom-left
      else deg = 300 + Math.random() * 45; // bottom-right

      const angle = (deg * Math.PI) / 180;
      const dist = minDist + Math.random() * (maxDist - minDist);

      x = Math.cos(angle) * dist;
      y = Math.sin(angle) * dist;

      // Keep scatter visible across viewports, especially on mobile.
      x = clamp(x, -viewportWidth * 0.44, viewportWidth * 0.44);
      y = clamp(y, -viewportHeight * 0.34, viewportHeight * 0.34);

      const inDeadzone = Math.abs(x) < deadzoneX && Math.abs(y) < deadzoneY;
      if (!inDeadzone) break;
    }

    return { x, y };
  });
};

function RepelLetter({
  children,
  scattered,
  scatterX,
  scatterY,
  scaleY,
}: {
  children: string;
  scattered: boolean;
  scatterX: number;
  scatterY: number;
  scaleY: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 90, damping: 12 });
  const y = useSpring(targetY, { stiffness: 90, damping: 12 });

  useEffect(() => {
    targetX.set(scattered ? scatterX : 0);
    targetY.set(scattered ? scatterY : 0);
  }, [scattered, scatterX, scatterY, targetX, targetY]);

  return (
    <motion.span
      ref={ref}
      style={{ display: "inline-block", scaleY, x, y, touchAction: "none" }}
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  );
}

export default function Home() {
  const [scattered, setScattered] = useState(false);
  const [scaleY, setScaleY] = useState(2);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [scatterOffsets, setScatterOffsets] = useState<ScatterOffset[]>(() =>
    createScatterOffsets({
      viewportWidth: 1280,
      viewportHeight: 800,
      isCoarsePointer: false,
    }),
  );

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const update = () => {
      const coarse = pointerQuery.matches;
      setIsCoarsePointer(coarse);
      setScaleY(
        window.innerWidth < 640 ? 1.2 : window.innerWidth < 1024 ? 1.6 : 2,
      );
      setScatterOffsets(
        createScatterOffsets({
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          isCoarsePointer: coarse,
        }),
      );
    };

    update();
    window.addEventListener("resize", update);
    pointerQuery.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      pointerQuery.removeEventListener("change", update);
    };
  }, []);

  let letterIndex = 0;
  const wordsWithOffsets = NAME_WORDS.map((word) =>
    word.split("").map((letter) => {
      const offset = scatterOffsets[letterIndex] ?? { x: 0, y: 0 };
      letterIndex += 1;
      return { letter, offset };
    }),
  );

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center overflow-hidden">
      <RippleGrid />

      <main className="relative z-10 flex flex-1 w-full max-w-screen-2xl flex-col items-center text-center justify-center px-4 sm:px-10 lg:px-10">
        {/* Container that holds both layers */}
        <div
          className="relative flex items-center justify-center px-16 py-12 sm:px-24 sm:py-16 lg:px-32 lg:py-24"
          onPointerEnter={() => !isCoarsePointer && setScattered(true)}
          onPointerLeave={() => !isCoarsePointer && setScattered(false)}
          onClick={() => isCoarsePointer && setScattered((value) => !value)}
        >
          {/* Subtitle layer — reveals as letters scatter */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
            animate={{ opacity: scattered ? 1 : 0 }}
            transition={{ duration: 0.4, delay: scattered ? 0.1 : 0 }}
          >
            <p className="text-lg sm:text-2xl font-serif text-secondary">
              Experience Designer
            </p>
            <p className="text-3xl sm:text-5xl font-sans text-secondary">
              Coming soon
            </p>
          </motion.div>

          {/* Name layer — letters scatter on hover */}
          <h1 className="relative flex flex-wrap justify-center gap-x-[0.25em] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-sans text-primary font-stretch-normal sm:font-stretch-expanded lg:font-stretch-ultra-expanded uppercase leading-[1.2] select-none">
            {wordsWithOffsets.map((word, wordIdx) => (
              <span key={wordIdx} className="inline-flex whitespace-nowrap">
                {word.map(({ letter, offset }, letterIdx) => (
                  <RepelLetter
                    key={`${wordIdx}-${letterIdx}`}
                    scattered={scattered}
                    scatterX={offset.x}
                    scatterY={offset.y}
                    scaleY={scaleY}
                  >
                    {letter}
                  </RepelLetter>
                ))}
              </span>
            ))}
          </h1>
        </div>
      </main>
    </div>
  );
}
