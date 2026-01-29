// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import codeLightTheme from './src/themes/code-light.json';
import codeDarkTheme from './src/themes/code-dark.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://singhanuvrat.com',
  integrations: [mdx()],
  output: 'static',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: codeLightTheme,
        dark: codeDarkTheme,
      },
      wrap: true,
    },
  },
});
