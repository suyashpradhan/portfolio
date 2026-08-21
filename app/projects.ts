export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  image: string;
  imageSmall: string;
  alt: string;
  accent: string;
  ink: string;
  objectPosition: string;
  imageScale: number;
};

export const projects: Project[] = [
  {
    slug: "kahaani",
    title: "Kahaani",
    eyebrow: "Stories worth keeping",
    description: "A gentler way to hold on to voices, people and family stories.",
    tags: ["Story", "Voice"],
    image: "/clay/6.webp",
    imageSmall: "/clay/6-720.webp",
    alt: "Clay characters sharing a story from an open book",
    accent: "#d69056",
    ink: "#35251e",
    objectPosition: "50% 42%",
    imageScale: 1.04,
  },
  {
    slug: "voice-notes",
    title: "Voice → action",
    eyebrow: "Speak first. Sort later.",
    description: "Turning spoken thoughts into clean, useful next steps.",
    tags: ["Voice", "Product"],
    image: "/clay/7.webp",
    imageSmall: "/clay/7-720.webp",
    alt: "Clay character speaking into a microphone as a checklist appears",
    accent: "#657b58",
    ink: "#f9f0df",
    objectPosition: "73% 48%",
    imageScale: 1.09,
  },
  {
    slug: "visual-library",
    title: "Visual library",
    eyebrow: "A place for every screen",
    description: "Making screenshots easier to sort, find and use again.",
    tags: ["Web", "Workflow"],
    image: "/clay/8.webp",
    imageSmall: "/clay/8-720.webp",
    alt: "Clay character organizing image panels into wooden drawers",
    accent: "#68839b",
    ink: "#f9f0df",
    objectPosition: "78% 50%",
    imageScale: 1.12,
  },
  {
    slug: "epfo",
    title: "EPFO",
    eyebrow: "Dense systems, human scale",
    description: "Making a document-heavy workflow feel a little less formidable.",
    tags: ["Civic tech", "UX"],
    image: "/clay/9.webp",
    imageSmall: "/clay/9-720.webp",
    alt: "Clay character navigating documents toward an institutional building",
    accent: "#cf6d58",
    ink: "#35251e",
    objectPosition: "69% 50%",
    imageScale: 1.08,
  },
  {
    slug: "coming-soon",
    title: "More coming soon",
    eyebrow: "The light is still on",
    description: "Still cooking.",
    tags: ["In progress"],
    image: "/clay/10.webp",
    imageSmall: "/clay/10-720.webp",
    alt: "Clay character with round glasses studying a glowing orb",
    accent: "#e2a83e",
    ink: "#35251e",
    objectPosition: "70% 48%",
    imageScale: 1.1,
  },
];
