export type Tag = { id: string; name: string; key: string };

export function getUniqueTags(tags: Tag[]): Tag[] {
  const seen = new Set();
  const uniqueTags = tags.filter((tag) => {
    if (seen.has(tag.key)) return false;
    seen.add(tag.key);
    return true;
  });
  return uniqueTags;
}
