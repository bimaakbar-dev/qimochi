// src/content.config.ts
import { 
  defineCollection
} from "astro:content";

import { glob } from "astro/loaders";
import { z } from "astro/zod";

const METADATA = z.object({
  slug: z.string().optional(),
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date().optional(),
  lastUpdated: z.coerce.date().optional(),
  cover: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
});

const SEO = z.object({
  title: z.string(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().default(false).optional(),
});

const ANIMEDATA = z.object({
  slug: z.string().optional(),
  title: z.string(),
  altTItle: z.array(z.string()).optional(),

  releaseDate: z.coerce.date().optional(),
  pubDate: z.coerce.date().optional(),

  studios: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  totalEpisode: z.number().optional(),
  types: z.enum(
    [
      'TV', 
      'OVA', 
      'MOVIE', 
      'SPECIALS'
    ]
  ).optional(),
  status: z.enum(
    [
      'Ongoing', 
      'Completed', 
      'Upcoming'
    ]
  ).optional(),
  rating:  z.number().min(0).max(10).optional(),
  poster: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

const ANIMEDL = z.array(
  z.object({
    quality: z.enum(
      [
        '360p',
        '720p', 
        '1080p'
      ]
    ),
    url: z.url().optional(),
    size: z.number().optional(),
    server: z.string().optional()
  })
)

const AUTHOR = z.object({
  author: z.object({
    name: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  })
});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}", deferRender: true }),
  schema: z.object({
    ...METADATA.shape,
    ...AUTHOR.shape,
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    seo: SEO,
  }),
});

const anime = defineCollection({
  loader: glob({ base: "./src/content/anime", pattern: "**/*.{md,mdx}", deferRender: true }),
  schema: z.object({
    ...ANIMEDATA.shape,
    download: ANIMEDL,
    ...AUTHOR.shape,
    seo: SEO,
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}", deferRender: true }),
  schema: z.object({
    ...METADATA.shape,
    category: z.string().optional(),
    order: z.number().optional(),
    seo: SEO,
  }),
});

const legal = defineCollection({
  loader: glob({ base: "./src/content/legal", pattern: "**/*.{md,mdx}", deferRender: true }),
  schema: z.object({
    ...METADATA.shape,
  }),
});

export const collections = {
  blog,
  anime,
  docs,
  legal
};
