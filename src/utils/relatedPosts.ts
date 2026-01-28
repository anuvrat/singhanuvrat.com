import type { CollectionEntry } from 'astro:content';

/**
 * Finds related posts using a hybrid approach:
 * 1. Tag overlap (strongest signal)
 * 2. Keyword similarity on title + description (fallback)
 *
 * Posts with more shared tags rank higher. Within same tag count,
 * keyword similarity breaks ties.
 */

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'were', 'they',
  'this', 'that', 'with', 'from', 'your', 'what', 'when', 'where', 'which',
  'their', 'there', 'these', 'those', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further',
  'then', 'once', 'here', 'just', 'only', 'both', 'each', 'more', 'most',
  'other', 'some', 'such', 'than', 'very', 'will', 'also', 'how', 'why',
]);

/**
 * Extracts keywords from text (words 4+ chars, no stop words)
 */
function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 4 && !STOP_WORDS.has(word));

  return new Set(words);
}

/**
 * Calculates tag overlap count between two posts
 */
function countTagOverlap(tags1: string[], tags2: string[]): number {
  const set1 = new Set(tags1);
  return tags2.filter(tag => set1.has(tag)).length;
}

/**
 * Calculates Jaccard similarity between two keyword sets
 */
function calculateKeywordSimilarity(
  keywords1: Set<string>,
  keywords2: Set<string>
): number {
  if (keywords1.size === 0 || keywords2.size === 0) return 0;

  let overlap = 0;
  for (const word of keywords1) {
    if (keywords2.has(word)) overlap++;
  }

  const union = new Set([...keywords1, ...keywords2]).size;
  return overlap / union;
}

/**
 * Finds related posts based on tag overlap and keyword similarity.
 * Returns up to `limit` related posts, excluding the current post.
 */
export function findRelatedPosts(
  currentPost: CollectionEntry<'posts'>,
  allPosts: CollectionEntry<'posts'>[],
  limit = 3
): CollectionEntry<'posts'>[] {
  const currentTags = currentPost.data.tags || [];
  const currentKeywords = extractKeywords(
    `${currentPost.data.title} ${currentPost.data.description}`
  );

  const scored = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      const postTags = post.data.tags || [];
      const postKeywords = extractKeywords(
        `${post.data.title} ${post.data.description}`
      );

      // Tag overlap is the primary signal (weighted heavily)
      const tagScore = countTagOverlap(currentTags, postTags);

      // Keyword similarity is the secondary signal
      const keywordScore = calculateKeywordSimilarity(currentKeywords, postKeywords);

      // Combined score: tag overlap dominates, keyword similarity breaks ties
      // Each tag match is worth more than max keyword similarity (1.0)
      const combinedScore = (tagScore * 2) + keywordScore;

      return { post, tagScore, keywordScore, combinedScore };
    })
    .sort((a, b) => {
      // Sort by combined score, then by recency as final tiebreaker
      if (b.combinedScore !== a.combinedScore) {
        return b.combinedScore - a.combinedScore;
      }
      return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
    });

  // Return top matches (only if they have some relevance)
  const relevant = scored.filter(({ combinedScore }) => combinedScore > 0);

  if (relevant.length >= limit) {
    return relevant.slice(0, limit).map(({ post }) => post);
  }

  // Fill with recent posts if not enough related posts
  const relatedSlugs = new Set(relevant.map(({ post }) => post.slug));
  const recentPosts = allPosts
    .filter(post => post.slug !== currentPost.slug && !relatedSlugs.has(post.slug))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return [
    ...relevant.map(({ post }) => post),
    ...recentPosts.slice(0, limit - relevant.length),
  ].slice(0, limit);
}
