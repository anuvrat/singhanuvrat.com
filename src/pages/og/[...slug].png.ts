import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title },
  }));
}

export async function GET({ props }: APIContext) {
  const { title } = props as { title: string };

  // Load font - use TTF format (satori doesn't support woff2)
  const fontPath = path.join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.ttf');

  let fontData: ArrayBuffer;
  try {
    fontData = fs.readFileSync(fontPath);
  } catch {
    // Fallback if font not found - return a simple response
    return new Response('Font not found', { status: 500 });
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          padding: '60px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#e0e0e0',
                marginBottom: '30px',
                lineHeight: 1.3,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: '#6db3c2',
              },
              children: 'Anuvrat · Thinking in systems',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
