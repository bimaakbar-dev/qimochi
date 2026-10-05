// src/lib/anime.ts
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export interface EpisodeServer {
  name: string;
  url: string;
}

export interface EpisodeStream {
  quality: string;
  servers: EpisodeServer[];
}

export interface EpisodeDownload {
  quality: string;
  size: string;
  servers: EpisodeServer[];
}

export interface EpisodeData {
  number: number;
  title?: string;
  streams: EpisodeStream[];
  downloads?: EpisodeDownload[];
}

export type AnimeEntry = CollectionEntry<'anime'>;

export type HydratedAnime = Omit<AnimeEntry, 'data'> & {
  data: AnimeEntry['data'] & {
    episodes: EpisodeData[];
  };
};

const episodeModules = import.meta.glob<{ default: EpisodeData }>(
  '../data/anime/*/episodes/*.json',
  { eager: true }
);

const episodesBySlug: Record<string, EpisodeData[]> = {};

for (const [path, mod] of Object.entries(episodeModules)) {
  const match = path.match(/\/data\/anime\/([^/]+)\/episodes\/(\d+)\.json$/);
  if (!match) {
    console.warn(`[Anime] Unexpected episode path: ${path}`);
    continue;
  }

  const slug = match[1];
  if (!slug) continue;

  const data = mod.default;
  if (!data || typeof data !== 'object' || typeof data.number !== 'number') {
    console.warn(`[Anime] Invalid episode data: ${path}`);
    continue;
  }

  if (!episodesBySlug[slug]) episodesBySlug[slug] = [];
  episodesBySlug[slug].push(data);
}

for (const slug of Object.keys(episodesBySlug)) {
  episodesBySlug[slug]!.sort((a, b) => a.number - b.number);
}

async function hydrateOne(anime: AnimeEntry): Promise<HydratedAnime> {
  const episodes = episodesBySlug[anime.id] ?? [];

  return {
    ...anime,
    data: {
      ...anime.data,
      episodes,
    },
  };
}

export async function getAllAnime(): Promise<HydratedAnime[]> {
  const all = await getCollection('anime');
  return Promise.all(all.map(hydrateOne));
}

export async function getAnimeById(
  id: string
): Promise<HydratedAnime | null> {
  const anime = await getEntry('anime', id);
  if (!anime) return null;
  return hydrateOne(anime);
}

export function sortByRecent(items: HydratedAnime[]): HydratedAnime[] {
  return [...items].sort(
    (a, b) => b.data.addedAt.getTime() - a.data.addedAt.getTime()
  );
}

export function getYear(anime: HydratedAnime | AnimeEntry): number {
  return anime.data.releaseDate.getFullYear();
}