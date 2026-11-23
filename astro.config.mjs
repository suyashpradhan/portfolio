import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://suyashpradhan.com",
  integrations: [sitemap()],
  prefetch: { prefetchAll: true },
});
