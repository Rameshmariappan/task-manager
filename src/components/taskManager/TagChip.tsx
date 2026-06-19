interface TagChipProps {
  tag: string
}

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-surface-app)] text-[var(--color-text-secondary)] border border-[var(--color-tm-border)] px-2 py-0.5 text-[0.68rem] font-semibold leading-none">
      {tag}
    </span>
  )
}
