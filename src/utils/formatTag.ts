/** Present an existing frontmatter tag. Does not invent topics. */
export function formatTag(tag: string): string {
  return tag
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
