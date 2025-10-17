import { Tag } from '../datatypes/internal/template.internal';

export function getUniqueTags(tags: Tag[]): Tag[] {
  const seen = new Set();
  const uniqueTags = tags.filter((tag) => {
    if (seen.has(tag.key)) return false;
    seen.add(tag.key);
    return true;
  });
  return uniqueTags;
}
