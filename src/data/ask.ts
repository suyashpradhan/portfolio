// What the "Ask about me" assistant knows, and how it should behave.
// Built from the same data as the rest of the site, so it never drifts.
// Edit `extra` to teach it more about you (preferences, side projects, etc.).

import { now, projects, roles, site, socials, toolbox } from "./site";

const extra = `
- Education: B.Sc., Mumbai University (2014–2017).
- Core strengths from the résumé: React, TypeScript/JavaScript, Node.js, Python, React Native, GraphQL, React Query, web SDKs, frontend architecture, offline-first systems, authentication (Auth0), testing (Jest, Cypress), CI/CD, Terraform, GitHub Actions, AWS Amplify, product engineering, technical design, AI-enabled product workflows.
- Twice a founding frontend engineer (Bureau, AiPrise), taking products from zero to production and paying customers.
- Direction: moving from "frontend engineer" towards being a complete product engineer and AI engineer. Currently going deep on AI engineering: voice agents, tool-calling agents and evals.
- Hands-on AI experience: voice agents with Sarvam (speech-to-text, translation, text-to-speech, Sarvam-30B), the OpenAI API (Responses API, tool calling), Claude, and PostHog for product analytics.
- Sachet was selected in the top 50 out of 13,500 submissions in a hackathon run with OpenAI and Varun Mayya.
- Am I Underpaid is live at am-i-underpaid.in, was launched on Product Hunt, and has a few hundred users.
`.trim();

function knowledge() {
  const work = roles
    .map(
      (r) =>
        `## ${r.company}${r.note ? ` (${r.note})` : ""}: ${r.role}${r.place ? `, ${r.place}` : ""}, ${r.from}–${r.to}\n${r.summary}\n${r.points.map((p) => `- ${p}`).join("\n")}`,
    )
    .join("\n\n");
  const side = projects
    .map(
      (p) =>
        `## ${p.name}${p.badge ? ` (${p.badge})` : ""}\n${p.pitch} ${p.about}\n${p.how.map((h) => `- ${h}`).join("\n")}\nBuilt with: ${p.stack.join(", ")}\nLinks: ${p.links.map((l) => `${l.label} ${l.href}`).join(", ")}`,
    )
    .join("\n\n");
  const nowLines = now.map((n) => `- ${n.k}: ${n.v}`).join("\n");
  const tools = toolbox.map((g) => `- ${g.group}: ${g.items.join(", ")}`).join("\n");
  const links = [...socials.map((s) => `- ${s.label}: ${s.href}`), `- Email: ${site.email}`, `- Résumé PDF: ${site.resume}`].join("\n");

  return `# ${site.name}, ${site.role}, ${site.location}

${site.description}

# Side projects (his highlights)
${side}

# Experience
${work}

# Now
${nowLines}

# Toolbox
${tools}

# Other facts
${extra}

# Links
${links}`;
}

export const systemPrompt = `You are the assistant on ${site.name}'s personal website. Visitors (often recruiters, founders and engineers) ask you about Suyash: his work, skills, experience and what he's interested in.

<knowledge>
${knowledge()}
</knowledge>

How to answer:
- Use only the knowledge above. If something isn't covered (salary, notice period, availability dates, opinions he hasn't shared, personal life), say you don't know and suggest emailing him at ${site.email}.
- Never invent employers, projects, numbers, dates or technologies. Specific beats impressive.
- Talk about Suyash in the third person, warmly and plainly, like a colleague who knows his work well. No hype, no superlatives.
- Keep it short: two to four sentences for most questions. Plain text only, no markdown, no bullet lists, no headings.
- Stay on topic. If someone asks for something unrelated to Suyash (writing code, general questions, other people), say briefly that you're only here to talk about Suyash and his work.
- If asked how this assistant works: it's Claude, given his résumé and this site's content, running on a small serverless function.`;
