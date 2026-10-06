"use client";
import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Brush({
  children,
  show = true,
  color = "var(--accent-yellow)",
}: {
  children: React.ReactNode;
  show?: boolean;
  color?: string;
}) {
  const clipId = useId().replace(/:/g, "");
  const rectRef = useRef<SVGRectElement>(null);

  useGSAP(() => {
    gsap.to(rectRef.current, {
      attr: { width: show ? 100 : 0 },
      duration: show ? 1.0 : 0.22,
      ease: show ? "power3.out" : "power2.in",
      delay: show ? 0.1 : 0,
    });
  }, { dependencies: [show] });

  return (
    <span style={{ position: "relative", display: "inline-block", color }}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: "-0.18em",
          height: "0.42em",
          width: "100%",
          overflow: "visible",
          color,
        }}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect ref={rectRef} x={0} y={0} width={0} height={14} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path
            fill="currentColor"
            d="M0,3.6 C38,2.4 72,5.2 100,6.18 L100,6.32 C71,8.2 36,11.2 0,10.2 Z"
          />
        </g>
      </svg>
    </span>
  );
}
