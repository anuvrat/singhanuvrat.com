# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for Anuvrat Singh at singhanuvrat.com. Built with Astro + MDX, deployed on Vercel.

**Tagline:** "Thinking in systems"

## Tech Stack

- **Framework:** Astro 5.x with MDX
- **Styling:** Vanilla CSS with CSS custom properties
- **Fonts:** JetBrains Mono (self-hosted)
- **Deployment:** Vercel (static output)

## Commands

```bash
pnpm run dev      # Start dev server at localhost:4321
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run migrate  # Migrate posts from Substack (one-time, already done)
```

## Project Structure

```
src/
├── components/
│   ├── Header.astro         # Site header with title and theme toggle
│   ├── Footer.astro         # Footer with About and RSS links
│   ├── PostCard.astro       # Post list item for homepage
│   ├── MarginNote.astro     # Sidenotes (desktop: margin, mobile: expandable)
│   ├── TableOfContents.astro # Desktop-only sticky ToC
│   └── ThemeToggle.astro    # Dark/light mode switch
├── layouts/
│   ├── BaseLayout.astro     # HTML shell, meta tags, dark mode script
│   └── PostLayout.astro     # Three-column post template
├── pages/
│   ├── index.astro          # Homepage (post list)
│   ├── about.astro          # About page
│   ├── [...slug].astro      # Dynamic post routes
│   ├── rss.xml.ts           # RSS feed
│   └── og/[...slug].png.ts  # Auto-generated OG images
├── content/
│   ├── config.ts            # Content collection schema
│   └── posts/               # MDX blog posts
├── styles/
│   └── global.css           # CSS variables, typography, themes
└── utils/
    └── readingTime.ts       # Word count to reading time
```

## Writing Posts

Posts are MDX files in `src/content/posts/`. Frontmatter:

```yaml
---
title: "Post Title"
description: "Meta description for SEO and previews"
pubDate: 2025-01-27
updatedDate: 2025-01-28  # Optional, shows if >7 days after pubDate
draft: false              # Optional, hides from production if true
ogImage: /custom-og.png   # Optional, overrides auto-generated
---
```

### Using Margin Notes

```mdx
import MarginNote from '../../components/MarginNote.astro';

Some text here. <MarginNote>This appears in the right margin on desktop.</MarginNote>
```

## Theming

Colors are CSS variables in `src/styles/global.css`. To change accent color:

```css
:root {
  --accent: #4a6fa5;      /* Light mode */
}

body.dark {
  --accent: #6db3c2;      /* Dark mode */
}
```

## Key Architecture Decisions

1. **Zero client-side JS except dark mode toggle** — Pure static HTML + CSS
2. **ToC desktop-only** — Mobile readers scroll naturally
3. **Margin notes as component** — Not markdown syntax, explicit control
4. **No tags/search** — Minimal, homepage is scannable
5. **Auto OG images** — Generated via satori, can override per-post
6. **Three-column layout** — ToC (left) | Content | Margin Notes (right)

## Future Additions (prepared for)

- **LaTeX:** Add `remark-math` + `rehype-katex` to astro.config.mjs
- **Tags:** Add to frontmatter schema, create filter component
- **Search:** Add Pagefind at build time

## Deployment

Connected to Vercel via GitHub. Push to `main` triggers auto-deploy.

**Custom domain:** singhanuvrat.com (configure in Vercel dashboard → Domains)
