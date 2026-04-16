"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useId, useState } from "react";
import RippleGrid from "./components/RippleGrid";

const NAME = "Andrea Berrocal";
const NAME_WORDS = NAME.split(" ");
const LETTER_COUNT = NAME.replace(/\s/g, "").length;
const FIRST_NAME_LETTER_COUNT = NAME_WORDS[0]?.length ?? 0;

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
  const deadzoneCenterY = -base * 0.08;

  return Array.from({ length: LETTER_COUNT }, (_, letterIndex) => {
    let x = 0;
    let y = 0;

    for (let tries = 0; tries < 30; tries++) {
      // Split by first / last name so scatter goes both ways (left vs right).
      const isFirstName = letterIndex < FIRST_NAME_LETTER_COUNT;
      const band = isFirstName
        ? Math.random() < 0.5
          ? 0
          : 2 // top-left or bottom-left → negative x
        : Math.random() < 0.5
          ? 1
          : 3; // top-right or bottom-right → positive x

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

      const inDeadzone =
        Math.abs(x) < deadzoneX && Math.abs(y - deadzoneCenterY) < deadzoneY;
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
      style={{ display: "inline-block", scaleY, x, y, touchAction: "none" }}
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  );
}

export default function Home() {
  const comingSoonUnderlineClipId = useId().replace(/:/g, "");
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
        window.innerWidth < 640 ? 1.35 : window.innerWidth < 1024 ? 1.6 : 2,
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
          className="relative isolate flex items-center justify-center px-16 py-12 sm:px-24 sm:py-16 lg:px-32 lg:py-24"
          onPointerEnter={() => !isCoarsePointer && setScattered(true)}
          onPointerLeave={() => !isCoarsePointer && setScattered(false)}
          onClick={() => isCoarsePointer && setScattered((value) => !value)}
        >
          {/* Subtitle — content-sized only (inset-0 was a full-bleed layer that hid scattered letters on mobile WebKit) */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex w-max max-w-[min(92vw,24rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 px-2"
            initial={false}
            animate={{
              opacity: scattered ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: scattered ? 0.08 : 0,
            }}
          >
            <p className="text-lg font-bold sm:text-2xl font-serif text-secondary">
              Designer
            </p>
            <p className="text-3xl font-sans text-secondary sm:text-5xl">
              <span className="relative inline-block pb-2">
                Coming soon
                <motion.svg
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-50 h-4 w-full overflow-visible text-tertiary sm:h-5"
                  viewBox="0 0 100 14"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <clipPath
                      id={comingSoonUnderlineClipId}
                      clipPathUnits="userSpaceOnUse"
                    >
                      <motion.rect
                        x={0}
                        y={0}
                        height={14}
                        initial={{ width: 0 }}
                        animate={{ width: scattered ? 100 : 0 }}
                        transition={{
                          duration: scattered ? 1.1 : 0.22,
                          ease: scattered
                            ? [0.22, 0.05, 0.32, 1]
                            : [0.4, 0, 1, 1],
                          delay: scattered ? 0.22 : 0,
                        }}
                      />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#${comingSoonUnderlineClipId})`}>
                    {/* Single filled ribbon: thick at start, tapers to a tip (brush stroke) */}
                    <path
                      fill="currentColor"
                      d="M0,3.6 C38,2.4 72,5.2 100,6.18 L100,6.32 C71,8.2 36,11.2 0,10.2 Z"
                    />
                  </g>
                </motion.svg>
              </span>
            </p>
          </motion.div>

          {/* Name — above subtitle when scattered; inline z-index helps mobile compositing */}
          <motion.h1
            className="relative text-5xl font-sans text-primary font-stretch-normal uppercase leading-[1.2] md:leading-[1.32] lg:leading-[1.42] xl:leading-normal select-none md:text-7xl lg:text-8xl sm:font-stretch-expanded lg:font-stretch-ultra-expanded"
            style={{ zIndex: 10 }}
            initial={false}
            animate={{ opacity: scattered ? 0.88 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Ripple on inner node: motion on <h1> can override CSS transform on the same element */}
            <span
              className={`flex w-full min-w-0 flex-wrap justify-center gap-x-[0.25em] ${!scattered ? "animate-name-ripple" : ""}`}
            >
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
            </span>
          </motion.h1>
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex items-center gap-2 sm:bottom-6 sm:right-6">
        <div className="h-6 w-6 rounded-sm border border-black/15 bg-(--color-tertiary) sm:h-7 sm:w-7" />
        <div className="h-6 w-6 rounded-sm border border-black/15 bg-(--color-primary) sm:h-7 sm:w-7" />
        <div className="h-6 w-6 rounded-sm border border-black/15 bg-(--color-secondary) sm:h-7 sm:w-7" />
      </div>
    </div>
  );
}
