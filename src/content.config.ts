import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: z.object({
      draft: z.boolean(),
      date: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.enum(["engineering", "workflow", "strategy", "devlog"]),
      tags: z.array(z.string()).optional().default([]),
      author: z.string().optional().default("Little Seal Studio"),
    }),
  }),

  // 프로젝트별 법적 문서 (개인정보처리방침·이용약관).
  // md 파일 하나가 문서 하나이며, URL 은 /{kind === "privacy" ? "privacy" : "terms"}/{project} 로 생성된다.
  // 새 프로젝트를 추가하려면 legal/template.md 를 복사해 채우면 된다.
  // 주의: 스토어 심사에 제출한 URL 이므로 발행 후 project 값을 바꾸면 링크가 깨진다.
  legal: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
    schema: z.object({
      draft: z.boolean().optional().default(false),
      project: z.string(), // URL 경로 (projects-config 의 id 와 맞춘다)
      appName: z.string(),
      eyebrow: z.string().optional(),
      kind: z.enum(["privacy", "terms"]),
      summary: z.string(), // 헤더 카드와 메타 설명에 쓰이는 한두 문장 요약
      updatedAt: z.string(), // 예: "2026년 7월 30일"
    }),
  }),
};
