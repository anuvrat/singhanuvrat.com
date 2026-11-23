import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  const siteUrl = (site?.toString() || 'https://singhanuvrat.com').replace(/\/$/, '');

  const staticPages = [
    { url: '', lastmod: new Date(), priority: '1.0' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url ? `/${page.url}/` : ''}</loc>
    <lastmod>${page.lastmod.toISOString().split('T')[0]}</lastmod>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${posts.map(post => `  <url>
    <loc>${siteUrl}/${post.slug}/</loc>
    <lastmod>${(post.data.updatedDate || post.data.pubDate).toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
