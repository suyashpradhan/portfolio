# suyashpradhan.com

A small static site built with Astro. There's no framework runtime: just HTML, CSS and a few lines of JS.

## Run locally

    npm install
    npm run dev        # http://localhost:4321

## Edit content

All the text you'd want to change is in `src/data/site.ts`: roles, the "shipped" list, toolbox and social links.
A social link only appears once its `href` is filled in.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com, click **Add New → Project** and import the repo. Vercel detects Astro, so leave every setting at its default.
3. Under **Settings → Domains**, add `suyashpradhan.com`.

Or, from this folder: `npx vercel`.
