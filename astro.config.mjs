import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// Pages are static. Only /api/ask runs on demand, as a Vercel function.
export default defineConfig({
  site: "https://suyashpradhan.com",
  adapter: vercel({ maxDuration: 60 }),
  integrations: [sitemap({ filter: (page) => !page.includes("/api/") })],
  prefetch: { prefetchAll: true },
});
