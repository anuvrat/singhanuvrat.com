# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for Anuvrat Singh at singhanuvrat.com. Built with Astro + MDX, deployed on Vercel.

**Author:** Anuvrat Singh — Engineer with 15+ years building distributed systems and infrastructure
**Tagline:** "Thinking in systems"

## Tech Stack

- **Framework:** Astro 5.x with MDX
- **Styling:** Vanilla CSS with CSS custom properties
- **Fonts:** JetBrains Mono (self-hosted, Regular + Bold)
- **Deployment:** Vercel (static output)
- **OG Images:** Auto-generated via satori + sharp

## Commands

```bash
pnpm run dev      # Start dev server at localhost:4321
pnpm run build    # Build for production
pnpm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── Header.astro           # Site header with title and theme toggle
│   ├── Footer.astro           # Footer with About and RSS links
│   ├── PostCard.astro         # Post list item (title, description, date)
│   ├── MarginNote.astro       # Sidenotes with auto-numbering
│   ├── ThemeToggle.astro      # Dark/light mode switch
│   ├── RelatedPosts.astro     # Tag-aware related posts
│   ├── SeriesNav.astro        # Prev/next navigation for series posts
│   ├── TocDots.astro          # Progress dots for table of contents
│   ├── ArticleSchema.astro    # JSON-LD for blog posts
│   ├── PersonSchema.astro     # JSON-LD for author (About page)
│   └── WebsiteSchema.astro    # JSON-LD for site (homepage)
├── layouts/
│   ├── BaseLayout.astro       # HTML shell, meta tags, dark mode script
│   └── PostLayout.astro       # Two-column post template with margin notes
├── pages/
│   ├── index.astro            # Homepage (posts grouped by year)
│   ├── about.astro            # About page with PersonSchema
│   ├── [...slug].astro        # Dynamic post routes
│   ├── rss.xml.ts             # RSS feed
│   ├── sitemap.xml.ts         # Dynamic sitemap
│   └── og/[...slug].png.ts    # Auto-generated OG images
├── content/
│   ├── config.ts              # Content collection schema (with tags)
│   └── posts/                 # MDX blog posts
├── styles/
│   └── global.css             # CSS variables, typography, themes
└── utils/
    ├── readingTime.ts         # Word count to reading time
    ├── formatDate.ts          # Date formatting + constants
    └── relatedPosts.ts        # Tag + keyword similarity algorithm
```

## Writing Posts

### Quick Add Workflow

1. Create a new `.mdx` file in `src/content/posts/` with just title and content
2. Run `/prepare-post` — Claude will:
   - Rename the file to an SEO-friendly slug
   - Generate description, tags, difficulty level
   - Determine series membership (if applicable)
   - Review collection for consistency
   - Propose any taxonomy/series reorganization
   - Commit the changes

### Frontmatter Schema

```yaml
---
title: "Post Title"
description: "Meta description for SEO and previews"
pubDate: 2025-01-27
updatedDate: 2025-01-28    # Optional, shows if >7 days after pubDate
draft: false                # Optional, hides from production if true
tags: ["distributed-systems", "paper-analysis"]
difficulty: "deep-dive"     # intro | intermediate | deep-dive
series: "google-infrastructure"  # Optional, for multi-part series
seriesOrder: 2              # Optional, position in series
ogImage: /custom-og.png     # Optional, overrides auto-generated
---
```

### Available Tags

- `distributed-systems` — Core distributed systems concepts
- `storage-systems` — File systems, object storage
- `databases` — Database systems, transactions
- `infrastructure` — Kubernetes, cloud, DevOps
- `data-engineering` — Spark, Hive, pipelines
- `ai` — AI/ML systems and implications
- `security` — Security architecture
- `paper-analysis` — Analysis of research papers
- `deep-dive` — In-depth technical exploration
- `tutorial` — How-to content
- `architecture` — System design, trade-offs

### Difficulty Levels

- **intro** — Accessible to anyone with basic tech background
- **intermediate** — Assumes domain familiarity, practical experience helps
- **deep-dive** — Assumes significant expertise, academic or production-level depth

### Series

Current series:
- `google-infrastructure`: GFS → Bigtable → Spanner (Google's storage evolution)

Series posts show navigation (prev/next) instead of related posts.

## Nuggets (Bi-Weekly Digest)

Curated links and commentary from research. Separate from posts.

**Location:** `src/content/nuggets/`
**URL:** `/nuggets/` (list) and `/nuggets/[number]/` (individual)

### Quick Add Workflow

1. Create a new `.mdx` file in `src/content/nuggets/`
2. Add content with links and commentary
3. Run `/prepare-nugget` — Claude will assign number, dates, format

### Frontmatter Schema

```yaml
---
title: "Nuggets #12"
number: 12
dateRange: "Jan 15-28, 2025"
pubDate: 2025-01-28
---
```

### Content Structure

```markdown
## What Caught My Eye

Commentary with [integrated links](url) woven into prose.

## Quick Links

- [Article title](url) — One-line description
- [Article title](url) — Why it's worth reading
```

### Using Margin Notes

Margin notes appear in the right margin on desktop, expand on mobile tap.
Numbers auto-increment per page.

```mdx
import MarginNote from '../components/MarginNote.astro';

Some text here.<MarginNote>This appears in the right margin.</MarginNote>
```

### Using Math (LaTeX)

Inline math with single `$`: The formula $E = mc^2$ is famous.

Block math with double `$$`:

```mdx
$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
```

### Using Diagrams (Mermaid)

```mdx
import Mermaid from '../components/Mermaid.astro';

<Mermaid chart={`
graph LR
    A[Client] --> B[Load Balancer]
    B --> C[Server 1]
    B --> D[Server 2]
`} />
```

Supports flowcharts, sequence diagrams, state diagrams, etc. See [Mermaid docs](https://mermaid.js.org/).

## Theming

Dark mode uses `html.dark` class (not body). Colors are CSS variables:

```css
:root {
  --accent: #4a6fa5;      /* Light mode */
}

html.dark {
  --accent: #6db3c2;      /* Dark mode */
}
```

Theme persists via localStorage. Toggle script uses `document.documentElement`.

## SEO

- **JSON-LD:** ArticleSchema on posts, PersonSchema on About, WebsiteSchema on homepage
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **robots.txt:** Allows all, references sitemap
- **OG Images:** Auto-generated per post (title + tagline)
- **Meta tags:** Title, description, canonical, OG, Twitter cards

## Related Posts Algorithm

Uses hybrid scoring: `(tag_overlap × 2) + keyword_similarity`

1. Tag matches are primary signal (each match = 2 points)
2. Keyword similarity on title + description is secondary (0-1 points)
3. Falls back to recent posts if no relevant matches

## Key Architecture Decisions

1. **Minimal JS** — Only theme toggle + code copy button
2. **Two-column layout** — Content | Margin notes (desktop only)
3. **Margin notes as component** — Explicit control, auto-numbered
4. **Tags for related posts** — Not for filtering/navigation
5. **Auto OG images** — Generated via satori at build time
6. **Single-author blog** — Compact byline, no heavy author boxes
7. **Year-grouped homepage** — Posts organized chronologically with descriptions

## Future Additions (prepared for)

- **LaTeX:** Add `remark-math` + `rehype-katex` to astro.config.mjs
- **Search:** Add Pagefind at build time
- **Newsletter:** Add signup component, integrate with Buttondown/Substack

## Deployment

Connected to Vercel via GitHub. Push to `main` triggers auto-deploy.

**Custom domain:** singhanuvrat.com (configured in Vercel dashboard)
