import { type ReactNode } from "react";

type Variant = "primary" | "outline" | "pinned" | "ghost";

export default function Button({
  variant = "primary",
  children,
  onClick,
  type = "button",
  href,
}: {
  variant?: Variant;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
}) {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 500,
    fontSize: 13,
    borderRadius: "var(--radius-md)",
    padding: "13px 24px",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    textDecoration: "none",
    transition: `transform var(--duration-fast) var(--ease-spring), background var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast)`,
  };

  const styles: Record<Variant, React.CSSProperties> = {
    primary:  { background: "var(--border-ink)", color: "var(--text-inverse)" },
    outline:  { background: "transparent", color: "var(--text-default)", border: "1px solid var(--border-ink)" },
    pinned:   { background: "var(--accent-yellow)", color: "var(--text-default)", border: "1px solid var(--border-ink)" },
    ghost:    { background: "rgba(255,255,255,0.10)", color: "#f4efe4", border: "1px solid rgba(255,255,255,0.5)", backdropFilter: "blur(3px)" },
  };

  const style = { ...base, ...styles[variant] };

  if (href) {
    return <a href={href} style={style}>{children}</a>;
  }
  return <button type={type} style={style} onClick={onClick}>{children}</button>;
}
