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
- **Math:** KaTeX via remark-math + rehype-katex
- **Diagrams:** Mermaid (client-side rendering with dark mode support)
- **Syntax Highlighting:** Shiki with custom light/dark themes
- **OG Images:** Auto-generated via satori + sharp
- **Deployment:** Vercel (static output) with GitHub Actions CI

## Commands

```bash
pnpm run dev      # Start dev server at localhost:4321
pnpm run build    # Build for production
pnpm run preview  # Preview production build
```

## Project Structure

```
.
├── .claude/
│   └── skills/                # Claude automation workflows
│       ├── prepare-post.md    # Workflow for new blog posts
│       └── prepare-nugget.md  # Workflow for bi-weekly nuggets
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD: build → link-check → lighthouse → deploy
├── docs/
│   └── plans/                 # Design and implementation planning documents
├── public/
│   ├── fonts/                 # JetBrains Mono (woff2 + TTF)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro           # Site header with title and theme toggle
│   │   ├── Footer.astro           # Footer with About and RSS links
│   │   ├── PostCard.astro         # Post list item (title, description, date)
│   │   ├── MarginNote.astro       # Sidenotes with auto-numbering
│   │   ├── ThemeToggle.astro      # Dark/light mode switch
│   │   ├── RelatedPosts.astro     # Tag-aware related posts
│   │   ├── SeriesNav.astro        # Prev/next navigation for series posts
│   │   ├── TocDots.astro          # Progress dots for table of contents
│   │   ├── Callout.astro          # Styled callout boxes (note, tip, warning, important)
│   │   ├── PostImage.astro        # Image with lazy loading and optional caption
│   │   ├── Mermaid.astro          # Mermaid diagram renderer with dark mode
│   │   ├── ArticleSchema.astro    # JSON-LD for blog posts
│   │   ├── PersonSchema.astro     # JSON-LD for author (About page)
│   │   └── WebsiteSchema.astro    # JSON-LD for site (homepage)
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, meta tags, dark mode script
│   │   └── PostLayout.astro       # Two-column post template with margin notes
│   ├── pages/
│   │   ├── index.astro            # Homepage (posts grouped by year)
│   │   ├── about.astro            # About page with PersonSchema
│   │   ├── 404.astro              # Custom 404 page
│   │   ├── [...slug].astro        # Dynamic post routes
│   │   ├── rss.xml.ts             # RSS feed
│   │   ├── sitemap.xml.ts         # Dynamic sitemap
│   │   ├── og/[...slug].png.ts    # Auto-generated OG images
│   │   └── nuggets/
│   │       ├── index.astro        # Nuggets list page
│   │       └── [number].astro     # Individual nugget pages
│   ├── content/
│   │   ├── config.ts              # Content collection schema (posts + nuggets)
│   │   └── posts/                 # MDX blog posts
│   ├── styles/
│   │   ├── global.css             # CSS variables, typography, themes
│   │   ├── code-light.json        # Shiki light theme
│   │   └── code-dark.json         # Shiki dark theme
│   └── utils/
│       ├── readingTime.ts         # Word count to reading time (200 WPM)
│       ├── formatDate.ts          # Date formatting + UPDATED_THRESHOLD_MS (7 days)
│       └── relatedPosts.ts        # Tag + keyword similarity algorithm
├── astro.config.mjs               # Astro configuration
├── tsconfig.json                  # TypeScript config with @components/* alias
├── lighthouserc.cjs               # Lighthouse CI thresholds
└── .lycheeignore                  # Link checker exclusions
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

Curated links and commentary from research. Lighter than posts, more frequent.

**Location:** `src/content/nuggets/`
**URL:** `/nuggets/` (list) and `/nuggets/[number]/` (individual)

### Quick Add Workflow

1. Create a new `.mdx` file in `src/content/nuggets/`
2. Run `/prepare-nugget` — Claude will assign number, dates, format

### Frontmatter Schema

```yaml
---
title: "#1: Catchy subtitle here"
number: 1
dateRange: "Jan 15-28, 2025"
pubDate: 2025-01-28
# Optional personal touches
song:
  title: "Song Title"
  artist: "Artist Name"
  url: "https://..."  # optional
podcast:
  title: "Episode Title"
  url: "https://..."  # optional
---
```

### Content Structure

Bullet-point focused, not prose-heavy:

```markdown
## Quick Thoughts

- Main point with commentary
  - Supporting detail (nested, muted styling)
  - Another detail
- Another main point

## Quick Links

- [Article title](url) — One-line description
```

### Display Features

- **List page:** Shows full title for each nugget
- **Detail page:** Top-level bullets separated by muted lines, nested bullets indented and smaller
- **Personal footer:** Song and podcast displayed as compact sign-off (optional)
- **Navigation:** Shows prev/next with full titles

## MDX Components

### Margin Notes

Margin notes appear in the right margin on desktop, expand on mobile tap.
Numbers auto-increment per page using `Symbol.for()` and `globalThis`.

```mdx
import MarginNote from '../components/MarginNote.astro';

