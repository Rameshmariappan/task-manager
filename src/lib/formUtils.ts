// Utility functions for form data transformation.

// Parse a comma-separated tag string into a cleaned string array.
// "backend,  auth, ux, " → ["backend", "auth", "ux"]
export function parseTagsString(tagsInput: string): string[] {
  const parts = tagsInput.split(',')
  const result: string[] = []
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.length > 0) {
      result.push(trimmed)
    }
  }
  return result
}

// Sort an array of strings alphabetically (case-insensitive).
// Used for assignee dropdown ordering in FilterBar.
export function sortStrings(arr: string[]): string[] {
  const copy = [...arr]
  copy.sort((a, b) => a.localeCompare(b))
  return copy
}

// Deduplicate an array of strings (preserves first occurrence order).
export function uniqueStrings(arr: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const s of arr) {
    if (!seen.has(s)) {
      seen.add(s)
      result.push(s)
    }
  }
  return result
}
