// Everything you'd want to edit lives here.

export const site = {
  name: "Suyash Pradhan",
  title: "Suyash Pradhan — Frontend Engineer",
  description:
    "Senior frontend engineer in Bengaluru. Eight years building product interfaces, SDKs and the systems behind them.",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "suyashpradhan07@gmail.com",
  resume: "/suyash-pradhan-resume.pdf",
};

// Links only show up on the site if `href` is filled in.
// Add your GitHub / X handles here and they'll appear everywhere automatically.
export const socials: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/suyashpradhan9" },
  { label: "GitHub", href: "" }, // e.g. "https://github.com/your-handle"
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
    points: [
      "Rebuilding an enterprise mobile platform from scratch in React Native, with offline-first sync for crews working with little or no signal.",
      "Designed the GraphQL data layer and cut redundant network calls across the client.",
      "Built analytics dashboards in React and TypeScript, and write the design docs that come before them.",
    ],
  },
  {
    id: "aiprise",
    company: "AiPrise",
    note: "YC S22",
    role: "Founding Frontend Engineer",
    place: "",
    from: "2023",
    to: "2024",
    points: [
      "Only frontend engineer on an identity and onboarding platform. Took it from nothing to 50+ customers across the US and Africa.",
      "Built the Web SDK that lets clients drop onboarding into their own products.",
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
    points: [
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
    points: [
      "Turned messy reporting requirements into cloud analytics dashboards for enterprise and small-business clients.",
    ],
  },
  {
    id: "domain",
    company: "Domain Edutech",
    role: "Founding Team, Full Stack",
    place: "Mumbai",
    from: "2017",
    to: "2020",
    points: [
      "Early hire at an ed-tech startup for JEE, NEET and CBSE students. Designed and built the live-class dashboard from scratch.",
    ],
  },
];

// Short list on the home page. Each links to its role on /work.
export const shipped = [
  { name: "Offline-first field app", detail: "CAI Software", href: "/work#cai" },
  { name: "AiPrise Web SDK", detail: "50+ customers", href: "/work#aiprise" },
  { name: "BlazeCheckout", detail: "1,000+ orders a day", href: "/work#bureau" },
  { name: "Liveness & DigiLocker SDKs", detail: "Bureau", href: "/work#bureau" },
];

export const toolbox = [
  "React",
  "TypeScript",
  "React Native",
  "GraphQL",
  "React Query",
  "Node.js",
  "Python",
  "Auth0",
  "Jest",
  "Cypress",
  "Terraform",
  "GitHub Actions",
  "AWS",
];
