const TAG_COLORS = [
  'var(--tag-sage)',
  'var(--tag-clay)',
  'var(--tag-rust)',
  'var(--tag-slate)',
  'var(--tag-plum)',
  'var(--tag-ochre)',
  'var(--tag-teal)',
  'var(--tag-rose)',
];

export function getTagColor(tag: string): string {
  if (!tag) return 'var(--ink-4)';
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}
