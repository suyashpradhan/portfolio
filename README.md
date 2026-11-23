# suyashpradhan.com

Personal site. Astro, static output, no UI framework. Deploys to Vercel with zero config.

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

## Deploy

Push to `main`. Vercel builds and deploys it. In Vercel, the framework preset should be **Astro**.
