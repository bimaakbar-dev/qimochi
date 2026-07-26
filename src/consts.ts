// src/consts.ts
import Logo from './assets/images/c0desk1.svg';
import Thumbnails from './assets/images/placeholder.svg';
import Avatar from './assets/images/placeholder-user.jpg';

type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string;
  children?: NavItem[];
};

type FooterNav = {
  title?: string;
  items: NavItem[];
};

type Socials = {
  href: string;
  label?: string;
  icon?: string;
  isExternal?: boolean;
};

export const SITE = {
  name: "Qimochi",
  tagline: "Welcome to WibuFlix",
  description: "Download Anime Batch 360p, 720p, 1080p Subtitle Indonesia",
  url: "https://docs.c0desk1.my.id",
  ogImage: Thumbnails,
  locale: "id_ID",
  lang: "id",
  dir: "ltr",
  charset: "utf-8",
  themeColor: "#0a0a0a",
  bgColor: "#000000",
  email: "hello@c0desk1.my.id",
  foundingYear: 2026,
} as const;

export const ORG = {
  name: SITE.name,
  url: SITE.url,
  logo: Logo,
  sameAs: [] as string[],
} as const;

export const ROUTES = {
  home: "/",
  anime: "/anime",
  novel: "/novel",
  about: "/about",
  docs: "/docs",
  blog: "/blog",
  archive: "/blog/archive",
  genre: "/anime/genres",
  privacy: "/privacy",
  terms: "/terms",
  sitemap: "/sitemap-index.xml",
  feed: "/feed.xml",
  feedAtom: "/feed.atom",
  feedJson: "/feed.json",
  rss: "/rss.xml",
  robots: "/robots.txt",
} as const;

export const NAV = {
  navBar: [
    { label: "Anime", href: ROUTES.anime, icon: "learn" },
    { label: "Genres", href: ROUTES.genre, icon: "blog" },
    { label: "Blog", href: ROUTES.blog, icon: "blog" },
    { label: "Archive", href: ROUTES.archive, icon: "blog" }
  ] as NavItem[],
  mobileNavBar: [
    { label: "Anime", href: ROUTES.anime },
    { label: "Genres", href: ROUTES.genre },
    { label: "Blog", href: ROUTES.blog }
  ] as NavItem[],
  footerBar: [
    {
      title: "Resource",
      items: [
        { label: "Anime", href: ROUTES.anime, icon: "learn" },
        { label: "Genres", href: ROUTES.genre, icon: "blog" },
        { label: "About", href: ROUTES.about },
        { label: "Blog", href: ROUTES.blog },
        { label: "Archive", href: ROUTES.archive, icon: "blog" }
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy Policy", href: ROUTES.privacy },
        { label: "Terms of Service", href: ROUTES.terms },
      ],
    },
  ] as FooterNav[],
  Social: [
    { label: "Github", href: ROUTES.docs, icon: "github" }
  ] as Socials[]
} as const;

export const SEO = {
  titleDefault: SITE.name,
  titleTemplate: `%s | ${SITE.name}`,
  titleMaxLength: 60,
  description: SITE.description,
  descriptionMaxLength: 160,
  canonical: SITE.url,
  ogImage: Thumbnails,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: SITE.name,
  twitterCard: "summary_large_image" as const,
  twitterSite: "@adogen_tool",
  twitterCreator: "@adogen_tool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxVideoPreview: -1,
      maxImagePreview: "large" as const,
      maxSnippet: -1,
    },
  },
  verification: {
    google: "",
    bing: "",
    yandex: "",
  },
} as const;

export const OG = {
  type: "website" as const,
  siteName: SITE.name,
  locale: SITE.locale,
  image: SEO.ogImage,
  imageWidth: SEO.ogImageWidth,
  imageHeight: SEO.ogImageHeight,
  imageAlt: SEO.ogImageAlt,
} as const;

export const TWITTER = {
  card: SEO.twitterCard,
  site: SEO.twitterSite,
  creator: SEO.twitterCreator,
} as const;

// ----------------------------------------------------------------------------
//  STRUCTURED DATA
// ----------------------------------------------------------------------------
export const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: SITE.lang,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

export const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG.name,
  url: ORG.url,
  logo: {
    "@type": "ImageObject",
    url: ORG.logo,
    width: 512,
    height: 512,
  },
  sameAs: ORG.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE.email,
    contactType: "customer support",
    availableLanguage: ["English"],
  },
} as const;

export function schemaBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function schemaWebPage(opts: {
  title: string;
  description: string;
  url: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: SITE.lang,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
    },
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export function schemaSoftwareApplication(opts: {
  name: string;
  description: string;
  url: string;
  image: string | string[];
  operatingSystem?: string;
  applicationCategory?: string;
  price?: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    operatingSystem: opts.operatingSystem || "All",
    applicationCategory: opts.applicationCategory || "WebApplication",
    offers: {
      "@type": "Offer",
      price: opts.price || "0",
      priceCurrency: opts.priceCurrency || "USD",
    },
  };
}

export function schemaFAQ(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ----------------------------------------------------------------------------
//  buildMeta
// ----------------------------------------------------------------------------
export function buildMeta(opts: {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  nofollow?: boolean;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}) {
  const title = opts.title
    ? SEO.titleTemplate
        .replace("%s", opts.title)
        .slice(0, SEO.titleMaxLength + 20)
    : SEO.titleDefault;
  const description = (opts.description ?? SEO.description).slice(
    0,
    SEO.descriptionMaxLength,
  );
  const canonical = opts.canonical ?? SEO.canonical;
  const ogImage = opts.ogImage ?? SEO.ogImage;
  const ogImageAlt = opts.ogImageAlt ?? SEO.ogImageAlt;
  const ogType = opts.ogType ?? OG.type;
  const noindex = opts.noindex ?? !SEO.robots.index;
  const nofollow = opts.nofollow ?? !SEO.robots.follow;
  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-snippet:-1",
    "max-image-preview:large",
    "max-video-preview:-1",
  ].join(", ");
  return {
    title,
    description,
    canonical,
    robots: robotsContent,
    keywords: opts.keywords?.join(", ") ?? "",
    og: {
      title,
      description,
      url: canonical,
      type: ogType,
      siteName: OG.siteName,
      locale: OG.locale,
      image: ogImage,
      imageWidth: OG.imageWidth,
      imageHeight: OG.imageHeight,
      imageAlt: ogImageAlt,
      ...(opts.datePublished ? { publishedTime: opts.datePublished } : {}),
      ...(opts.dateModified ? { modifiedTime: opts.dateModified } : {}),
      ...(opts.authorName ? { author: opts.authorName } : {}),
    },
    twitter: {
      card: TWITTER.card,
      site: TWITTER.site,
      creator: TWITTER.creator,
      title,
      description,
      image: ogImage,
      imageAlt: ogImageAlt,
    },
  };
}

// ----------------------------------------------------------------------------
//  PAGINATION
// ----------------------------------------------------------------------------
export const PAGINATION = {
  postsPerPage: 9,
  postsPerFeed: 20,
  postsPerSitemap: 1000,
} as const;

// ----------------------------------------------------------------------------
//  IMAGE DEFAULTS (for website, not for processing)
// ----------------------------------------------------------------------------
export const IMAGE = {
  og: {
    width: 1200,
    height: 630,
    placeholder: OG,
  },
  thumbnail: {
    width: 800,
    height: 450,
    quality: 80,
    placeholder: Thumbnails,
  },
  avatar: {
    width: 96,
    height: 96,
    quality: 80,
    placeholder: Avatar,
  },
  logo: {
    width: 512,
    height: 512,
  },
} as const;
