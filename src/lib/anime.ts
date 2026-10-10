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

type QimochiStatus = 'Ongoing' | 'Completed' | 'Hiatus' | 'Upcoming';
type QimochiType = 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';

export type HydratedAnime = Omit<AnimeEntry, 'data'> & {
  data: {
    title: string;
    cover: string;
    status: QimochiStatus;
    type: QimochiType;
    genre: string[];
    studio: string;
    releaseDate: Date;
    addedAt: Date;
    updatedAt?: Date;
    rating: number;
    episodes: EpisodeData[];
    franchises: Franchise[];

    titleEnglish?: string;
    titleNative?: string;
    year?: number;
    malId?: number;
    banner?: string;
    trailer?: string;
    duration?: number;
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
  if (!match) continue;

  const slug = match[1];
  const start = parseInt(match[2] ?? '0', 10);
  const end = parseInt(match[3] ?? '0', 10);
  if (!slug || isNaN(start) || isNaN(end)) continue;
  if (!Array.isArray(mod.default)) continue;

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
  franchisesBySlug[slug] = raw.filter(
    (f) => f && typeof f.slug === 'string' && !HIDDEN_RELATIONS.has(f.relation)
  );
}

function mapStatus(s: string): QimochiStatus {
  switch (s) {
    case 'airing':
      return 'Ongoing';
    case 'finished':
      return 'Completed';
    case 'upcoming':
      return 'Upcoming';
    case 'hiatus':
      return 'Hiatus';
    case 'cancelled':
      return 'Completed';
    default:
      return 'Upcoming';
  }
}

function mapType(t: string): QimochiType {
  switch (t) {
    case 'TV':
    case 'Movie':
    case 'OVA':
    case 'ONA':
    case 'Special':
      return t;
    case 'Music':
      return 'Special';
    case 'Unknown':
    default:
      return 'TV';
  }
}

function titleCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function resolveReleaseDate(
  aired: { from?: Date } | undefined,
  year: number | undefined
): Date {
  if (aired?.from instanceof Date) return aired.from;
  if (year) return new Date(Date.UTC(year, 0, 1));
  return new Date(0);
}

function resolveStudio(studios: string[] | undefined): string {
  const first = studios?.[0];
  if (!first) return 'Unknown';
  return titleCase(first);
}

function resolveGenre(genres: string[] | undefined): string[] {
  if (!genres || genres.length === 0) return ['Unknown'];
  return genres.map(titleCase);
}

function resolveRating(stats: { score?: number } | undefined): number {
  const s = stats?.score;
  if (typeof s === 'number' && s >= 0) return s;
  return 0;
}

async function hydrateOne(anime: AnimeEntry): Promise<HydratedAnime> {
  const slug = anime.id;
  const d = anime.data;

  const releaseDate = resolveReleaseDate(d.aired, d.year);
  const addedAt = d.addedAt ?? releaseDate;
  const updatedAt = d.updatedAt;

  return {
    ...anime,
    data: {
      title: d.title,
      titleEnglish: d.titleEnglish,
      titleNative: d.titleNative,

      cover: d.image ?? '',
      status: mapStatus(d.status),
      type: mapType(d.type),
      genre: resolveGenre(d.genres),
      studio: resolveStudio(d.studios),
      releaseDate,
      addedAt,
      updatedAt,
      rating: resolveRating(d.stats),

      year: d.year,
      malId: d.malId,
      banner: d.banner,
      trailer: d.trailer,
      duration: d.duration,

      episodes: episodesBySlug[slug] ?? [],
      franchises: franchisesBySlug[slug] ?? [],
    },
  };
}

export async function getAllAnime(): Promise<HydratedAnime[]> {
  const all = await getCollection('anime', ({ data }) => !data.draft);
  return Promise.all(all.map(hydrateOne));
}

export async function getAnimeById(
  id: string
): Promise<HydratedAnime | null> {
  const anime = await getEntry('anime', id);
  if (!anime || anime.data.draft) return null;
  return hydrateOne(anime);
}

export function sortByRecent(items: HydratedAnime[]): HydratedAnime[] {
  return [...items].sort(
    (a, b) => b.data.addedAt.getTime() - a.data.addedAt.getTime()
  );
}

export function getYear(anime: HydratedAnime): number {
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