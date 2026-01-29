---
name: prepare-nugget
description: Prepare a new bi-weekly nugget for publication - assign number, set dates, review formatting
---

# Prepare Nugget Workflow

You are the blog curator for singhanuvrat.com. The author provides nugget content; you handle metadata and formatting.

## What is a Nugget?

Bi-weekly curated links and commentary from the author's research. Lighter than posts, more frequent. Lives at `/nuggets/`.

## Workflow

### Step 1: Detect New Nugget

Find new or recently modified `.mdx` files in `src/content/nuggets/`:
```bash
git status --porcelain src/content/nuggets/
ls -lt src/content/nuggets/ | head -5
```

### Step 2: Determine Number

Check existing nuggets to find the next number:
```bash
ls src/content/nuggets/
```

If first nugget: number = 1
Otherwise: number = highest existing number + 1

### Step 3: Set Date Range

- `pubDate`: Today's date (publication date)
- `dateRange`: The period covered, e.g., "Jan 15-28, 2025"

Ask author for the date range if not clear from content.

### Step 4: Generate Frontmatter

```yaml
---
title: "Nuggets #[N]"
number: [N]
dateRange: "[date range]"
pubDate: [YYYY-MM-DD]
---
```

### Step 5: Review Content Structure

Nuggets typically have:
- **What Caught My Eye** — Main commentary with integrated links
- **Quick Links** — Rapid-fire links with one-line descriptions

Sections use `##` headings. Links are woven into prose or listed.

If content structure is unclear, suggest organization but don't force a template.

### Step 6: Rename File

Use format: `[number].mdx` (e.g., `1.mdx`, `12.mdx`)

```bash
git mv [old-name] src/content/nuggets/[number].mdx
```

### Step 7: Present Changes

```
## Proposed Nugget

**Number:** #[N]
**Date Range:** [range]
**Publication Date:** [date]
**File:** [number].mdx

**Content Preview:**
[First 2-3 sentences or section headers]

Shall I proceed?
```

### Step 8: Apply Changes

After approval:
1. Update frontmatter
2. Rename file if needed
3. Run `pnpm run build` to verify
4. Commit with message: `content: add nugget #[N]`

### Step 9: Push to Main

```bash
git push origin main
```

This triggers the CI pipeline:
1. Build
2. Link check (validates all URLs)
3. Lighthouse (performance/accessibility)
4. Deploy to Vercel (only if all checks pass)

### Step 10: Summary

Report:
- Nugget prepared and pushed to main
- CI pipeline triggered
- URL will be `/nuggets/[N]/`
- Nugget will be live in ~3-4 minutes (after checks pass)
- If checks fail, deployment is blocked — fix issues and push again

## Content Guidelines

**Links format** (author's choice, both acceptable):

Prose style:
```markdown
OpenAI released [ChatGPT Agent](url), a new capability that allows...
```

List style:
```markdown
- [Article title](url) — Why it matters in one line
```

**Section headers:**
- Use `##` (h2) for main sections
- Keep them short: "What Caught My Eye", "Quick Links", "On My Mind"

## Invocation

The author will say:
- `/prepare-nugget`
- "prepare the nugget"
- "get the nugget ready"

Respond by executing this workflow.
