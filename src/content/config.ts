import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['intro', 'intermediate', 'deep-dive']).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});

const nuggets = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),           // e.g., "Nuggets #12"
    number: z.number(),          // e.g., 12 (for URL and display)
    dateRange: z.string(),       // e.g., "Jan 15-28, 2025"
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, nuggets };
