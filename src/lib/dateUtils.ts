// Formats a YYYY-MM-DD string to "DD MMM YYYY" (e.g. "15 Jun 2026").
// Local date constructor avoids the UTC midnight shift from new Date('YYYY-MM-DD').
export function formatDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
