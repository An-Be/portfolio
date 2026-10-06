"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDoneRef.current();
      return;
    }

    const tl = gsap.timeline();
    tl.to(barRef.current, {
      width: "100%",
      duration: 0.85,
      ease: "power2.inOut",
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

    return () => {
      tl.kill();
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
