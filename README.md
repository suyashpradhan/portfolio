# suyashpradhan.com

Personal site. Astro with no UI framework: every page is static HTML, plus one serverless function for the chat. Deploys to Vercel.

## Run locally

    npm install
    npm run dev        # http://localhost:4321

## Edit content

All the words live in `src/data/site.ts`: roles, the "shipped" list, the Now section, toolbox and social links.
A social link only appears once its `href` is filled in.

## How it's put together

- `src/layouts/Base.astro`: head and SEO, header, footer, page transitions
- `src/scripts/app.ts`: all client behaviour (theme, sound, command palette, copy, clock), delegated from `document` so it survives page swaps
- `src/scripts/sound.ts`: UI sounds synthesised with Web Audio, no audio files
- `src/components/Palette.astro`: ⌘K / Ctrl+K / `/` command menu
- `public/og.png`: link-preview image for LinkedIn / X / Slack

Everything renders without JavaScript; JS only adds the extras.

## "Ask about me" chat

`/ask` streams answers from Claude through one serverless function (`src/pages/api/ask.ts`).
What it knows comes from `src/data/site.ts` plus the `extra` notes in `src/data/ask.ts`.

To switch it on, add an environment variable in Vercel (**Settings → Environment Variables**), then redeploy:

- `ANTHROPIC_API_KEY`: a key from console.anthropic.com
- `ASK_MODEL` (optional): defaults to `claude-opus-5-5`; set `claude-haiku-5-5` for a much cheaper bot

Without a key the page still loads and says the chat isn't switched on yet.
Guard rails: same-origin requests only, 600 characters per question, the last 10 messages kept,
20 questions per visitor every 10 minutes, and short answers. Also set a monthly spend limit in the Anthropic Console.

To test locally: `ANTHROPIC_API_KEY=... npm run dev`.

## Deploy

Push to `main`. Vercel builds and deploys it. `vercel.json` pins the framework (Astro), the build command, and Node 22 comes from `package.json`, so the Vercel project's own preset doesn't matter.
