import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();

  const data = allAnime
    .map(a => ({
      i: a.id,
      t: a.data.title,
      c: a.data.cover,
      s: a.data.status,
      y: a.data.type,
      e: a.data.episodes?.length
        ? Math.max(...a.data.episodes.map(x => x.number))
        : 0,
    }))
    .sort((a, b) => a.t.localeCompare(b.t, 'id-ID'));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};