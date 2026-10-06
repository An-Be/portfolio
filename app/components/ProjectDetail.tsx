import Link from "next/link";
import type { Project } from "../lib/projects";
import { STATUS_META } from "../lib/projects";
import Tag from "./ui/Tag";
import Brush from "./Brush";

export default function ProjectDetail({ project }: { project: Project }) {
  const meta = STATUS_META[project.status];
  const isUnbuilt = project.sections.length === 0;

  return (
    <div
      className="project-detail-copy"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding:
          "max(80px, clamp(36px, 6vw, 88px)) clamp(20px, 5vw, 56px) clamp(36px, 6vw, 88px)",
      }}
    >
      <Link
        href="/#projects"
        style={{
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          fontSize: 12,
          letterSpacing: "0.08em",
          color: "var(--text-default)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          minHeight: 44,
          marginBottom: 24,
        }}
      >
        ← All projects
      </Link>
      <div
        className="project-detail-meta"
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        {project.icon && (
          <div
            className="project-detail-icon"
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              border: "1px solid var(--border-ink)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.icon}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
        <span
          className="t-label eyebrow"
          style={{ color: meta.color, margin: 0 }}
        >
          {project.focus} · {meta.label}
        </span>
      </div>
      <h1 className="t-h1" style={{ margin: "6px 0 18px" }}>
        {project.title}
      </h1>
      <p className="t-body-lg" style={{ marginTop: 0 }}>
        {project.summary}
      </p>
      {project.why && (
        <p className="t-body-lg" style={{ marginTop: 14 }}>
          Why it exists: {project.why}
        </p>
      )}
      {project.url && (
        <a
          href={`https://${project.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="t-label project-detail-url"
          style={{
            display: "inline-block",
            color: "var(--accent-blue)",
            textDecoration: "none",
            marginTop: 14,
          }}
        >
          {project.url} ↗
        </a>
      )}

      {isUnbuilt ? (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              height: 1,
              background: "var(--border-default)",
              margin: "0 0 28px",
            }}
          />
          <h2 className="t-h2" style={{ margin: "0 0 10px" }}>
            <Brush color={meta.color}>{meta.label}</Brush>
          </h2>
          <p className="t-body-lg" style={{ margin: 0 }}>
            {meta.message}
          </p>
          {project.note && (
            <p className="t-body-lg" style={{ margin: "14px 0 0" }}>
              {project.note}
            </p>
          )}
        </div>
      ) : (
        <>
          <div
            className="project-stack"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              margin: "24px 0 8px",
            }}
          >
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <div
            style={{
              height: 1,
              background: "var(--border-default)",
              margin: "32px 0",
            }}
          />
          {project.sections.map((sec, i) => (
            <section
              key={i}
              className="project-section"
              style={{ marginBottom: 30 }}
            >
              <h2 className="t-h2" style={{ margin: "0 0 10px" }}>
                {sec.h}
              </h2>
              {Array.isArray(sec.p) ? (
                sec.p.map((para, j) => (
                  <p
                    key={j}
                    className="t-body-lg"
                    style={{ margin: j ? "14px 0 0" : 0 }}
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="t-body-lg" style={{ margin: 0 }}>
                  {sec.p}
                </p>
              )}
            </section>
          ))}
          {project.note && (
            <p className="t-body-lg" style={{ margin: 0 }}>
              <Brush color={meta.color}>{meta.label}</Brush>. {project.note}
            </p>
          )}
        </>
      )}
    </div>
  );
}
