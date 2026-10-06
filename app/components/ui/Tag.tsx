export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 500,
      fontSize: 11,
      padding: "7px 13px",
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--border-ink)",
      color: "var(--text-default)",
      whiteSpace: "nowrap",
      display: "inline-block",
    }}>
      {children}
    </span>
  );
}
