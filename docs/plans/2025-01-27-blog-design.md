# singhanuvrat.com — Blog Design Document

> **Status:** Ready for implementation
> **Created:** January 27, 2025
> **Author:** Anuvrat Singh + Claude

## Vision

An elegant, minimalist technical blog that prioritizes content over chrome. Inspired by brooker.co.za, tenpow.com, and steipete.me — but with the killer feature of margin notes for contextual annotations.

**Tagline:** "Thinking in systems"

---

## Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Astro + MDX | Fast, component islands for interactivity, excellent DX |
| Hosting | Vercel | Seamless Git deploys, easy custom domain |
| Styling | Vanilla CSS with variables | No framework bloat, full control |
| Typography | Monospace (JetBrains Mono) | Technical aesthetic, like tenpow |

---

## Design Principles

1. **Content is king** — No sidebars, no widgets, no distractions
2. **Zero unnecessary JS** — Only dark mode toggle requires JavaScript
3. **Speed is a feature** — Static HTML + CSS, instant page loads
4. **Elegant defaults, easy overrides** — CSS variables for theming, frontmatter for per-post config

---

## URL Structure

```
singhanuvrat.com/                    → Homepage (post list)
singhanuvrat.com/post-slug           → Individual post
singhanuvrat.com/about               → About page
singhanuvrat.com/rss.xml             → RSS feed
```

No `/blog/` prefix (homepage IS the blog). No date-based URLs (content is evergreen).

---

## Project Structure

```
singhanuvrat.com/
├── src/
│   ├── components/
│   │   ├── Header.astro           # Site title + dark mode toggle
│   │   ├── Footer.astro           # About link, RSS link
│   │   ├── PostCard.astro         # Blog list item (title, date, reading time)
│   │   ├── PostLayout.astro       # Single post template (3-column on desktop)
│   │   ├── TableOfContents.astro  # Floating sidebar ToC (desktop only)
│   │   ├── MarginNote.astro       # Sidenote component
│   │   ├── CodeBlock.astro        # Syntax highlighting + copy button
│   │   └── OGImage.astro          # Auto-generated social preview cards
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell, meta tags, fonts, dark mode script
│   ├── pages/
│   │   ├── index.astro            # Homepage (blog list)
│   │   ├── about.astro            # About page
│   │   ├── [...slug].astro        # Dynamic post pages
│   │   └── rss.xml.ts             # RSS feed generator
│   ├── content/
│   │   ├── config.ts              # Content collection schema
│   │   └── posts/                 # MDX blog posts
│   └── styles/
│       └── global.css             # CSS variables, typography, themes
├── public/
│   ├── fonts/                     # JetBrains Mono font files
│   └── favicon.svg                # Letter "A" in accent color
├── astro.config.mjs
├── package.json
└── CLAUDE.md                      # Documentation for future Claude sessions
```

---

## Visual Design

### Typography

```css
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--text-sm: 0.875rem;    /* 14px - metadata, margin notes */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.25rem;     /* 20px - post titles in list */
--text-xl: 1.75rem;     /* 28px - post title on page */
--text-2xl: 2rem;       /* 32px - site title */
```

### Color System

```css
:root {
  /* Light mode */
  --bg: #ffffff;
  --bg-secondary: #f5f5f5;
  --text: #1a1a1a;
  --text-muted: #666666;
  --border: #e0e0e0;
  --accent: #4a6fa5;
  --accent-hover: #3d5d8a;
}

body.dark {
  /* Dark mode */
  --bg: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text: #e0e0e0;
  --text-muted: #999999;
  --border: #444444;
  --accent: #6db3c2;
  --accent-hover: #8ed4e0;
}
```

### Layout

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────────────────────┐
│                    max-width: 1100px                    │
├──────────┬───────────────────────────┬──────────────────┤
│  180px   │          650px            │      180px       │
│   ToC    │         Content           │   Margin Notes   │
│ (sticky) │                           │                  │
└──────────┴───────────────────────────┴──────────────────┘
```

**Tablet/Mobile (<1024px):**
- Single column, max-width: 650px
- No ToC
- Margin notes become expandable inline footnotes

---

## Features

### Implemented

| Feature | Behavior |
|---------|----------|
| Dark/light toggle | Persists in localStorage, respects system preference on first visit |
| Margin notes | Right margin on desktop, expandable footnotes on mobile |
| Table of contents | Left sidebar on desktop only, highlights current section |
| Reading time | Calculated from word count, shown on list and post |
| "Last updated" | Shows only if updatedDate > pubDate + 7 days |
| Code blocks | Shiki syntax highlighting, copy button on hover |
| RSS feed | Full content feed at /rss.xml |
| OG images | Auto-generated from title, overridable via frontmatter |
| Favicon | Letter "A" in accent color |

### Not Implemented (by design)

| Feature | Reason |
|---------|--------|
| Search | Adds complexity, homepage is scannable |
| Tags | Adds client-side JS, can add later if needed |
| Social share buttons | Browser has native share, users can copy URL |
| Comments | Social media is the discussion venue |
| Analytics | No judgment from page views |
| Email signup | Not needed, RSS + social for distribution |

### Prepared For (future)

| Feature | How to add |
|---------|------------|
| LaTeX/math | Add `remark-math` + `rehype-katex` to astro.config.mjs |
| Tags | Add to frontmatter schema, create filter component |
| Search | Add Pagefind or similar at build time |

---

## Post Format

```mdx
---
title: "The Spanner Paper: Google's Quest for a Globally Consistent Database"
description: "A deep dive into how Google solved global consistency"
pubDate: 2025-10-22
updatedDate: 2025-10-25          # Optional
draft: false                      # Optional, defaults to false
ogImage: /images/custom-og.png    # Optional, overrides auto-generated
---

