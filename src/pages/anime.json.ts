// src/pages/anime.json.ts
import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();

  const data = allAnime.map((a) => ({
    id: a.id,
    title: a.data.title,
    cover: a.data.cover,
    type: a.data.type,
    status: a.data.status,
    releaseDate: a.data.releaseDate.toISOString(),
    rating: a.data.rating,
    genre: a.data.genre,
    studio: a.data.studio,
    episodes: a.data.episodes.map((e) => ({ number: e.number })),
  }));

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};