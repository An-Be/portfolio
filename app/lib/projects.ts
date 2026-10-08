export type ProjectStatus = "concept" | "build" | "shipped" | "paused";

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; color: string; filled: boolean; message: string }
> = {
  concept: {
    label: "Concept",
    color: "var(--text-subtle)",
    filled: false,
    message: "This is still just an idea. The build hasn't started yet.",
  },
  build: {
    label: "Build",
    color: "var(--accent-yellow)",
    filled: true,
    message: "This is actively being built. Check back soon.",
  },
  shipped: {
    label: "Shipped",
    color: "var(--accent-blue)",
    filled: true,
    message: "",
  },
  paused: {
    label: "Paused",
    color: "var(--accent-red)",
    filled: true,
    message: "This was in progress, then paused. It might pick back up later.",
  },
};

export type Project = {
  id: string;
  title: string;
  year: string;
  focus: string;
  summary: string;
  why?: string;
  stack: string[];
  status: ProjectStatus;
  icon?: string;
  url?: string;
  note?: string;
  sections: { h: string; p: string | string[] }[];
};

export const PROJECTS: Project[] = [
  {
    id: "tab-math",
    title: "TabMath",
    year: "2026",
    focus: "Fairness",
    summary:
      "Split the bill in 60 seconds. Snap the receipt, tap who had what, send everyone a link with their total. No app, no login for your friends, no money moving through me.",
    why: "I was out with a group of 13 and the restaurant would only do one check because of our party size. The organizer had a hard time splitting it, so in the end they divided up tax and tip and sent a screenshot of the receipt for each of us to find our own items. It worked, but it should be easier.",
    stack: [
      "Next.js 16",
      "Gemini",
      "Prisma + Postgres",
      "Clerk",
      "Uploadthing",
    ],
    status: "shipped",
    icon: "/images/tab-math-icon.png",
    url: "tabmath.com",
    sections: [
      {
        h: "What it does",
        p: "One person starts a split, no account required (guest sessions work out of the box, and if they sign up later their split comes with them automatically). They upload a photo of the receipt. Gemini reads the image and extracts the line items, tax, and tip, so nothing gets typed in by hand. The organizer taps who had what, or just splits the whole thing evenly. Everyone else opens a shareable link, picks their name, and sees only what they owe, with a button that hands off to the organizer's Venmo, Cash App, Zelle, or Stripe link. The dashboard shows who owes what and who's already paid.",
      },
      {
        h: "A few details I cared about",
        p: [
          "Re-uploading the same receipt photo doesn't re-call the model or duplicate line items. The image is hashed, and a repeat hash just reuses what was already extracted.",
          "Participants never create an account. The split lives behind a share token, so finding your name and seeing your total works with no login.",
          "The math is exact to the cent. Tax and tip get prorated by each person's share of the subtotal, and any leftover penny from rounding gets handed out one at a time instead of disappearing or getting double counted.",
          "Rate limiting runs on the same Postgres database instead of a separate Redis instance, since the volume never justified standing up another service.",
        ],
      },
    ],
  },
  {
    id: "your-turn",
    title: "Your Turn",
    year: "2026",
    focus: "Rhythm",
    summary:
      "Whose turn is it? One shared link for two people, no login. It shows who's up today, and one tap flips it for next time.",
    why: "My wife and I play Wordle, Spotle, and a few other games together and switch who goes first. I was tracking it in my Notes app with a phone shortcut that copies the date on a double tap. It worked, but I wanted a real place for it. Once I built it, I realized it works for anything two people take turns on.",
    stack: ["Next.js 15", "Prisma + Postgres", "Neon", "Tailwind", "Vercel"],
    status: "build",
    sections: [
      {
        h: "What it does",
        p: "One person creates a tracker with two names and gets a secret link to share. The page shows whose turn it is. Tap Done and it flips to the other person. Skip if today's not a day for it, and the turn stays where it is. Swap trades it, and Undo takes back a mistake. Rotating the link kills the old URL if it ever ends up somewhere it shouldn't.",
      },
      {
        h: "A few details I cared about",
        p: [
          "It doesn't assume things split 50/50. The turn only moves when someone taps Done, so skipping a day, or a week, is fine. It picks up where you left off.",
          "Two phones tapping at the same time is handled. Every change locks the tracker row inside a transaction, so taps get applied one after the other instead of canceling each other out.",
          "The link is the login, so it's treated like one: 128-bit random tokens, no referrer sent to other sites, never indexed, and page titles never include names so link previews stay private.",
          "It uses the same design system as TabMath: monochrome, Space Grotesk and Geist Mono, zero radius, 1px borders. Tiny tools for keeping things fair.",
        ],
      },
    ],
  },
  {
    id: "pet-intake-tracker",
    title: "Pawperwork",
    year: "2026",
    focus: "Compliance",
    summary:
      "The paperwork layer for pet care businesses: groomers, boarders, daycares, and walkers. One branded intake link per business; pet owners submit profiles, upload vaccination records, and e-sign waivers from their phone.",
    why: "Pet care businesses lose bookings to clipboard friction and expired vax cards, and one unvaccinated dog in a daycare is a liability problem, not an inconvenience.",
    stack: [
      "Next.js 16",
      "Prisma 7 + Postgres",
      "Clerk",
      "Resend",
      "react-pdf",
      "Vercel Cron",
    ],
    status: "paused",
    note: "Spec complete, parked while TabMath ships.",
    sections: [
      {
        h: "What it does",
        p: "A business gets a public intake link. Clients fill out pet profiles, upload vaccination records, and e-sign waivers. The dashboard surfaces every pet missing a required vaccination, expiring soon, or already expired, and a daily cron sends reminder emails on top of it. No booking, no payments, no POS: paperwork only, on purpose.",
      },
      {
        h: "A few details I cared about",
        p: [
          "Vaccination status is derived, never stored: computed from the expiry date on every read, so it can never drift out of sync with reality.",
          "Reminder windows are disjoint (15–30 / 8–14 / 0–7 days, then expired), so a single cron run fires at most one reminder per record. No duplicate nagging.",
          "Waivers are versioned. Every signature pins the exact version and a SHA-256 hash of what was signed, so terms can never be rewritten underneath someone.",
        ],
      },
    ],
  },
  {
    id: "commission-links",
    title: "Commission Links",
    year: "2026",
    focus: "Trust",
    summary:
      "One link per commission, with terms and a deposit built in, so artists stop getting burned by ghosting and endless revisions.",
    stack: [],
    status: "concept",
    sections: [],
  },
  {
    id: "zine-distro",
    title: "Zine Distro",
    year: "2026",
    focus: "Distribution",
    summary:
      "A link-in-bio for zine makers: browse, trade, and buy, all through one pasted payment link.",
    stack: [],
    status: "concept",
    sections: [],
  },
];