Content here...

<MarginNote>
Contextual annotation that appears in the margin.
</MarginNote>

More content with `inline code` and:

```python
def example():
    return "syntax highlighted"
```
```

---

## Pages

### Homepage (/)

```
┌─────────────────────────────────────────┐
│  Anuvrat                    [Toggle 🌙] │
│  Thinking in systems                    │
├─────────────────────────────────────────┤
│                                         │
│  The Spanner Paper              5 min   │
│  Oct 22, 2025                           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Deconstructing Bigtable        7 min   │
│  Oct 16, 2025                           │
│                                         │
│  ... more posts ...                     │
│                                         │
├─────────────────────────────────────────┤
│  About · RSS                            │
└─────────────────────────────────────────┘
```

### Post Page (/post-slug)

```
┌─────────────────────────────────────────────────────┐
│  Anuvrat                             [Toggle 🌙]    │
├──────────┬─────────────────────────┬────────────────┤
│          │                         │                │
│   ToC    │  Title                  │  Margin notes  │
│          │  Date · X min read      │  appear here   │
│  · Intro │  Updated: Date          │                │
│  · Setup │                         │                │
│  > Arch  │  Content...             │                │
│  · Conc  │                         │                │
│          │                         │                │
├──────────┴─────────────────────────┴────────────────┤
│  About · RSS                                        │
└─────────────────────────────────────────────────────┘
```

### About Page (/about)

- Brief bio
- Current role at xAI
- Links: GitHub, LinkedIn, Twitter/X
- Optional photo

---

## Migration Plan

### Source

12 posts from blog.singhanuvrat.com (public Substack)

### Process

1. Fetch post list from Substack archive
2. Fetch each post's HTML content
3. Convert HTML → clean MDX
4. Generate frontmatter (title, description, pubDate)
5. Manual polish: fix artifacts, add margin notes where valuable

### Posts to Migrate

| Post | Date | Type |
|------|------|------|
| Delta Lake Deep Dive | Nov 27, 2025 | Technical |
| An AI Was Tricked Into Hacking | Nov 15, 2025 | Essay |
| OpenAI's Browser | Nov 4, 2025 | Technical |
| The Spanner Paper | Oct 22, 2025 | Technical |
| Deconstructing Bigtable | Oct 16, 2025 | Technical |
| Tectonic | Oct 15, 2025 | Technical |
| GFS Paper | Oct 10, 2025 | Technical |
| Human Genome PR | May 29, 2025 | Essay |
| Kubernetes Operator Pattern | May 5, 2025 | Technical |
| Debugging Pip Extras | Jan 8, 2025 | Technical |
| Spark Dynamic Partitions | Jul 12, 2018 | Technical |
| Hive JSON Serde | May 25, 2017 | Technical |

---

## Implementation Phases

### Phase 1: Foundation
- Initialize Astro project with MDX
- Set up CSS variables, typography, colors
- Create BaseLayout with dark mode toggle
- Create Header and Footer components

### Phase 2: Homepage
- Create PostCard component
- Build homepage with post list
- Add reading time calculation
- Style and polish

### Phase 3: Post Template
- Create PostLayout with 3-column grid
- Implement MarginNote component
- Implement TableOfContents (desktop only)
- Code blocks with copy button
- "Last updated" logic

### Phase 4: Content Migration
- Fetch all 12 posts from Substack
- Convert to MDX with frontmatter
- Manual polish pass
- Add margin notes where valuable

### Phase 5: Finishing
- About page
- RSS feed
- OG image generation
- Favicon
- Deploy to Vercel
- Custom domain setup
- Create CLAUDE.md

---

## Domain Setup

**Primary domain:** singhanuvrat.com

**DNS Configuration (at domain registrar):**
- A record → Vercel IP
- Or CNAME → cname.vercel-dns.com

**Old Substack:** blog.singhanuvrat.com will break (accepted)

---

## Success Criteria

- [ ] All 12 posts migrated and rendering correctly
- [ ] Margin notes working on desktop, footnotes on mobile
- [ ] ToC working on desktop
- [ ] Dark/light mode with persistence
- [ ] RSS feed validates
- [ ] OG images generating correctly
- [ ] Lighthouse performance score > 95
- [ ] Deployed to singhanuvrat.com
- [ ] CLAUDE.md created for future sessions
