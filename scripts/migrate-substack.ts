import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';

const SUBSTACK_URL = 'https://blog.singhanuvrat.com';

interface Post {
  title: string;
  description: string;
  pubDate: string;
  slug: string;
  content: string;
}

async function fetchArchive(): Promise<{ slug: string; url: string }[]> {
  console.log('Fetching archive page...');
  const response = await fetch(`${SUBSTACK_URL}/archive?sort=new`);
  const html = await response.text();
  const $ = cheerio.load(html);

  const posts: { slug: string; url: string }[] = [];

  // Find all post links in the archive
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/p/')) {
      const slug = href.split('/p/')[1]?.split('?')[0]?.split('/')[0];
      if (slug && !posts.find(p => p.slug === slug)) {
        const fullUrl = href.startsWith('http') ? href : `${SUBSTACK_URL}${href}`;
        posts.push({ slug, url: fullUrl });
      }
    }
  });

  return posts;
}

async function fetchPost(url: string, slug: string): Promise<Post> {
  console.log(`  Fetching: ${slug}`);
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract title
  const title = $('h1.post-title').text().trim() ||
                $('h1[class*="post"]').text().trim() ||
                $('article h1').first().text().trim() ||
                $('h1').first().text().trim() ||
                slug;

  // Extract description from meta
  const description = $('meta[name="description"]').attr('content') ||
                      $('meta[property="og:description"]').attr('content') ||
                      '';

  // Extract date
  const dateStr = $('time').attr('datetime') ||
                  $('meta[property="article:published_time"]').attr('content') ||
                  new Date().toISOString();
  const pubDate = new Date(dateStr).toISOString().split('T')[0];

  // Extract main content
  const contentEl = $('.body.markup').first();
  if (contentEl.length === 0) {
    // Try alternative selectors
    const altContent = $('.post-content, .available-content, article .body').first();
    if (altContent.length > 0) {
      contentEl.replaceWith(altContent);
    }
  }

  let contentHtml = contentEl.html() || $('.available-content').html() || '';

  // Remove subscription prompts and other Substack-specific elements
  const $content = cheerio.load(contentHtml);
  $content('.subscription-widget, .captioned-button-wrap, .subscribe-widget').remove();
  contentHtml = $content.html() || '';

  // Convert to markdown
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  // Custom rule for code blocks
  turndown.addRule('codeBlock', {
    filter: (node) => {
      return node.nodeName === 'PRE' && node.querySelector('code') !== null;
    },
    replacement: (content, node) => {
      const codeEl = (node as Element).querySelector('code');
      const lang = codeEl?.className?.match(/language-(\w+)/)?.[1] || '';
      const text = codeEl?.textContent || content;
      return `\n\`\`\`${lang}\n${text.trim()}\n\`\`\`\n`;
    },
  });

  // Custom rule for inline code
  turndown.addRule('inlineCode', {
    filter: (node) => {
      return node.nodeName === 'CODE' &&
             node.parentNode?.nodeName !== 'PRE';
    },
    replacement: (content) => {
      return `\`${content}\``;
    },
  });

  const mdContent = turndown.turndown(contentHtml);

  return {
    title: title.replace(/"/g, '\\"'),
    description: description.replace(/"/g, '\\"').substring(0, 200),
    pubDate,
    slug,
    content: mdContent
  };
}

function createMdx(post: Post): string {
  return `---
title: "${post.title}"
description: "${post.description}"
pubDate: ${post.pubDate}
---

${post.content}
`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Starting Substack migration...\n');

  const archive = await fetchArchive();
  console.log(`Found ${archive.length} posts\n`);

  const outDir = path.join(process.cwd(), 'src/content/posts');
  fs.mkdirSync(outDir, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (const { slug, url } of archive) {
    try {
      const post = await fetchPost(url, slug);
      const filename = `${slugify(post.slug)}.mdx`;
      const filepath = path.join(outDir, filename);
      fs.writeFileSync(filepath, createMdx(post));
      console.log(`  ✓ Saved: ${filename}`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed: ${slug}`, error instanceof Error ? error.message : error);
      failCount++;
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`  ✓ ${successCount} posts migrated`);
  if (failCount > 0) {
    console.log(`  ✗ ${failCount} posts failed`);
  }
}

main().catch(console.error);
