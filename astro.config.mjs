// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import rehypeExternalLinks from "rehype-external-links";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeFigure from "rehype-figure";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },

  integrations: [
    mermaid({
      theme: "neutral",
      autoTheme: true,
    }),
    react(),
    sitemap({
      // CMS 관리자 페이지는 검색엔진에 노출하지 않는다
      filter: (page) => !page.includes("/admin"),
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }], rehypeKatex, rehypeFigure],
  },


  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  site: "https://littlesealstudio.kr",
});
