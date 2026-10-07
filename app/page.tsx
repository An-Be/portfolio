"use client";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Nav from "./components/Nav";
import Button from "./components/ui/Button";
import Brush from "./components/Brush";
import Tag from "./components/ui/Tag";
import PaletteDock from "./components/PaletteDock";
import Loader from "./components/Loader";
import EntryTable, { type EntryRow } from "./components/EntryTable";
import { PROJECTS, STATUS_META, type ProjectStatus } from "./lib/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Hero video is H.264 MP4 so it plays in every browser. The original
// 100_2605.MOV is Motion JPEG, which Chrome can't decode.
const HERO_VIDEO = "/videos/hero.mp4";
const HERO_POSTER = "/videos/hero-poster.jpg";
const LOADER_SEEN_KEY = "abp-loader-seen";

const SURFACES = [
  "Link Agent Wallet",
  "UCP",
  "MPP",
  "SPT",
  "Connect",
  "Stripe Terminal",
  "Metronome",
];

const PROJECT_ROWS: EntryRow[] = PROJECTS.map((p) => {
  const meta = STATUS_META[p.status];
  return {
    id: p.id,
    title: p.title,
    summary: p.summary,
    focus: p.focus,
    dotColor: meta.color,
    dotFilled: meta.filled,
  };
});

const STATUS_ORDER: ProjectStatus[] = ["concept", "build", "paused", "shipped"];

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */

type Logo = {
  name: string;
  tag?: string;
  note: string;
  tool?: string;
  sketch?: string;
  logo: string;
};

const LOGOS: Logo[] = [
  {
    name: "Dory",
    tag: "Internal tool",
    note: "Mascot for a teammate's internal tool.",
    tool: "Hand-drawn → Claude → Illustrator",
    sketch: "/images/cr-sketch.jpg",
    logo: "/images/cr-mascot.png",
  },
  {
    name: "Laptop Loft",
    tag: "Demo brand",
    note: "A fictional laptop shop. Its mark is, fittingly, a laptop.",
    tool: "Figma",
    logo: "/images/logo-laptoploft.png",
  },
  {
    name: "City of Springfield",
    tag: "Demo brand",
    note: "A civic mark that plays on the name: a young plant in a field.",
    tool: "Figma",
    logo: "/images/logo-springfield.svg",
  },
  {
    name: "Tahoe",
    tag: "Demo brand",
    note: "A peak and its mirrored reflection on the water, for Lake Tahoe.",
    tool: "Figma",
    logo: "/images/logo-tahoe.svg",
  },
];

const timeline = [
  {
    year: "2024",
    role: "Software Engineer, GTM and Marketing · Stripe",
    note: "Architecting AI-powered demo systems: Agentic Commerce, Demo Hub, and 8+ global enterprise events a year. Chicago.",
  },
  {
    year: "2022",
    role: "Software Engineer · American Express",
    note: "Built the Ask Amex customer-service chat UI in React & Redux, with real-time WebSocket messaging. Phoenix.",
  },
];

const education = [
  {
    school: "School of the Art Institute of Chicago",
    note: "Continuing Education · Intro to Graphic Design: formal design principles, typography, and visual hierarchy.",
  },
  { school: "Wilbur Wright College", note: "Associate of Arts · Chicago, IL" },
];

