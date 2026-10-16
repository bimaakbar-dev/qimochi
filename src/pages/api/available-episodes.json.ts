import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();

  const map: Record<string, number[]> = {};

  for (const anime of allAnime) {
    const eps = anime.data.episodeList;
    if (eps.length === 0) continue;

    map[anime.id] = eps
      .map((e) => e.number)
      .sort((a, b) => a - b);
  }

  return new Response(JSON.stringify(map), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control':
        'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};