# singhanuvrat.com Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimalist technical blog with margin notes, dark mode, and ToC using Astro + MDX, then migrate 12 posts from Substack.

**Architecture:** Static site with Astro, MDX for content, CSS variables for theming, zero JS except dark mode toggle. Three-column layout on desktop (ToC | Content | Margin Notes), single column on mobile.

**Tech Stack:** Astro 4.x, MDX, Shiki (syntax highlighting), Vercel

---

## Phase 1: Foundation

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Initialize Astro with pnpm**

Run:
```bash
cd /Users/anuvrat/Projects/anuvrat/singhanuvrat.com
pnpm create astro@latest . --template minimal --install --git --typescript strict
```

Select when prompted:
- Install dependencies: Yes
- Initialize git: No (already have git)
- TypeScript: Strict

**Step 2: Add MDX integration**

Run:
```bash
pnpm add @astrojs/mdx
```

**Step 3: Configure Astro for MDX**

Modify `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://singhanuvrat.com',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

**Step 4: Update .gitignore**

Ensure `.gitignore` includes:
```
node_modules/
dist/
.astro/
.env
.env.*
.DS_Store
```

**Step 5: Verify build works**

Run:
```bash
pnpm run build
```

Expected: Build succeeds with no errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize Astro project with MDX"
```

---

### Task 2: Set Up Typography and CSS Variables

**Files:**
- Create: `src/styles/global.css`
- Create: `public/fonts/` (directory)

**Step 1: Download JetBrains Mono font**

Run:
```bash
mkdir -p public/fonts
curl -L "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip" -o /tmp/jetbrains-mono.zip
unzip -j /tmp/jetbrains-mono.zip "fonts/webfonts/JetBrainsMono-Regular.woff2" "fonts/webfonts/JetBrainsMono-Bold.woff2" "fonts/webfonts/JetBrainsMono-Italic.woff2" -d public/fonts/
rm /tmp/jetbrains-mono.zip
```

**Step 2: Create global CSS with variables**

Create `src/styles/global.css`:

```css
/* Font face declarations */
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* CSS Variables */
:root {
  /* Typography */
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.75rem;
  --text-2xl: 2rem;

  --line-height: 1.7;
  --line-height-tight: 1.3;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Layout */
  --content-width: 650px;
  --sidebar-width: 180px;
  --max-width: 1100px;

  /* Light mode colors */
  --bg: #ffffff;
  --bg-secondary: #f5f5f5;
  --text: #1a1a1a;
  --text-muted: #666666;
  --border: #e0e0e0;
  --accent: #4a6fa5;
  --accent-hover: #3d5d8a;
}

/* Dark mode */
body.dark {
  --bg: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text: #e0e0e0;
  --text-muted: #999999;
  --border: #444444;
  --accent: #6db3c2;
  --accent-hover: #8ed4e0;
}

/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  line-height: var(--line-height);
  color: var(--text);
  background-color: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  line-height: var(--line-height-tight);
  font-weight: 700;
}

h1 { font-size: var(--text-2xl); }
h2 { font-size: var(--text-xl); margin-top: var(--space-2xl); }
h3 { font-size: var(--text-lg); margin-top: var(--space-xl); }

p {
  margin-top: var(--space-md);
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background-color: var(--bg-secondary);
  padding: 0.1em 0.3em;
  border-radius: 3px;
}

pre {
  background-color: var(--bg-secondary);
  padding: var(--space-md);
  border-radius: 6px;
  overflow-x: auto;
  margin-top: var(--space-md);
}

pre code {
  background: none;
  padding: 0;
  font-size: var(--text-sm);
}

/* Lists */
ul, ol {
  margin-top: var(--space-md);
  padding-left: var(--space-lg);
}

li {
  margin-top: var(--space-xs);
}

/* Blockquote */
blockquote {
  border-left: 3px solid var(--border);
  padding-left: var(--space-md);
  margin-top: var(--space-md);
  color: var(--text-muted);
  font-style: italic;
}

/* Horizontal rule */
hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: var(--space-xl) 0;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
}

/* Selection */
::selection {
  background-color: var(--accent);
  color: var(--bg);
}

/* Code block wrapper for copy button */
pre {
  position: relative;
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add typography and CSS variables with dark mode support"
```

