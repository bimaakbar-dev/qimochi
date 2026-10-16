import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { STATUS_LABEL, TYPE_LABEL, type RawStatus, type RawType } from '~/constants';

export interface EpisodeServer { name: string; url: string; }
export interface EpisodeStream { quality: string; servers: EpisodeServer[]; }
export interface EpisodeDownload { quality: string; size: string; servers: EpisodeServer[]; }
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

export type QimochiStatus = 'Ongoing' | 'Completed' | 'Hiatus' | 'Upcoming';
export type QimochiType = 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';

export type HydratedAnime = Omit<AnimeEntry, 'data'> & {
  data: Omit<AnimeEntry['data'], 'status' | 'type'> & {
    status: QimochiStatus;
    type: QimochiType;
    cover: string;
    studio: string;
    genre: string[];
    releaseDate: Date | null;
    score: number | null;
    episodeList: EpisodeData[];
    franchises: Franchise[];
  };
};

interface ChunkRef { slug: string; start: number; end: number; path: string; }

const HIDDEN_RELATIONS = new Set([
  'character', 'adaptation', 'contains', 'other',
]);

interface RawEpisodeStreamObject {
  [quality: string]: string[];
}

interface RawEpisodeDownloadObject {
  [quality: string]: { size?: string; urls?: string[] };
}

interface RawEpisodeData {
  number: number;
  title?: string | null;
  aired?: string | null;
  duration?: number | null;
  streams?: RawEpisodeStreamObject | EpisodeStream[];
  downloads?: RawEpisodeDownloadObject | EpisodeDownload[];
}

function normalizeStreams(raw: RawEpisodeData['streams']): EpisodeStream[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as EpisodeStream[];

  return Object.entries(raw).map(([quality, urls]) => ({
    quality,
    servers: (Array.isArray(urls) ? urls : []).map((url, i) => ({
      name: `Server ${i + 1}`,
      url,
    })),
  }));
}

function normalizeDownloads(
  raw: RawEpisodeData['downloads']
): EpisodeDownload[] | undefined {
  if (!raw) return undefined;

  if (Array.isArray(raw)) return raw as EpisodeDownload[];

  const result: EpisodeDownload[] = [];
  for (const [quality, val] of Object.entries(raw)) {
    if (!val || !Array.isArray(val.urls) || val.urls.length === 0) continue;
    result.push({
      quality,
      size: val.size ?? '',
      servers: val.urls.map((url, i) => ({
        name: `Server ${i + 1}`,
        url,
      })),
    });
  }
  return result.length > 0 ? result : undefined;
}

const episodeModules = import.meta.glob<{ default: RawEpisodeData[] }>(
  '../data/anime/*/episodes/*.json',
  { eager: true }
);

const franchiseModules = import.meta.glob<{ default: Franchise[] }>(
  '../data/anime/*/franchises.json',
  { eager: true }
);

const chunksBySlug: Record<string, ChunkRef[]> = {};
for (const [path, mod] of Object.entries(episodeModules)) {
  const match = path.match(/\/data\/anime\/([^/]+)\/episodes\/(\d+)-(\d+)\.json$/);
  if (!match) continue;
  const slug = match[1];
  const start = parseInt(match[2] ?? '0', 10);
  const end = parseInt(match[3] ?? '0', 10);
  if (!slug || isNaN(start) || isNaN(end)) continue;
  if (!Array.isArray(mod.default)) continue;
  (chunksBySlug[slug] ??= []).push({ slug, start, end, path });
}

const episodesBySlug: Record<string, EpisodeData[]> = {};
for (const [slug, chunks] of Object.entries(chunksBySlug)) {
  chunks.sort((a, b) => a.start - b.start);
  const merged: EpisodeData[] = [];
  for (const chunk of chunks) {
    const mod = episodeModules[chunk.path];
    if (!mod || !Array.isArray(mod.default)) continue;

    for (const raw of mod.default) {
      if (!raw || typeof raw.number !== 'number') continue;

  	const streams = normalizeStreams(raw.streams);
  	if (streams.length === 0) continue;

  	merged.push({
    	number: raw.number,
    	title: raw.title ?? undefined,
    	streams,
    	downloads: normalizeDownloads(raw.downloads),
     });
	}
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

function toDisplayStatus(s: RawStatus): QimochiStatus {
  return STATUS_LABEL[s] as QimochiStatus;
}

function toDisplayType(t: RawType): QimochiType {
  return TYPE_LABEL[t] as QimochiType;
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
): Date | null {
  if (aired?.from instanceof Date) return aired.from;
  if (year) return new Date(Date.UTC(year, 0, 1));
  return null;
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

function resolveScore(stats: { score?: number } | undefined): number | null {
  const s = stats?.score;
  if (typeof s === 'number' && s >= 0) return s;
  return null;
}

async function hydrateOne(anime: AnimeEntry): Promise<HydratedAnime> {
  const slug = anime.id;
  const d = anime.data;

  const releaseDate = resolveReleaseDate(d.aired, d.year);

  return {
    ...anime,
    data: {
      ...d,
      status: toDisplayStatus(d.status as RawStatus),
      type: toDisplayType(d.type as RawType),
      cover: d.image ?? '',
      studio: resolveStudio(d.studios),
      genre: resolveGenre(d.genres),
      releaseDate,
      score: resolveScore(d.stats),
      episodeList: episodesBySlug[slug] ?? [],
      franchises: franchisesBySlug[slug] ?? [],
    },
  };
}

export async function getAllAnime(): Promise<HydratedAnime[]> {
  const all = await getCollection('anime', ({ data }) => !data.draft);
  return Promise.all(all.map(hydrateOne));
}

export async function getAnimeById(id: string): Promise<HydratedAnime | null> {
  const anime = await getEntry('anime', id);
  if (!anime || anime.data.draft) return null;
  return hydrateOne(anime);
}

export function sortByRecent(items: HydratedAnime[]): HydratedAnime[] {
  return [...items].sort((a, b) => {
    const at = (a.data.updatedAt ?? a.data.addedAt)?.getTime() ?? 0;
    const bt = (b.data.updatedAt ?? b.data.addedAt)?.getTime() ?? 0;
    return bt - at;
  });
}

export function getYear(anime: HydratedAnime): number | null {
  return anime.data.releaseDate?.getFullYear() ?? null;
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
    const eps = anime.data.episodeList;
    const total = eps.length;
    eps.forEach((episode, episodeIndex) => {
      paths.push({ slug: anime.id, anime, episode, episodeIndex, totalEpisodes: total });
    });
  }
  return paths;
}

export interface WatchPathItem {
  slug: string;
  anime: HydratedAnime;
  episodes: EpisodeData[];
  firstEpisode: number;
  totalEpisodes: number;
}

export async function getAllWatchPaths(): Promise<WatchPathItem[]> {
  const all = await getAllAnime();
  const paths: WatchPathItem[] = [];

  for (const anime of all) {
    const eps = anime.data.episodeList;
    if (eps.length === 0) continue;

    const sorted = [...eps].sort((a, b) => a.number - b.number);
    paths.push({
      slug: anime.id,
      anime,
      episodes: sorted,
      firstEpisode: sorted[0]!.number,
      totalEpisodes: sorted.length,
    });
  }

  return paths;
}

export function findEpisode(anime: HydratedAnime, episodeNumber: number): EpisodeData | null {
  return anime.data.episodeList.find((e) => e.number === episodeNumber) ?? null;
}