"use client";
import { type ReactNode } from "react";
import Nav from "./Nav";
import PaperGrid from "./PaperGrid";
import PaletteDock from "./PaletteDock";

export default function EditorialShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <PaperGrid fixed />

      {/* Corner illustrations */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/fields.png"
        aria-hidden
        alt=""
        style={{
          position: "fixed",
          width: 320,
          bottom: -12,
          left: -16,
          opacity: 0.9,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/cactus.png"
        aria-hidden
        alt=""
        style={{
          position: "fixed",
          width: 122,
          top: 84,
          left: 18,
          transform: "rotate(-11deg)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/rose.png"
        aria-hidden
        alt=""
        style={{
          position: "fixed",
          width: 118,
          top: 84,
          right: 18,
          transform: "rotate(11deg)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/chicago.png"
        aria-hidden
        alt=""
        style={{
          position: "fixed",
          width: 108,
          bottom: -6,
          right: 24,
          transform: "rotate(-5deg)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      />

      <Nav />

      <main style={{ position: "relative", zIndex: 10, flex: 1 }}>
        {children}
      </main>

      {/* <PaletteDock /> */}
    </div>
  );
}
