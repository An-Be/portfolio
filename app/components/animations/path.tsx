"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

const svgPath = `M 244 30 L 380 120 L 290 160 L 412 240 L 310 260 L 380 355 L 244 380 L 108 355 L 178 260 L 76 240 L 198 160 L 108 120 Z`;

export const Path = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(el, {
      strokeDashoffset: 0,
      duration: 4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => { gsap.killTweensOf(el); };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
        <path
          ref={pathRef}
          d={svgPath}
          fill="transparent"
          strokeWidth="12"
          stroke="#4a9df866"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
