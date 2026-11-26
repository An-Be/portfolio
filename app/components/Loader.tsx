"use client";
import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import gsap from "gsap";

// The loader stays up at least this long so the intro doesn't flash...
const MIN_MS = 850;
// ...and never longer than this, so a slow connection isn't stuck behind it.
// Anything still downloading keeps going in the background.
const MAX_MS = 4000;

// Request the same optimized URL that <Image fill sizes={sizes}> will ask for,
// so the browser cache already has it when the real image mounts.
function preloadImage(src: string, sizes: string) {
  return new Promise<void>((resolve) => {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.sizes = props.sizes ?? sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
  });
}

export default function Loader({
  onDone,
  preload = [],
  sizes = "100vw",
}: {
  onDone: () => void;
  preload?: string[];
  sizes?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const preloadRef = useRef({ preload, sizes });

  useEffect(() => {
    const { preload: srcs, sizes: imgSizes } = preloadRef.current;
    const bar = barRef.current;
    const loads = srcs.map((src) => preloadImage(src, imgSizes));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Downloads keep going; just don't hold the page.
      onDoneRef.current();
      return;
    }

    const start = performance.now();
    let finished = false;
    let tl: gsap.core.Timeline | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      const wait = Math.max(0, MIN_MS - (performance.now() - start)) / 1000;
      tl = gsap.timeline({ delay: wait });
      tl.to(bar, {
        width: "100%",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
      tl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: "power3.inOut",
          onStart: () => onDoneRef.current(),
        },
        "+=0.1",
      );
    };

    const timeout = setTimeout(finish, MAX_MS);

    // Bar tracks real progress up to 90%; the last stretch plays on finish.
    let count = 0;
    loads.forEach((p) =>
      p.then(() => {
        if (finished) return;
        count += 1;
        gsap.to(bar, {
          width: `${(count / loads.length) * 90}%`,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      }),
    );
    Promise.all(loads).then(finish);

    return () => {
      finished = true;
      clearTimeout(timeout);
      tl?.kill();
      gsap.killTweensOf(bar);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--surface-page)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--text-subtle)",
        }}
      >
        Andrea Berrocal
      </span>
      <div
        style={{
          width: 140,
          height: 2,
          background: "var(--border-default)",
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            width: 0,
            height: "100%",
            background: "var(--accent-blue)",
          }}
        />
      </div>
    </div>
  );
}
