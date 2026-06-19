const PALETTE = [
  '#6366F1', // indigo
  '#EC4899', // pink
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
]

// Sum of char codes in the name string
function charCodeSum(name: string): number {
  return name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function getAvatarColour(name: string): string {
  return PALETTE[charCodeSum(name) % PALETTE.length]
}

// Initials: first char of first word + first char of last word
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? '?'
  return (
    (words[0][0]?.toUpperCase() ?? '') +
    (words[words.length - 1][0]?.toUpperCase() ?? '')
  )
}

interface AssigneeAvatarProps {
  name: string
  size?: 'sm' | 'md'
}

export function AssigneeAvatar({ name, size = 'md' }: AssigneeAvatarProps) {
  const colour = getAvatarColour(name)
  const initials = getInitials(name)
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-[0.6rem]' : 'w-8 h-8 text-[0.68rem]'

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none`}
      style={{ backgroundColor: colour }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  )
}
