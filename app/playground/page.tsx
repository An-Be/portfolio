import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Brush from "../components/Brush";

export const metadata: Metadata = {
  title: "Playground",
};

export default function PlaygroundPage() {
  return (
    <PageShell>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px",
          gap: 14,
          minHeight: "70vh",
        }}
      >
        <span className="t-label eyebrow">Playground</span>
        <h1 className="t-h1" style={{ margin: 0 }}>
          <Brush color="var(--accent-yellow)">Under construction</Brush>
        </h1>
        <p className="t-caption" style={{ marginTop: 6 }}>
          Check back soon.
        </p>
        <Link
          href="/"
          className="t-label"
          style={{
            marginTop: 18,
            color: "var(--text-default)",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          ← Back home
        </Link>
      </div>
    </PageShell>
  );
}
