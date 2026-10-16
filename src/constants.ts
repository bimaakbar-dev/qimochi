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

export const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'R+', 'Rx'] as const;
export type AgeRating = typeof AGE_RATINGS[number];

export const AGE_RATING_LABEL: Record<AgeRating, string> = {
  G:        'G - Semua Umur',
  PG:       'PG - Anak-anak',
  'PG-13':  'PG-13 - Remaja 13+',
  R:        'R - 17+ (kekerasan & bahasa kasar)',
  'R+':     'R+ - Nudity ringan',
  Rx:       'Rx - Hentai',
};

export const RELATION_TYPES = [
  'sequel', 'prequel', 'side_story', 'parent_story', 'alternative',
  'spin_off', 'adaptation', 'character', 'summary', 'full_story',
  'compilation', 'contains', 'other',
] as const;
export type RelationType = typeof RELATION_TYPES[number];

export const RELATION_LABEL: Record<RelationType, string> = {
  sequel:      'Sekuel',
  prequel:     'Prekuel',
  side_story:  'Cerita Sampingan',
  parent_story:'Cerita Induk',
  alternative: 'Versi Alternatif',
  spin_off:    'Spin-off',
  adaptation:  'Adaptasi',
  character:   'Karakter',
  summary:     'Ringkasan',
  full_story:  'Cerita Lengkap',
  compilation: 'Kompilasi',
  contains:    'Berisi',
  other:       'Terkait',
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
  watch:  (slug: string, episode: number) =>
    episode <= 1
      ? `/anime/watch/${slug}/`
      : `/anime/watch/${slug}/?ep=${episode}`,
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
