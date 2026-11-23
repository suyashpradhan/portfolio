// Everything you'd want to edit lives here.

export const site = {
  name: "Suyash Pradhan",
  role: "Product & AI Engineer",
  title: "Suyash Pradhan — Product & AI Engineer",
  description:
    "Product engineer in Bengaluru. Eight years shipping fintech, identity and SaaS products end to end, now building with AI.",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "suyashpradhan07@gmail.com",
  resume: "/suyash-pradhan-resume.pdf",
};

// Links only show up on the site if `href` is filled in.
export const socials: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/suyashpradhan9" },
  { label: "GitHub", href: "https://github.com/suyashpradhan" },
  { label: "Product Hunt", href: "https://www.producthunt.com/@suyash_pradhan7" },
  { label: "X", href: "" }, // e.g. "https://x.com/your-handle"
].filter((s) => s.href);

export type Role = {
  id: string;
  company: string;
  note?: string;
  role: string;
  place?: string;
  from: string;
  to: string;
  summary: string;
  points: string[];
};

export const roles: Role[] = [
  {
    id: "cai",
    company: "CAI Software",
    role: "Senior Frontend Engineer",
    place: "Bengaluru",
    from: "2024",
    to: "Now",
    summary: "Rebuilding an enterprise platform end to end: mobile app, data layer and analytics.",
    points: [
      "Rebuilding the mobile platform from scratch in React Native, with offline sync for crews working with little or no signal.",
      "Designed the GraphQL data layer and cut redundant network calls across the client.",
      "Built analytics dashboards in React and TypeScript for enterprise customers.",
      "Write the technical design docs, run the scrum ceremonies and interview engineers.",
    ],
  },
  {
    id: "aiprise",
    company: "AiPrise",
    note: "YC S22",
    role: "Founding Frontend Engineer",
    from: "2023",
    to: "2024",
    summary: "Took an AI-powered identity platform from nothing to 50+ paying customers.",
    points: [
      "Only frontend engineer on a B2B identity and onboarding platform, live across the US and Africa and bringing in $40–60K a month.",
      "Built the Web SDK that lets clients drop onboarding flows into their own products.",
      "Moved every live account onto Auth0 without a minute of downtime.",
    ],
  },
  {
    id: "bureau",
    company: "Bureau",
    role: "Founding Frontend Engineer",
    place: "Bengaluru",
    from: "2021",
    to: "2023",
    summary: "Shipped a checkout, identity SDKs and a fraud engine with AI-driven decisions.",
    points: [
      "Co-built a no-code fraud orchestration platform with AI-driven decision flows, used by risk teams across APAC.",
      "Built BlazeCheckout, a Shopify checkout used by 30+ merchants and handling 1,000+ orders a day.",
      "Shipped the company's first identity SDKs (Liveness Check and DigiLocker Aadhaar), live with three large customers.",
      "Set up the monorepo, took test coverage from zero to 60%, and wired CI/CD with Terraform and GitHub Actions.",
    ],
  },
  {
    id: "avhan",
    company: "Avhan Technologies",
    role: "UI Developer",
    place: "Mumbai",
    from: "2020",
    to: "2021",
    summary: "Cloud analytics dashboards for enterprise and small-business clients.",
    points: [
      "Turned messy reporting requirements into clean, usable dashboards, from Figma to React.",
    ],
  },
  {
    id: "domain",
    company: "Domain Edutech",
    role: "Founding Team, Full Stack",
    place: "Mumbai",
    from: "2017",
    to: "2020",
    summary: "Early hire at an ed-tech startup. Built the live-class product from scratch.",
    points: [
      "Designed and built the live-class dashboard for JEE, NEET and CBSE students, front to back in PHP and MySQL.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  native?: string; // name in Devanagari, shown small next to the title
  badge?: string;
  pitch: string; // one line, shown on cards
  about: string; // a short paragraph, shown on /projects
  how: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

const gh = (repo: string) => `https://github.com/suyashpradhan/${repo}`;

// Side projects, in the order they're shown. The first one is featured.
export const projects: Project[] = [
  {
    id: "sachet",
    name: "Sachet",
    native: "सचेत",
    badge: "Top 50 of 13,500 · OpenAI × Varun Mayya hackathon",
    pitch: "Report financial cyber fraud by simply saying what happened.",
    about:
      "A prototype of a calmer way to report cyber fraud to India's NCRP. Speak, type or upload screenshots; AI prepares the complaint, and the citizen reviews every field before it's submitted. English and Hindi.",
    how: [
      "Live voice transcription with Sarvam, evidence-grounded extraction with the OpenAI Responses API",
      "Every AI draft is validated with Zod, then mapped to an NCRP-compatible complaint",
      "The AI never decides legal routes: deterministic rules and a review step keep people in control",
    ],
    stack: ["Next.js", "OpenAI", "Sarvam", "Zod", "PostHog", "Vercel"],
    links: [
      { label: "Live", href: "https://sachet-ncrp-prototype.vercel.app" },
      { label: "GitHub", href: gh("sachet-a-ncrp-prototype") },
    ],
  },
  {
    id: "am-i-underpaid",
    name: "Am I Underpaid",
    badge: "Launched on Product Hunt · Hundreds of users",
    pitch: "A free salary check for professionals in India.",
    about:
      "Describe your role, experience, company and pay; it researches public market data, builds a comparison cohort and tells you if you're underpaid, at market or above. When the evidence is weak it says so instead of guessing.",
    how: [
      "A multi-step research agent: cohort interpreter, evidence scout, source auditor, analyst and verifier",
      "Live web search via LinkUp; outliers trigger a second verification search",
      "Convex validates every band before it's shown, and caches results",
    ],
    stack: ["React", "Convex", "Hermes agents", "LinkUp", "PostHog", "Razorpay"],
    links: [
      { label: "Live", href: "https://am-i-underpaid.in" },
      { label: "Product Hunt", href: "https://www.producthunt.com/products/am-i-underpaid" },
      { label: "GitHub", href: gh("am-i-underpaid-app") },
    ],
  },
  {
    id: "satark",
    name: "Satark",
    native: "सतर्क",
    pitch: "A call-safety assistant I built for my Hindi- and Marathi-speaking parents.",
    about:
      "Put a suspicious call on speaker and Satark listens. It transcribes the conversation as it happens and warns before you share an OTP, pay, scan a QR code or install an app, showing the exact phrase that triggered it.",
    how: [
      "Near-live transcription in 5.5-second segments with Sarvam Saaras v3",
      "Fast deterministic rules first; Sarvam-30B judges indirect or mixed-language social engineering",
      "Installable on a phone; audio is processed in memory and never stored",
    ],
    stack: ["Next.js", "Sarvam STT", "Sarvam-30B", "PostHog", "PWA"],
    links: [
      { label: "Live", href: "https://satark-app.vercel.app" },
      { label: "GitHub", href: gh("satark-app") },
    ],
  },
  {
    id: "kahaani",
    name: "Kahaani",
    native: "कहानी",
    pitch: "Keep a grandparent's stories, in their own voice.",
    about:
      "A family member sends one meaningful question; the elder hears it in Hindi, Marathi or English and records an answer. The recording is the memory. Transcripts and translations just make it readable across generations.",
    how: [
      "Voice in and out with Sarvam speech-to-text, translation and text-to-speech",
      "Audio is stored first, then processed in the background, so nothing is lost",
      "Privacy-first analytics: no names, questions, transcripts or audio ever leave",
    ],
    stack: ["Next.js", "Convex", "Sarvam voice", "PostHog"],
    links: [
      { label: "Live", href: "https://kahaani-app-dev.vercel.app" },
      { label: "GitHub", href: gh("kahaani-app") },
    ],
  },
  {
    id: "relay",
    name: "Relay",
    pitch: "An autonomous agent that repairs an overloaded workday.",
    about:
      "Give it a packed day, or import one from Google Calendar, and an agent reshuffles it. The model never edits the schedule directly: it picks one narrow tool at a time, and plain code decides what's allowed and when the day is fixed.",
    how: [
      "OpenAI tool calling with Zod-validated arguments and visible retries",
      "Deterministic tools accept or reject each action; an independent validator ends the run",
      "Runs can be replayed from recorded tool results without another model call",
    ],
    stack: ["Next.js", "OpenAI agents", "Zod", "Drizzle", "PostHog"],
    links: [
      { label: "Live", href: "https://relay-an-autonomous-agent.vercel.app" },
      { label: "GitHub", href: gh("relay-an-autonomous-agent") },
    ],
  },
];

// Short list on the home page. Each links to its role on /work.
export const shipped = [
  { name: "AI identity & onboarding", detail: "AiPrise · 50+ customers", href: "/work#aiprise" },
  { name: "Fraud engine with AI decisions", detail: "Bureau · APAC", href: "/work#bureau" },
  { name: "BlazeCheckout", detail: "1,000+ orders a day", href: "/work#bureau" },
  { name: "Enterprise field platform", detail: "CAI Software", href: "/work#cai" },
];

export const now = [
  { k: "Building", v: "An enterprise field platform at CAI Software" },
  { k: "Exploring", v: "AI engineering: voice agents, tool-calling agents and evals" },
  { k: "Based in", v: "Bengaluru, India" },
];

export const toolbox: { group: string; items: string[] }[] = [
  { group: "AI", items: ["OpenAI", "Claude", "Sarvam voice AI", "Tool-calling agents", "Zod schemas"] },
  { group: "Product", items: ["React", "TypeScript", "Next.js", "React Native", "PostHog"] },
  { group: "Systems", items: ["Node.js", "Python", "GraphQL", "Convex", "Auth0"] },
  { group: "Shipping", items: ["Jest", "Cypress", "Terraform", "GitHub Actions", "AWS"] },
];
