// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

import codeLightTheme from './src/themes/code-light.json';
import codeDarkTheme from './src/themes/code-dark.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://singhanuvrat.com',
  integrations: [mdx()],
  output: 'static',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      themes: {
        light: codeLightTheme,
        dark: codeDarkTheme,
      },
      wrap: true,
    },
  },
});