Some text here.<MarginNote>This appears in the right margin.</MarginNote>
```

### Callouts

Styled callout boxes for notes, tips, warnings, and important information.

```mdx
import Callout from '../components/Callout.astro';

<Callout type="note">This is a note.</Callout>
<Callout type="tip">This is a tip.</Callout>
<Callout type="warning">This is a warning.</Callout>
<Callout type="important">This is important.</Callout>
```

### Images

Optimized images with lazy loading and optional captions.

```mdx
import PostImage from '../components/PostImage.astro';
import myImage from '../assets/my-image.png';

<PostImage src={myImage} alt="Description" caption="Optional caption" />
```

### Math (LaTeX)

Inline math with single `$`: The formula $E = mc^2$ is famous.

Block math with double `$$`:

```mdx
$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
```

### Code Blocks

Enhanced code blocks with Shiki transformers:

**Line highlighting (inline comment):**
```ts
const a = 1;
const b = 2; // [!code highlight]
const c = 3;
```

**Diff syntax:**
```ts
const old = 'removed'; // [!code --]
const new = 'added';   // [!code ++]
```

**Meta highlighting (highlight specific lines):**
````md
```ts {2,4-5}
line 1
line 2  // highlighted
line 3
line 4  // highlighted
line 5  // highlighted
```
````

### Diagrams (Mermaid)

```mdx
import Mermaid from '../components/Mermaid.astro';

<Mermaid chart={`
graph LR
    A[Client] --> B[Load Balancer]
    B --> C[Server 1]
    B --> D[Server 2]
`} />
```

Supports flowcharts, sequence diagrams, state diagrams, etc. Automatically inverts colors in dark mode.

## Theming

Dark mode uses `html.dark` class (not body). Colors are CSS variables:

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --accent: #4a6fa5;      /* Light mode */
}

html.dark {
  --bg: #1a1a1a;
  --text: #e0e0e0;
  --accent: #6db3c2;      /* Dark mode */
}
```

Theme persists via localStorage. Toggle script uses `document.documentElement`.

**Layout dimensions:**
- Content width: 750px
- Sidebar width: 180px
- Max width: 1100px

## CI/CD Pipeline

Push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Build** — `vercel pull` + `vercel build --prod` (single build, creates `.vercel/output`)
2. **Link Check** — Lychee validates all URLs in HTML (parallel with Lighthouse)
3. **Lighthouse** — Performance, accessibility, SEO audits (parallel with Link Check)
4. **Deploy** — `vercel deploy --prebuilt --prod` (only after both checks pass)

**Note:** Vercel's auto-deploy is disabled. Deployment only happens via GitHub Actions after checks pass.

### Lighthouse Thresholds (lighthouserc.cjs)

- Performance: 0.9 minimum
- Accessibility: 0.9 minimum
- Best Practices: 0.9 minimum
- SEO: 0.9 minimum
- FCP: 2000ms
- LCP: 2500ms
- CLS: 0.1

### Link Check Exclusions (.lycheeignore)

- twitter.com, x.com, linkedin.com (rate limiting)
- localhost URLs
- cdn.jsdelivr.net

## SEO

- **JSON-LD:** ArticleSchema on posts, PersonSchema on About, WebsiteSchema on homepage
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **robots.txt:** Allows all, references sitemap, disallows `/_astro/` and `/og/`
- **OG Images:** Auto-generated per post (dark bg, title text)
- **Meta tags:** Title, description, canonical, OG, Twitter cards

## Related Posts Algorithm

Uses hybrid scoring: `(tag_overlap × 2) + keyword_similarity`

1. Tag matches are primary signal (each match = 2 points)
2. Keyword similarity on title + description is secondary (0-1 points)
3. Falls back to recent posts if no relevant matches

## Key Architecture Decisions

1. **Minimal JS** — Theme toggle (inline), post features (anchor links + code copy), Mermaid (when used)
2. **Conditional loading** — KaTeX CSS only loads on pages containing math
3. **Two-column layout** — Content | Margin notes (desktop only)
4. **Margin notes as component** — Explicit control, auto-numbered
5. **Tags for related posts** — Not for filtering/navigation
6. **Auto OG images** — Generated via satori at build time
7. **Single-author blog** — Compact byline, no heavy author boxes
8. **Year-grouped homepage** — Posts organized chronologically with descriptions
9. **Gated deployment** — CI checks must pass before Vercel deploy
10. **Single build** — `vercel build` in CI, deploy with `--prebuilt` (no double building)

## TypeScript

Path alias available:
```typescript
import Component from '@components/Component.astro';
```

## Design Philosophy

**Elegant minimalism:** Clean, high-signal, no clutter. Every element earns its place.

The site is feature-complete. Resist the urge to add more features. The best elevation is better content, not more code.

## Future Additions (only if genuinely needed)

- **Search:** Pagefind (static, ~5KB) — add when content volume justifies it
- **Newsletter:** Consider only if audience requests it

## Deployment

Connected to Vercel via GitHub. Push to `main` triggers CI pipeline → auto-deploy (if checks pass).

**Custom domain:** singhanuvrat.com (configured in Vercel dashboard)

**Required Vercel secrets for GitHub Actions:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
