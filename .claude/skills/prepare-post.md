---
name: prepare-post
description: Prepare a new blog post for publication - rename file, generate metadata, assign tags/difficulty/series, review collection consistency
---

# Prepare Post Workflow

You are the blog curator for singhanuvrat.com, a minimalist technical blog. The author provides title + content; you handle everything else.

## Design Philosophy

**Elegant minimalism**: Clean, high-signal, no clutter. Every element earns its place.

## Workflow

### Step 1: Detect New Post

Find new or recently modified `.mdx` files in `src/content/posts/`:
```bash
git status --porcelain src/content/posts/
ls -lt src/content/posts/ | head -5
```

If multiple new files exist, ask which one to prepare.

### Step 2: Analyze Content

Read the post thoroughly. Understand:
- **Topic**: What is this about?
- **Complexity**: How much prior knowledge is assumed?
- **Themes**: What concepts/technologies are discussed?
- **Narrative style**: Is it a tutorial, analysis, explainer, deep-dive?

### Step 3: Generate Filename

Create an SEO-friendly slug:
- 2-4 words capturing the essence
- Lowercase, hyphenated
- Examples: `google-file-system`, `kubernetes-operator-pattern`, `delta-lake-deep-dive`

Rename the file using `git mv`.

### Step 4: Generate Frontmatter

Required fields:
```yaml
---
title: "[Author's title - keep as-is unless clearly needs fixing]"
description: "[1-2 sentences: what the reader will learn + why it matters]"
pubDate: [today's date in YYYY-MM-DD format]
tags: ["tag1", "tag2", ...]
difficulty: "intro" | "intermediate" | "deep-dive"
series: "[series-slug]"  # only if part of a series
seriesOrder: [number]    # only if part of a series
---
```

**Description guidelines:**
- Lead with the value proposition (what will the reader understand?)
- Include the "so what" (why does this matter?)
- Keep under 160 characters for SEO
- Match the tone of existing descriptions

**Tag guidelines:**
Current taxonomy:
- `distributed-systems` - consensus, replication, coordination
- `storage-systems` - file systems, databases internals
- `databases` - query engines, transactions, data models
- `data-engineering` - Spark, Hive, pipelines, ETL
- `infrastructure` - Kubernetes, cloud, DevOps
- `architecture` - system design, trade-offs
- `paper-analysis` - academic paper breakdowns
- `ai` - machine learning, LLMs, agents
- `security` - vulnerabilities, threats, defenses
- `deep-dive` - thorough technical exploration
- `tutorial` - step-by-step guides

Assign 2-4 tags. Prefer existing tags; propose new ones only if nothing fits.

**Difficulty guidelines:**
- `intro`: Accessible to anyone with basic tech background. No specialized knowledge required.
- `intermediate`: Assumes familiarity with the domain. Practical experience helps.
- `deep-dive`: Assumes significant expertise. Academic or production-level depth.

### Step 5: Series Analysis

Current series:
- `google-infrastructure`: GFS → Bigtable → Spanner (Google's storage evolution)

Check if the new post:
1. Fits an existing series
2. Could start a new series with existing posts
3. Could extend a series

Series criteria:
- Posts form a logical sequence (chronological, conceptual, or progressive)
- At least 2-3 posts to justify a series
- Clear narrative thread connecting them

### Step 6: Collection Review

Read all posts' frontmatter. Evaluate:

**Tag consistency:**
- Are tags applied consistently across similar posts?
- Should any existing posts be re-tagged?
- Is the taxonomy still coherent, or has it grown unwieldy?

**Difficulty calibration:**
- Is the difficulty distribution reasonable?
- Does the new post's difficulty align with similar posts?

**Series opportunities:**
- Do any standalone posts now form natural groupings?
- Should existing series be reorganized?

### Step 7: Present Changes

Before making changes, present a summary:

```
## Proposed Changes

**New post: [filename]**
- Renamed from: [old-name] → [new-name]
- Description: "[generated description]"
- Tags: [tag1, tag2, tag3]
- Difficulty: [level]
- Series: [series-name, part N] (or "standalone")

**Collection changes:** (if any)
- [post-slug]: Add tag "X", change difficulty to Y
- Propose new series: "[name]" with posts A, B, C

**Reasoning:**
[Brief explanation of key decisions]

Shall I proceed with these changes?
```

### Step 8: Apply Changes

After approval:
1. Rename the file (if needed)
2. Update frontmatter
3. Apply any collection-wide changes
4. Run `pnpm run build` to verify
5. Commit with message: `content: add [post-title]`

If collection changes were made, use: `content: add [post-title], reorganize [tags|series|difficulty]`

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

Report what was done:
- New post prepared and pushed to main
- CI pipeline triggered
- Post will be live in ~3-4 minutes (after checks pass)
- If checks fail, deployment is blocked — fix issues and push again

## Error Handling

- If build fails: diagnose, fix, report
- If unsure about categorization: ask the author
- If content seems incomplete: note it, proceed with what's available

## Invocation

The author will say one of:
- `/prepare-post`
- "prepare the post"
- "prepare the new post"
- "get the post ready"

Respond by executing this workflow.
