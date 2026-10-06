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
          style={{ filter: "none", height: "auto" }}
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
          color: isPlayground ? "var(--accent-red)" : "var(--text-default)",
        }}
      >
        Playground
      </Link>
    </nav>
  );
}
