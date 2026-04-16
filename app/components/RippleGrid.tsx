"use client";
import { useEffect, useRef } from "react";

const GRID = 80;
const STEP = 4; // px between path points — lower = smoother, higher = faster

export default function RippleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;

    const draw = () => {
      t.current += 0.05;
      const { width, height } = canvas;
      const { x: mx, y: my } = mouse.current;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(57, 47, 90, 0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      const cols = Math.ceil(width / GRID) + 1;
      const rows = Math.ceil(height / GRID) + 1;

      // Horizontal lines — each point's y is nudged by the wave
      for (let row = 0; row < rows; row++) {
        const baseY = row * GRID;
        ctx.beginPath();
        for (let px = 0; px <= width; px += STEP) {
          const dist = Math.hypot(px - mx, baseY - my);
          const offset =
            Math.sin(dist * 0.06 - t.current * 3) *
            7 *
            Math.exp(-dist * 0.007);
          px === 0
            ? ctx.moveTo(px, baseY + offset)
            : ctx.lineTo(px, baseY + offset);
        }
        ctx.stroke();
      }

      // Vertical lines — each point's x is nudged by the wave
      for (let col = 0; col < cols; col++) {
        const baseX = col * GRID;
        ctx.beginPath();
        for (let py = 0; py <= height; py += STEP) {
          const dist = Math.hypot(baseX - mx, py - my);
          const offset =
            Math.sin(dist * 0.06 - t.current * 3) *
            7 *
            Math.exp(-dist * 0.007);
          py === 0
            ? ctx.moveTo(baseX + offset, py)
            : ctx.lineTo(baseX + offset, py);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
