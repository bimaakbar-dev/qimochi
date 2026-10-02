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

    // Tanggal rilis resmi anime — FIXED, isi sekali
    releaseDate: z.coerce.date(),

    // Tanggal update terakhir — DINAMIS, update manual tiap tambah episode
    addedAt: z.coerce.date(),

    rating: z.number().min(0).max(10),

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
                  url: z.url(),
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
              url: z.url(),
            })
          ),
        })
      )
      .optional(),
  }),
});

export const collections = { anime };