export const SITE = {
  name: 'Qimochi',
  title: 'Nonton Anime Subtitle Indonesia',
  description: 'Koleksi anime subtitle Bahasa Indonesia. Ringan, cepat, tanpa ribet.',
  url: 'https://qimochi.web.id',
  locale: 'id-ID',
  lang: 'id',
  ogImage: '/og.jpg' as string,
} as const;

export const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Ongoing',   href: '/anime/ongoing/' },
  { label: 'Completed', href: '/anime/completed/' },
  { label: 'Anime',     href: '/anime/' },
  { label: 'Genre',     href: '/anime/genre/' },
  { label: 'Blog',      href: '/blog/' },
] as const;

export const RAW_STATUSES = [
  'airing', 'finished', 'upcoming', 'hiatus', 'cancelled',
] as const;
export type RawStatus = typeof RAW_STATUSES[number];

export const STATUSES = ['Ongoing', 'Completed', 'Hiatus', 'Upcoming'] as const;
export type Status = typeof STATUSES[number];

export const STATUS_LABEL: Record<RawStatus, Status> = {
  airing:    'Ongoing',
  finished:  'Completed',
  upcoming:  'Upcoming',
  hiatus:    'Hiatus',
  cancelled: 'Completed',
};

export const STATUS_VARIANT: Record<Status, 'success' | 'default' | 'warning' | 'accent'> = {
  'Ongoing':   'success',
  'Completed': 'accent',
  'Hiatus':    'warning',
  'Upcoming':  'default',
};

export const RAW_TYPES = [
  'TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music', 'Unknown',
] as const;
export type RawType = typeof RAW_TYPES[number];

export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'] as const;
export type AnimeType = typeof ANIME_TYPES[number];

export const TYPE_LABEL: Record<RawType, AnimeType> = {
  TV:      'TV',
  Movie:   'Movie',
  OVA:     'OVA',
  ONA:     'ONA',
  Special: 'Special',
  Music:   'Special',
  Unknown: 'TV',
};

export const SOURCES = [
  'original', 'manga', 'light_novel', 'visual_novel', 'game',
  'web_manga', 'web_novel', 'novel', 'book', 'picture_book',
  'radio', 'music', '4_koma_manga', 'card_game', 'other',
] as const;
export type Source = typeof SOURCES[number];

export const SOURCE_LABEL: Record<Source, string> = {
  original:       'Original',
  manga:          'Manga',
  light_novel:    'Light Novel',
  visual_novel:   'Visual Novel',
  game:           'Game',
  web_manga:      'Web Manga',
  web_novel:      'Web Novel',
  novel:          'Novel',
  book:           'Book',
  picture_book:   'Picture Book',
  radio:          'Radio',
  music:          'Music',
  '4_koma_manga': '4-Koma Manga',
  card_game:      'Card Game',
  other:          'Other',
};

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
  watch:  (slug: string, episode: number) => `/anime/watch/${slug}/episodes/${episode}/`,
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