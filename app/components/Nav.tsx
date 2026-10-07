"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isPlayground = pathname.startsWith("/playground");

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px clamp(20px, 5vw, 56px)",
        background: "transparent",
        // Same trick as Cursor.tsx: difference blending flips the nav's
        // colors against whatever is underneath, so it stays visible over
        // the hero video and dark sections. Colors below are pre-inverted
        // so that on the white page they render exactly as before.
        mixBlendMode: "difference",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          textDecoration: "none",
        }}
      >
        <Image
          src="/images/logo-mark.svg"
          alt=""
          width={28}
          height={9.33}
          // invert + difference cancel out on white, so the logo keeps its
          // real colors at rest and flips over darker content
          style={{ filter: "invert(1)", height: "auto" }}
        />
      </Link>

      <Link
        href="/playground"
        style={{
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: "0.08em",
          textDecoration: "none",
          padding: "6px 2px",
          // Inverses of --accent-red (#df2935) and --text-default (#171717),
          // so they read as red and ink on the white page
          color: isPlayground ? "#20d6ca" : "#e8e8e8",
        }}
      >
        Playground
      </Link>
    </nav>
  );
}
