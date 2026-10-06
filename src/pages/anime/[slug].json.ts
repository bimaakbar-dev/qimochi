// src/pages/anime/[slug].json.ts
import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';

export async function getStaticPaths() {
  const allAnime = await getAllAnime();
  return allAnime.map((anime) => ({
    params: { slug: anime.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(
      JSON.stringify({ error: { code: 'BAD_REQUEST', message: 'Missing slug' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const allAnime = await getAllAnime();
  const anime = allAnime.find((a) => a.id === slug);

  if (!anime) {
    return new Response(
      JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Anime not found' } }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = {
    id: anime.id,
    title: anime.data.title,
    cover: anime.data.cover,
    status: anime.data.status,
    type: anime.data.type,
    rating: anime.data.rating,
    releaseDate: anime.data.releaseDate,
    genres: anime.data.genre,
    studio: anime.data.studio,
    totalEpisodes: anime.data.episodes.length,
    episodes: anime.data.episodes,
  };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};