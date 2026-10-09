export const SITE = {
  name: 'Qimochi',
  title: 'Nonton Anime Subtitle Indonesia',
  description: 'Koleksi anime untuk streaming subtitel bahasa indonesia. Ringan, cepat, tanpa ribet.',
  url: 'https://qimochi.pages.dev',
  locale: 'id-ID',
  lang: 'id',
} as const;

export const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Ongoing',  href: '/anime/ongoing/' },
  { label: 'Completed', href: '/anime/completed/' },
  { label: 'Archive',  href: '/anime/' },
  { label: 'Genre',    href: '/anime/genre/' },
  { label: 'Blog', href: '/blog/' },
] as const;

export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Isekai',
  'Mecha',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

export type Genre = typeof GENRES[number];

export const STATUSES = ['Ongoing', 'Completed', 'Hiatus'] as const;
export type Status = typeof STATUSES[number];

export const STATUS_VARIANT: Record<Status, 'success' | 'default' | 'warning'> = {
  'Ongoing':   'success',
  'Completed': 'default',
  'Hiatus':    'warning',
};

export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'] as const;
export type AnimeType = typeof ANIME_TYPES[number];

export const PER_PAGE = 12;

export const BREAKPOINTS = {
  tablet:  '48rem',
  desktop: '56rem',
} as const;

export const STORAGE_KEYS = {
  preferredQuality: 'qimochi:preferred-quality',
  preferredServer:  'qimochi:preferred-server',
} as const;

export const URLS = {
  anime:  (slug: string) => `/anime/${slug}/`,
  watch: (slug, episode) => `/anime/watch/${slug}/episodes/${episode}/`,
  genre:  (slug: string) => `/anime/genre/${slug.toLowerCase().replace(/\s+/g, '-')}/`,
  status: (status: string) => `/anime/${status.toLowerCase()}/`,
} as const;

export const ADS = {
  showPlaceholder: import.meta.env.DEV,
  slots: {
    homeInline: '',
    animeDetailInline: '',
    animeDetailSidebar: '',
    watchBelowPlayer: '',
  },
} as const;