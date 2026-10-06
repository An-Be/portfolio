"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Grain({
  opacity = 0.055,
  fps = 10,
  zIndex = 0,
}: {
  opacity?: number;
  fps?: number;
  zIndex?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    // Draw at 1/3 resolution — chunky pixel noise, cheaper to fill
    const scale = 1 / 3;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const interval = 1000 / fps;
    let last = 0;

    const tick = (time: number) => {
      if (time - last < interval) return;
      last = time;
      const w = canvas.width, h = canvas.height;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [fps]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        imageRendering: "pixelated",
        pointerEvents: "none",
        opacity,
        zIndex,
      }}
    />
  );
}
