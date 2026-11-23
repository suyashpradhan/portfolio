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

// Short list on the home page. Each links to its role on /work.
export const shipped = [
  { name: "AI identity & onboarding", detail: "AiPrise · 50+ customers", href: "/work#aiprise" },
  { name: "Fraud engine with AI decisions", detail: "Bureau · APAC", href: "/work#bureau" },
  { name: "BlazeCheckout", detail: "1,000+ orders a day", href: "/work#bureau" },
  { name: "Enterprise field platform", detail: "CAI Software", href: "/work#cai" },
];

export const now = [
  { k: "Building", v: "An enterprise field platform at CAI Software" },
  { k: "Exploring", v: "AI engineering: LLM features, agents, retrieval and evals" },
  { k: "Based in", v: "Bengaluru, India" },
];

export const toolbox: { group: string; items: string[] }[] = [
  { group: "Product", items: ["React", "TypeScript", "React Native", "Tailwind CSS"] },
  { group: "Systems", items: ["Node.js", "Python", "GraphQL", "React Query", "Auth0"] },
  { group: "Shipping", items: ["Jest", "Cypress", "Terraform", "GitHub Actions", "AWS"] },
];
