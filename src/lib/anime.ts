import type { CollectionEntry } from "astro:content";

const QUALITY_ORDER = ["1080p", "720p", "480p", "360p"] as const;

export function getAnimeSlug(anime: CollectionEntry<"anime">) {
  return anime.data.slug ?? anime.id;
}

export function sortDownloads(downloads?: CollectionEntry<"anime">["data"]["downloads"]) {
  if (!downloads) return [];
  return [...downloads].sort(
    (a, b) => QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality)
  );
}