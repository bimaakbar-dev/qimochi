import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const anime = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anime' }),
  schema: z.object({
    title: z.string(),
    cover: z.url(),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus']),
    genre: z.array(z.string()).min(1),
    studio: z.string(),
    tahun: z.number().int().min(1900),
    rating: z.number().min(0).max(10),
    addedAt: z.coerce.date(),

    episodes: z.array(
      z.object({
        number: z.number().int().positive(),
        title: z.string().optional(),
        streams: z.array(
          z.object({
            quality: z.string(),
            servers: z.array(
              z.object({
                name: z.string(),
                url: z.url(),
              })
            ),
          })
        ),
        downloads: z
          .array(
            z.object({
              quality: z.string(),
              size: z.string(),
              servers: z.array(
                z.object({
                  name: z.string(),
                  url: z.url(),                        // ← Zod 4
                })
              ),
            })
          )
          .optional(),
      })
    ),

    batch: z
      .array(
        z.object({
          quality: z.string(),
          size: z.string(),
          servers: z.array(
            z.object({
              name: z.string(),
              url: z.url(),                              // ← Zod 4
            })
          ),
        })
      )
      .optional(),
  }),
});

export const collections = { anime };