import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';

const MAX_LEN = 240;

function plainExcerpt(input: string | undefined, maxLen = MAX_LEN): string {
  if (!input) return '';
  const cleaned = input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length <= maxLen
    ? cleaned
    : cleaned.slice(0, maxLen).trimEnd() + '…';
}

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();
  const map: Record<string, string> = {};

  for (const anime of allAnime) {
    const excerpt = plainExcerpt(anime.body);
    if (excerpt) map[anime.id] = excerpt;
  }

  return new Response(JSON.stringify(map), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control':
        'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
