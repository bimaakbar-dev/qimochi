// @ts-check
import {
  defineConfig,
  fontProviders,
  passthroughImageService,
} from "astro/config";

import { SITE } from "./src/consts";

import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
} from "@shikijs/transformers";

import { satteriQuote } from "./src/lib/mdx/satteri-blockquote";
import { satteriCallout } from "./src/lib/mdx/satteri-callout";
import { satteriChangelog } from "./src/lib/mdx/satteri-changelog";
import { satteriCodeBlock } from "./src/lib/mdx/satteri-code-block";
import { satteriDetails } from "./src/lib/mdx/satteri-details";
import { satteriFigure } from "./src/lib/mdx/satteri-figure";
import { satteriFileTree } from "./src/lib/mdx/satteri-filetree";
import { satteriKbd } from "./src/lib/mdx/satteri-kbd";
import { satteriSteps } from "./src/lib/mdx/satteri-steps";
import { satteriTabs } from "./src/lib/mdx/satteri-tabs";

import pagefind from "astro-pagefind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: "/",
  trailingSlash: "never",
  output: "static",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerNotationHighlight({ matchAlgorithm: "v3" }),
        transformerNotationWordHighlight({ matchAlgorithm: "v3" }),
        transformerNotationErrorLevel({ matchAlgorithm: "v3" }),
        transformerRemoveLineBreak(),
      ],
      wrap: false,
    },
    processor: satteri({
      features: {
        directive: true,
        gfm: true,
        math: true,
        headingAttributes: true,
      },
      hastPlugins: [
        satteriHeadingIdsPlugin()
      ],
      mdastPlugins: [
        satteriFigure,
        satteriQuote,
        satteriCodeBlock,
        satteriKbd,
        satteriCallout,
        satteriSteps,
        satteriChangelog,
        satteriDetails,
        satteriFileTree,
        satteriTabs
      ],
    }),
  },
  integrations: [
    mdx({
      optimize: false,
      extendMarkdownConfig: true,
    }), 
    pagefind(),
     sitemap()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-Geist",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Geist.woff2"],
            weight: "100 800",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "GeistMono",
      cssVariable: "--font-GeistMono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/GeistMono.woff2"],
            weight: "100 800",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
  image: {
    remotePatterns: [{ protocol: "https" }],
    service: passthroughImageService(),
  },
});