/* ═══════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

function Marquee() {
  const items = [
    "Design & Build",
    "·",
    "Chicago",
    "·",
    "Demos",
    "·",
    "Go-to-Market",
    "·",
    "Agentic Commerce",
    "·",
    "Tiny tools",
    "·",
    "✶",
  ];
  return (
    <div
      style={{
        overflow: "hidden",
        background: "var(--accent-yellow)",
        padding: "13px 0",
      }}
    >
      <div className="marquee-track">
        {[0, 1].map((n) => (
          <span
            key={n}
            aria-hidden={n === 1}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 30,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--palette-gray-900)",
              paddingRight: 36,
            }}
          >
            {items.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
            <Image
              src="/images/tab-math-mark.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              style={{
                display: "block",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  textarea,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const style: React.CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontSize: 18,
    padding: "11px 14px",
    border: `1px solid ${value ? "var(--border-ink)" : "var(--border-default)"}`,
    borderRadius: "var(--radius-md)",
    background: "transparent",
    color: "var(--text-default)",
    outline: "none",
    resize: "vertical",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color var(--duration-fast) var(--ease-out)",
  };
  return (
    <label
      className="contact-field"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <span className="t-label" style={{ color: "var(--text-subtle)" }}>
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        />
      )}
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [msg, setMsg] = useState(""),
    [sent, setSent] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Skip the loader if it already played earlier this session — runs before
  // paint so there's no flash of it on client-side navigations back to "/"
  useLayoutEffect(() => {
    if (sessionStorage.getItem(LOADER_SEEN_KEY) === "1") {
      setLoaded(true);
    }
  }, []);

  // Force scroll to top on a plain load — prevents browser scroll restoration
  // from landing mid-page. Skipped when the URL has a hash (e.g. /#projects)
  // so anchor navigation isn't fought.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  // GSAP scroll-triggered entrance animations
  useGSAP(
    () => {
      if (!loaded) return;

      // #7 Hero name letter stagger
      gsap.from(".hero-letter", {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        stagger: 0.035,
        ease: "power3.out",
      });

      // #5 Section heading clip/wipe reveal
      gsap.utils.toArray<HTMLElement>(".section-heading").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          y: 16,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // #6 Timeline draw-in
      const timelineLine =
        document.querySelector<HTMLElement>(".timeline-line");
      if (timelineLine) {
        gsap.from(timelineLine, {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 72%",
            end: "bottom 65%",
            scrub: 1.5,
          },
        });
      }

      // #2 Creative gallery horizontal pin
      const creativeSection = document.querySelector<HTMLElement>("#creative");
      const creativeTrack =
        document.querySelector<HTMLElement>(".creative-track");
      if (creativeSection && creativeTrack) {
        const scrollDist = creativeTrack.scrollWidth - window.innerWidth;
        if (scrollDist > 0) {
          gsap.to(creativeTrack, {
            x: -scrollDist,
            ease: "none",
            scrollTrigger: {
              trigger: creativeSection,
              pin: true,
              start: "top top",
              end: `+=${scrollDist}`,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      gsap.utils.toArray<HTMLElement>(".logo-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".timeline-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: -28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".edu-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: -28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".contact-field").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: mainRef, dependencies: [loaded] },
  );

  // Marquee speed tied to scroll velocity
  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".marquee-track");
    if (!track) return;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(track, { x: "-50%", duration: 36, ease: "none" });

    let lastVel = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) lastVel = (Math.abs(window.scrollY - lastY) / dt) * 1000;
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tickerFn = () => {
      lastVel *= 0.88;
      tl.timeScale(1 + lastVel / 900);
    };
    gsap.ticker.add(tickerFn);

    return () => {
      tl.kill();
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  const sectionPad: React.CSSProperties = {
    padding: "clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)",
  };

  const divider: React.CSSProperties = {
    height: 1,
    background: "var(--border-default)",
    margin: "44px 0 32px",
  };

  return (
    <>
      {!loaded && (
        <Loader
          onDone={() => {
            sessionStorage.setItem(LOADER_SEEN_KEY, "1");
            setLoaded(true);
          }}
        />
      )}

      <div ref={mainRef}>
        <Nav />

        {/* ─────────────────────────────────────────────────────────
            HERO
        ───────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          id="hero"
          style={{
            height: "100svh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Name strip — white background */}
          <div
            style={{
              paddingTop: 88,
              paddingBottom: 16,
              paddingLeft: "clamp(20px, 5vw, 56px)",
              paddingRight: "clamp(20px, 5vw, 56px)",
              background: "var(--surface-page)",
              flexShrink: 0,
            }}
          >
            <h1
              className="hero-name"
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 8.5vw, 7rem)",
                fontWeight: 400,
                textTransform: "uppercase",
                lineHeight: 0.92,
                letterSpacing: "0.01em",
                color: "var(--text-display)",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {"Andrea Berrocal".split("").map((ch, i) => (
                <span
                  key={i}
                  className="hero-letter"
                  style={{ display: "inline-block" }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </h1>
          </div>

          {/* Video area — fills remaining height */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
                background: "#1d2130",
              }}
            >
              <video
                poster={HERO_POSTER}
                preload="auto"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(120% 90% at 50% 44%, transparent 38%, rgba(20,24,34,0.45) 100%)",
                }}
              />

              {/* Tagline + CTAs */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 26,
                  padding: "0 24px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.15rem, 2.4vw, 1.9rem)",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: "#000",
                    textShadow: "0 1px 14px rgba(0,0,0,0.5)",
                    maxWidth: "24ch",
                    textAlign: "center",
                  }}
                >
                  I make complex products legible,
                  <br />
                  to buyers, sellers, and everyone in between.
                </p>
                <div style={{ display: "flex", gap: 14 }}>
                  <Button variant="primary" href="#projects">
                    View Projects
                  </Button>
                </div>
              </div>

              {/* Scroll cue */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  color: "rgba(244,239,228,0.85)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textShadow: "0 1px 8px rgba(0,0,0,.5)",
                }}
              >
                <span>Scroll</span>
                <svg
                  width="14"
                  height="22"
                  viewBox="0 0 14 22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <rect x="1" y="1" width="12" height="20" rx="6" />
                  <path
                    d="M7 6v3"
                    style={{ animation: "vhCue 1.8s ease-in-out infinite" }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <Marquee />

        {/* ─────────────────────────────────────────────────────────
            PROJECTS
        ───────────────────────────────────────────────────────── */}
        <section id="projects" style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              background: "var(--surface-sunken)",
              padding:
                "clamp(56px, 7vw, 96px) clamp(24px, 6vw, 80px) clamp(48px, 6vw, 72px)",
            }}
          >
            <span className="t-label eyebrow">Side Projects</span>
            <h2
              className="t-h1 section-heading"
              style={{ margin: "6px 0 10px", maxWidth: 720 }}
            >
              Things I build{" "}
              <Brush color="var(--accent-blue)">for myself</Brush>
            </h2>
            <p
              className="t-body-lg"
              style={{
                maxWidth: 560,
                marginTop: 14,
                color: "var(--text-subtle)",
              }}
            >
              Small, exact tools for the parts of life that run on trust.
            </p>
          </div>

          <div style={sectionPad}>
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {STATUS_ORDER.map((status) => {
                const meta = STATUS_META[status];
                return (
                  <span
                    key={status}
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <span
                      className="entry-dot"
                      style={
                        meta.filled
                          ? { background: meta.color, borderColor: meta.color }
                          : {
                              background: "transparent",
                              borderColor: meta.color,
                            }
                      }
                    />
                    <span className="t-caption">{meta.label}</span>
                  </span>
                );
              })}
            </div>
            <EntryTable items={PROJECT_ROWS} hrefBase="/projects/" />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            CREATIVE
        ───────────────────────────────────────────────────────── */}
        <section
          id="creative"
          style={{ position: "relative", zIndex: 10, overflow: "hidden" }}
        >
          <div
            className="creative-track"
            style={{ display: "flex", willChange: "transform" }}
          >
            {[
              // {
              //   src: "/images/cr-mascot.png",
              //   label: "Dory · mascot",
              // },
              {
                src: "/images/mim-postcard.png",
                label: "MIM · postcard · SAIC coursework",
              },
              {
                src: "/images/mim-business-card.png",
                label: "MIM · business card · SAIC coursework",
              },
              {
                src: "/images/bose-headset.jpg",
                label: "Bose · product study",
              },
              {
                src: "/images/bose-me.jpg",
                label: "Bose · portrait",
              },
              {
                src: "/images/river-under-bridge.jpg",
                label: "Riverwalk · Clark Street bridge",
              },
              {
                src: "/images/river-stairs.jpg",
                label: "Riverwalk steps · Chicago, winter",
              },
              {
                src: "/images/river-ice.jpg",
                label: "Chicago River · ice, in pieces",
              },
            ].map(({ src, label }) => (
              <figure
                key={src}
                style={{
                  margin: 0,
                  flexShrink: 0,
                  width: "100vw",
                  height: "100svh",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <figcaption
                  className="t-caption"
                  style={{
                    position: "absolute",
                    bottom: "clamp(20px, 3vw, 36px)",
                    left: "clamp(24px, 4vw, 56px)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            ABOUT
        ───────────────────────────────────────────────────────── */}
        <section id="about" style={{ position: "relative", zIndex: 10 }}>
          <div style={sectionPad}>
            <div className="about-copy" style={{ width: "100%" }}>
              <span className="t-label eyebrow">About</span>
              <h2
                className="t-h1 section-heading"
                style={{ margin: "6px 0 22px", maxWidth: 680 }}
              >
                I design the system{" "}
                <Brush color="var(--accent-blue)">and</Brush> build it
              </h2>
              <p className="t-body-lg" style={{ marginTop: 0 }}>
                I&apos;m Andrea. I work where engineering meets go-to-market:
                translating complex products into systems that technical and
                non-technical stakeholders can both trust. I started out
                shipping production front-end at American Express; now at
                Stripe, I architect the demo environments and self-serve tools
                that let global sales and solutions-architecture teams sell
                complex products without needing an engineer in the room.
              </p>
              <p className="t-body-lg">
                That work has helped influence $265M+ (and climbing) in pipeline
                across 2025 and 2026. I care about the layer most companies
                leave to chance: the one between what engineering built and the
                people who have to sell it, demo it, and trust it. That&apos;s
                where I do my best work.
              </p>

              <div style={divider} />

              <span className="t-label eyebrow">What I Build</span>
              <p className="t-body-lg" style={{ marginTop: 18 }}>
                Day to day, I own demo experiences across Stripe&apos;s product
                surface: Agentic, Billing, Payments, Connect, Terminal, and
                everything in between. Global events, enterprise GTM calls, and
                the self-serve tools that let sales teams run without an
                engineer in the room. Every product has its own constraints,
                audience, and failure modes. That's the part I actually enjoy.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  margin: "22px 0 24px",
                }}
              >
                {SURFACES.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              <Button variant="outline" href="#projects">
                See my projects
              </Button>

              <div style={divider} />

              <span className="t-label eyebrow">Timeline</span>
              <div
                className="timeline-container"
                style={{ marginTop: 18, position: "relative" }}
              >
                <div
                  className="timeline-line"
                  style={{
                    position: "absolute",
                    left: 68,
                    top: 20,
                    width: 1.5,
                    bottom: 20,
                    background: "var(--accent-red)",
                    transformOrigin: "top center",
                  }}
                />
                {timeline.map((t, i) => (
                  <div
                    key={i}
                    className="timeline-row"
                    style={{
                      display: "flex",
                      gap: 28,
                      padding: "16px 0",
                      borderBottom: "1px dashed var(--border-default)",
                    }}
                  >
                    <span
                      className="t-label timeline-year"
                      style={{
                        color: "var(--accent-red)",
                        minWidth: 56,
                        paddingTop: 4,
                      }}
                    >
                      {t.year}
                    </span>
                    <div>
                      <h3 className="t-h3" style={{ margin: "0 0 2px" }}>
                        {t.role}
                      </h3>
                      <p className="t-caption" style={{ margin: 0 }}>
                        {t.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={divider} />

              <span className="t-label eyebrow">Education</span>
              <div style={{ marginTop: 18 }}>
                {education.map((e, i) => (
                  <div
                    key={i}
                    className="edu-row"
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px dashed var(--border-default)",
                    }}
                  >
                    <h3 className="t-h3" style={{ margin: "0 0 3px" }}>
                      {e.school}
                    </h3>
                    <p className="t-caption" style={{ margin: 0 }}>
                      {e.note}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40 }}>
                <Button variant="pinned" href="#contact">
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            CONTACT
        ───────────────────────────────────────────────────────── */}
        {/* <div style={{ position: "relative", zIndex: 10, height: "56vh", overflow: "hidden", borderTop: "1.5px solid var(--border-default)", borderBottom: "1.5px solid var(--border-default)" }}>
          <video autoPlay muted loop playsInline src="/videos/lake-michigan.mov"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div> */}

        <section id="contact" style={{ position: "relative", zIndex: 10 }}>
          <div style={sectionPad}>
            <div style={{ width: "100%" }}>
              <span className="t-label eyebrow">Contact</span>
              <h2
                className="t-h1 section-heading"
                style={{ margin: "6px 0 10px" }}
              >
                Tell me what you&apos;re{" "}
                <Brush color="var(--accent-yellow)">building</Brush>
              </h2>
              <p className="t-body-lg" style={{ marginTop: 12 }}>
                Product work, a design system that&apos;s drifting, or something
                you can&apos;t quite name yet. I&apos;m interested.
              </p>

              {sent ? (
                <div
                  className="fade-up"
                  style={{
                    marginTop: 40,
                    padding: 28,
                    border: "1px solid var(--border-ink)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <h3 className="t-h2" style={{ margin: "0 0 6px" }}>
                    Got it, thank you.
                  </h3>
                  <p className="t-body" style={{ margin: 0 }}>
                    I&apos;ll be in touch within a day or two.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    marginTop: 36,
                  }}
                >
                  <Field label="Name" value={name} onChange={setName} />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    label="What's on your mind"
                    textarea
                    value={msg}
                    onChange={setMsg}
                  />
                  <div
                    className="contact-actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      marginTop: 4,
                    }}
                  >
                    <Button variant="primary" type="submit">
                      Send it
                    </Button>
                    <span className="t-caption">
                      or email info@andreaberrocal.com
                    </span>
                  </div>
                </form>
              )}

              <div style={{ height: 80 }} />
            </div>
          </div>
        </section>

        {/* <PaletteDock /> */}

        <footer
          className="site-footer"
          style={{
            background: "var(--surface-sunken)",
            borderTop: "1px solid var(--border-default)",
            padding: "22px clamp(24px, 6vw, 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="t-label" style={{ color: "var(--text-default)" }}>
            Andrea Berrocal
          </span>
          <div
            className="site-footer-links"
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:info@andreaberrocal.com"
              className="t-caption"
              style={{ color: "var(--text-subtle)", textDecoration: "none" }}
            >
              info@andreaberrocal.com
            </a>
            <span className="t-label" style={{ color: "var(--text-subtle)" }}>
              © 2026
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
