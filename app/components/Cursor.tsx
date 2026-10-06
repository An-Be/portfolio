"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isFinePointer || !ringRef.current || !dotRef.current) return;

    const xTo = gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" });
    let positioned = false;

    const move = (e: MouseEvent) => {
      gsap.set(dotRef.current, { x: e.clientX - 3, y: e.clientY - 3 });
      if (!positioned) {
        // First move after mount/navigation — snap instantly to the real
        // cursor position instead of easing in from the (0,0) default.
        positioned = true;
        gsap.set(ringRef.current, { x: e.clientX - 13, y: e.clientY - 13 });
        setVisible(true);
      } else {
        xTo(e.clientX - 13);
        yTo(e.clientY - 13);
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Trailing ring — hairline square, eased. Blend mode inverts
          against whatever's underneath, so it never disappears. */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 26,
          height: 26,
          border: "2px solid var(--accent-blue)",
          borderRadius: "var(--radius-sm)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          mixBlendMode: "difference",
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Precise dot — snapped exactly to the pointer, same blend trick */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: "var(--accent-red)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          mixBlendMode: "difference",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
}
