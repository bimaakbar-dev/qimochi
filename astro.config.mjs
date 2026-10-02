import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';

export default defineConfig({
  site: 'https://qimochi-hub.github.io',
  trailingSlash: 'always',
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Montserrat.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Inter.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "FiraCode",
      cssVariable: "--font-firaCode",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/FiraCode.woff2"],
          },
        ],
      },
    },
  ],
  experimental: {
    incrementalBuild: true,
    svgOptimizer: svgoOptimizer(),
  },
});
