"use client";
import { useRef, useEffect } from "react";

const REDUCE = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PaperGrid({
  fixed = false,
  strokeColor = "rgba(57,47,90,0.16)",
}: {
  fixed?: boolean;
  strokeColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, raf: number, t = 0;
    const mouse = { x: -9999, y: -9999 };

    const getSize = () =>
      fixed
        ? { width: window.innerWidth, height: window.innerHeight }
        : canvas.parentElement!.getBoundingClientRect();

    const resize = () => {
      const { width, height } = getSize();
      W = width; H = height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let ro: ResizeObserver | undefined;
    if (fixed) {
      window.addEventListener("resize", resize);
    } else {
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement!);
    }

    const target = fixed ? window : canvas.parentElement!;
    const onMove = (e: MouseEvent | PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    target.addEventListener("pointermove", onMove as EventListener);
    target.addEventListener("pointerleave", onLeave);

    const draw = () => {
      const reduce = REDUCE();
      t += 0.016 * (reduce ? 0.0006 : 1);
      const cols = 17, rows = Math.round(cols * 0.72);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      const cx = W / 2;
      const horizon = H * 0.30;
      const depth = 0.30;
      const amp = 8 + depth * 100 * 0.32;
      const P: [number, number][][] = [];

      for (let i = 0; i <= rows; i++) {
        const f = i / rows;
        const fy = Math.pow(f, 1.6);
        const baseY = horizon + (H - horizon) * fy;
        const scaleX = 0.44 + 0.6 * Math.pow(f, 1.1);
        const rowAmp = amp * (0.25 + 0.75 * f);
        const arr: [number, number][] = [];
        for (let j = 0; j <= cols; j++) {
          const nx = j / cols - 0.5;
          let px = cx + nx * W * 1.04 * scaleX;
          let py = baseY;
          py -= rowAmp * Math.sin(nx * 5.5 + f * 7 - t * 1.8);
          const d = Math.hypot(px - mouse.x, py - mouse.y);
          py += Math.sin(d * 0.045 - t * 3) * 6 * Math.exp(-d * 0.006) * (reduce ? 0.4 : 1);
          arr.push([px, py]);
        }
        P.push(arr);
      }

      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        for (let j = 0; j <= cols; j++) {
          const [a, b] = P[i][j];
          j ? ctx.lineTo(a, b) : ctx.moveTo(a, b);
        }
        ctx.stroke();
      }
      for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        for (let i = 0; i <= rows; i++) {
          const [a, b] = P[i][j];
          i ? ctx.lineTo(a, b) : ctx.moveTo(a, b);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      if (fixed) window.removeEventListener("resize", resize);
      target.removeEventListener("pointermove", onMove as EventListener);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [fixed, strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 11,
      }}
    />
  );
}
