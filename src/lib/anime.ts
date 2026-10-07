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

export interface Franchise {
  relation: string;
  slug: string;
  title?: string;
}

export type AnimeEntry = CollectionEntry<'anime'>;

export type HydratedAnime = Omit<AnimeEntry, 'data'> & {
  data: AnimeEntry['data'] & {
    episodes: EpisodeData[];
    franchises: Franchise[];
  };
};

interface ChunkRef {
  slug: string;
  start: number;
  end: number;
  path: string;
}

const HIDDEN_RELATIONS = new Set([
  'character',
  'adaptation',
  'contains',
  'other',
]);

const episodeModules = import.meta.glob<{ default: EpisodeData[] }>(
  '../data/anime/*/episodes/*.json',
  { eager: true }
);

const franchiseModules = import.meta.glob<{ default: Franchise[] }>(
  '../data/anime/*/franchises.json',
  { eager: true }
);

const chunksBySlug: Record<string, ChunkRef[]> = {};

for (const [path, mod] of Object.entries(episodeModules)) {
  const match = path.match(
    /\/data\/anime\/([^/]+)\/episodes\/(\d+)-(\d+)\.json$/
  );

  if (!match) {
    console.warn(`[Anime] Unexpected episode path (skip): ${path}`);
    continue;
  }

  const slug = match[1];
  const start = parseInt(match[2] ?? '0', 10);
  const end = parseInt(match[3] ?? '0', 10);

  if (!slug || isNaN(start) || isNaN(end)) {
    console.warn(`[Anime] Invalid chunk range: ${path}`);
    continue;
  }

  if (!Array.isArray(mod.default)) {
    console.warn(`[Anime] Chunk is not an array: ${path}`);
    continue;
  }

  if (!chunksBySlug[slug]) chunksBySlug[slug] = [];
  chunksBySlug[slug]!.push({ slug, start, end, path });
}

const episodesBySlug: Record<string, EpisodeData[]> = {};

for (const [slug, chunks] of Object.entries(chunksBySlug)) {
  chunks.sort((a, b) => a.start - b.start);

  const merged: EpisodeData[] = [];

  for (const chunk of chunks) {
    const mod = episodeModules[chunk.path];
    if (!mod || !Array.isArray(mod.default)) continue;
    merged.push(...mod.default);
  }

  merged.sort((a, b) => a.number - b.number);
  episodesBySlug[slug] = merged;
}

const franchisesBySlug: Record<string, Franchise[]> = {};

for (const [path, mod] of Object.entries(franchiseModules)) {
  const match = path.match(/\/data\/anime\/([^/]+)\/franchises\.json$/);
  if (!match) continue;

  const slug = match[1];
  if (!slug) continue;

  const raw = Array.isArray(mod.default) ? mod.default : [];
  const filtered = raw.filter(
    (f) => f && typeof f.slug === 'string' && !HIDDEN_RELATIONS.has(f.relation)
  );

  franchisesBySlug[slug] = filtered;
}

async function hydrateOne(anime: AnimeEntry): Promise<HydratedAnime> {
  return {
    ...anime,
    data: {
      ...anime.data,
      episodes: episodesBySlug[anime.id] ?? [],
      franchises: franchisesBySlug[anime.id] ?? [],
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

export interface EpisodePathItem {
  slug: string;
  anime: HydratedAnime;
  episode: EpisodeData;
  episodeIndex: number;
  totalEpisodes: number;
}

export async function getAllEpisodePaths(): Promise<EpisodePathItem[]> {
  const all = await getAllAnime();
  const paths: EpisodePathItem[] = [];

  for (const anime of all) {
    const eps = anime.data.episodes;
    const total = eps.length;

    eps.forEach((episode, episodeIndex) => {
      paths.push({
        slug: anime.id,
        anime,
        episode,
        episodeIndex,
        totalEpisodes: total,
      });
    });
  }

  return paths;
}

export function findEpisode(
  anime: HydratedAnime,
  episodeNumber: number
): EpisodeData | null {
  return anime.data.episodes.find((e) => e.number === episodeNumber) ?? null;
}