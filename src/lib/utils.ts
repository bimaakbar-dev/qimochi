const CDN_ORIGIN = "https://cdn.c0desk1.my.id";

function ensureDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  return new Date(date);
}

export function isCdnUrl(src: string): boolean {
  return typeof src === "string" && src.startsWith(CDN_ORIGIN);
}

export function cdnImage(
  src: string,
  options?: {
    w?: number;
    h?: number;
    q?: number;
    f?: "webp" | "avif" | "jpeg" | "auto";
  },
): string {
  if (!isCdnUrl(src)) return src;
  const url = new URL(src);
  if (options?.w) url.searchParams.set("w", String(options.w));
  if (options?.h) url.searchParams.set("h", String(options.h));
  url.searchParams.set("q", String(options?.q ?? 85));
  url.searchParams.set("f", options?.f ?? "auto");
  return url.toString();
}

export function formatDate(date: Date | string | number, locale: string = 'id-ID'): string {
  const d = ensureDate(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateCompact(date: Date | string | number, locale: string = 'id-ID'): string {
  const d = ensureDate(date);
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateISO(date: Date | string | number): string {
  const d = ensureDate(date);
  return d.toISOString().split('T')[0];
}

export function stripMarkdown(content: string): string {
  if (!content?.trim()) return '';

  let text = content;

  text = text.replace(/^\s*---[\s\S]*?---\s*/, '');

  const lines = text.split('\n');

  text = lines
    .filter((line) => {
      const trimmed = line.trim();

      return (
        !trimmed.startsWith('import ') &&
        !trimmed.startsWith('// ') &&
        !trimmed.startsWith('/*')
      );
    })
    .join('\n');

  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/[#*`>_\-+]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export function truncate(text: string, length: number = 100): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  return truncate(stripMarkdown(content), maxLength);
}

export function getReadingTime(content?: string): string {
  const suffix = 'menit baca';

  if (!content?.trim()) return `1 ${suffix}`;
  const cleanText = generateExcerpt(content, Infinity);
  const words = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} ${suffix}`;
}