---

### Task 3: Create Base Layout with Dark Mode Toggle

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description = "Thinking in systems", ogImage } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalURL} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    {ogImage && <meta property="twitter:image" content={ogImage} />}

    <!-- RSS -->
    <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />

    <!-- Preload fonts -->
    <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin />

    <!-- Dark mode script (inline to prevent flash) -->
    <script is:inline>
      (function() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.body.classList.add('dark');
        }
      })();
    </script>

    <style is:global>
      @import '../styles/global.css';
    </style>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Step 2: Update index.astro to use BaseLayout**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Anuvrat — Thinking in systems">
  <main>
    <h1>Anuvrat</h1>
    <p>Thinking in systems</p>
  </main>
</BaseLayout>
```

**Step 3: Verify it works**

Run:
```bash
pnpm run dev
```

Expected: Site loads at localhost:4321 with correct fonts and no flash of unstyled content.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout with meta tags and dark mode script"
```

---

### Task 4: Create Header Component with Dark Mode Toggle

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Create ThemeToggle component**

Create `src/components/ThemeToggle.astro`:

```astro
---
---

<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
  title="Toggle dark mode"
>
  <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
  <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    padding: var(--space-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  button:hover {
    background-color: var(--bg-secondary);
  }

  #sun-icon {
    display: none;
  }

  :global(body.dark) #sun-icon {
    display: block;
  }

  :global(body.dark) #moon-icon {
    display: none;
  }
</style>

<script>
  const toggle = document.getElementById('theme-toggle');

  toggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

**Step 2: Create Header component**

Create `src/components/Header.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

interface Props {
  showTagline?: boolean;
}

const { showTagline = true } = Astro.props;
---

<header>
  <div class="header-content">
    <div class="header-left">
      <a href="/" class="site-title">Anuvrat</a>
      {showTagline && <span class="tagline">Thinking in systems</span>}
    </div>
    <ThemeToggle />
  </div>
</header>

