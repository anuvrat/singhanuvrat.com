import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);

  const items = posts
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.slug}/`,
      categories: post.data.tags,
    }))
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Anuvrat — Thinking in systems',
    description: 'Thoughts on distributed systems, infrastructure, and technology',
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
