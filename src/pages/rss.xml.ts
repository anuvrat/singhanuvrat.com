import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const nuggets = await getCollection('nuggets', ({ data }) => !data.draft);

  const postItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `/${post.slug}/`,
    categories: post.data.tags,
  }));

  const nuggetItems = nuggets.map((nugget) => ({
    title: nugget.data.title,
    pubDate: nugget.data.pubDate,
    description: `Curated links and commentary: ${nugget.data.dateRange}`,
    link: `/nuggets/${nugget.data.number}/`,
    categories: ['nuggets'],
  }));

  const allItems = [...postItems, ...nuggetItems]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Anuvrat — Thinking in systems',
    description: 'Thoughts on distributed systems, infrastructure, and technology',
    site: context.site!,
    items: allItems,
    customData: `<language>en-us</language>`,
  });
}