<style>
  header {
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--space-xl);
  }

  .header-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .site-title {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
  }

  .site-title:hover {
    color: var(--accent);
    text-decoration: none;
  }

  .tagline {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  @media (max-width: 640px) {
    .tagline {
      display: none;
    }
  }
</style>
```

**Step 3: Update BaseLayout to include Header**

Modify `src/layouts/BaseLayout.astro`, add import and use Header in the body.

**Step 4: Verify toggle works**

Run:
```bash
pnpm run dev
```

Expected: Toggle button switches between light/dark, persists on reload.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Header with dark mode toggle"
```

---

### Task 5: Create Footer Component

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
---

<footer>
  <div class="footer-content">
    <nav class="footer-links">
      <a href="/about">About</a>
      <span class="separator">·</span>
      <a href="/rss.xml">RSS</a>
    </nav>
  </div>
</footer>

<style>
  footer {
    padding: var(--space-xl) 0;
    margin-top: var(--space-2xl);
    border-top: 1px solid var(--border);
  }

  .footer-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  .footer-links {
    display: flex;
    gap: var(--space-sm);
    font-size: var(--text-sm);
  }

  .footer-links a {
    color: var(--text-muted);
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  .separator {
    color: var(--text-muted);
  }
</style>
```

**Step 2: Update BaseLayout to include Footer**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Footer component"
```

---

### Task 6: Create Favicon

**Files:**
- Create: `public/favicon.svg`

**Step 1: Create SVG favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="#4a6fa5"/>
  <text x="50" y="72" font-family="ui-monospace, monospace" font-size="60" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
</svg>
```

**Step 2: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: add favicon with letter A in accent color"
```

---

## Phase 2: Homepage

### Task 7: Set Up Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/` (directory)

**Step 1: Create content config**

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

export const collections = { posts };
```

**Step 2: Create posts directory and test post**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: set up content collections for blog posts"
```

---

### Task 8: Create PostCard Component

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/utils/readingTime.ts`

**Step 1: Create reading time utility**

Create `src/utils/readingTime.ts`:

```typescript
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}
```

**Step 2: Create PostCard component**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add PostCard component with reading time"
```

---

### Task 9: Build Homepage with Post List

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Update homepage to list posts**

**Step 2: Verify homepage displays posts**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build homepage with post list"
```

---

## Phase 3: Post Template

### Task 10: Create MarginNote Component

**Files:**
- Create: `src/components/MarginNote.astro`

Uses checkbox hack for mobile expandable footnotes, CSS positioning for desktop margin placement.

**Commit:**

```bash
git add -A
git commit -m "feat: add MarginNote component with mobile fallback"
```

---

### Task 11: Create TableOfContents Component

**Files:**
- Create: `src/components/TableOfContents.astro`

Desktop-only sticky sidebar with scroll-spy highlighting.

**Commit:**

```bash
git add -A
git commit -m "feat: add TableOfContents with scroll highlighting"
```

---

### Task 12: Add Copy Button to Code Blocks

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

Add script that injects copy buttons into pre elements, using clipboard API.

**Commit:**

```bash
git add -A
git commit -m "feat: add copy button to code blocks"
```

---

### Task 13: Create PostLayout with Three-Column Grid

**Files:**
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/[...slug].astro`

Three-column CSS grid on desktop, single column on mobile.

**Commit:**

```bash
git add -A
git commit -m "feat: add PostLayout with three-column grid and dynamic routes"
```

---

### Task 14: Test MarginNote in MDX

**Files:**
- Modify: `src/content/posts/hello-world.mdx`

Verify margin notes work on desktop and mobile.

**Commit:**

```bash
git add -A
git commit -m "test: verify MarginNote component works in MDX"
```

---

## Phase 4: Content Migration

### Task 15: Create Migration Script

**Files:**
- Create: `scripts/migrate-substack.ts`

Script to fetch public Substack posts and convert to MDX.

**Step 1: Install dependencies**

```bash
pnpm add -D cheerio turndown @types/turndown tsx
```

**Step 2: Add script to package.json**

```json
"migrate": "tsx scripts/migrate-substack.ts"
```

**Commit:**

```bash
git add -A
git commit -m "feat: add Substack migration script"
```

---

### Task 16: Run Migration

**Step 1: Execute migration**

```bash
pnpm run migrate
```

**Step 2: Remove test post, verify posts appear**

**Commit:**

```bash
git add -A
git commit -m "content: migrate 12 posts from Substack"
```

---

### Task 17: Manual Polish Pass

Review each migrated post for:
- Formatting artifacts
- Code block language tags
- Opportunities for margin notes

Commit after each post is polished.

---

## Phase 5: Finishing

### Task 18: Create About Page

**Files:**
- Create: `src/pages/about.astro`

Brief bio, current role at xAI, social links.

**Commit:**

```bash
git add -A
git commit -m "feat: add About page"
```

---

### Task 19: Create RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

**Step 1: Install RSS package**

```bash
pnpm add @astrojs/rss
```

**Commit:**

```bash
git add -A
git commit -m "feat: add RSS feed"
```

---

### Task 20: Create OG Image Generation

**Files:**
- Create: `src/pages/og/[...slug].png.ts`

**Step 1: Install satori and sharp**

```bash
pnpm add satori sharp
```

Auto-generate social preview images from post titles.

**Commit:**

```bash
git add -A
git commit -m "feat: add auto-generated OG images"
```

---

### Task 21: Deploy to Vercel

**Step 1: Install Vercel adapter**

```bash
pnpm add @astrojs/vercel
```

**Step 2: Update astro.config.mjs with Vercel adapter**

**Step 3: Push to GitHub and connect Vercel**

**Step 4: Configure custom domain**

---

### Task 22: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

Document project structure, commands, and architecture decisions for future Claude sessions.

**Commit:**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md for future Claude sessions"
git push origin main
```

---

## Success Checklist

- [ ] All 12 posts migrated and rendering correctly
- [ ] Margin notes working (desktop: sidebar, mobile: expandable)
- [ ] ToC working on desktop, hidden on mobile
- [ ] Dark/light mode with persistence
- [ ] RSS feed validates at /rss.xml
- [ ] OG images generating at /og/post-slug.png
- [ ] Lighthouse performance score > 95
- [ ] Deployed to singhanuvrat.com
- [ ] CLAUDE.md created
