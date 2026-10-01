/* ==========================================================
   CONSTANTS
   Nilai yang dipakai di banyak tempat.
   Single source of truth — ubah di sini, semua ikut.
   ========================================================== */

/* ----------------------------------------------------------
   SITE
   ---------------------------------------------------------- */
export const SITE = {
  name: 'Qimochi',
  title: 'Qimochi — Nonton & Download Anime Batch',
  description: 'Koleksi anime untuk streaming dan download batch. Ringan, cepat, tanpa ribet.',
  url: 'https://qimochi-hub.github.io',
  locale: 'id-ID',
  lang: 'id',
} as const;

/* ----------------------------------------------------------
   NAVIGASI
   ---------------------------------------------------------- */
export const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Ongoing',  href: '/anime/ongoing' },
  { label: 'Complete', href: '/anime/complete' },
  { label: 'Genre',    href: '/genre' },
] as const;

/* ----------------------------------------------------------
   GENRE
   Daftar genre yang didukung. Dipakai untuk validasi &
   halaman /genre.
   ---------------------------------------------------------- */
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

/* ----------------------------------------------------------
   STATUS
   ---------------------------------------------------------- */
export const STATUSES = ['Ongoing', 'Completed', 'Hiatus'] as const;
export type Status = typeof STATUSES[number];

/* ----------------------------------------------------------
   PAGINATION
   ---------------------------------------------------------- */
export const PER_PAGE = 9;

/* ----------------------------------------------------------
   BREAKPOINTS
   Sinkron dengan global.css. Tidak bisa dipakai di @media,
   tapi berguna untuk JS logic kalau perlu.
   ---------------------------------------------------------- */
export const BREAKPOINTS = {
  tablet:  '48rem',   // 768px
  desktop: '56rem',   // 896px
} as const;

/* ----------------------------------------------------------
   STORAGE KEYS
   Biar tidak typo saat akses localStorage
   ---------------------------------------------------------- */
export const STORAGE_KEYS = {
  preferredQuality: 'qimochi:preferred-quality',
  preferredServer:  'qimochi:preferred-server',
} as const;

/* ----------------------------------------------------------
   URL BUILDER
   Helper untuk generate URL, biar konsisten
   ---------------------------------------------------------- */
export const URLS = {
  anime:    (slug: string) => `/anime/${slug}`,
  watch:    (slug: string, episode: number) => `/watch/${slug}/${episode}`,
  genre:    (slug: string) => `/genre/${slug.toLowerCase().replace(/\s+/g, '-')}`,
  status:   (status: string) => `/anime/${status.toLowerCase()}`,
} as const;