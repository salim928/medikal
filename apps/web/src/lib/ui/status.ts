/**
 * Shared status → style tokens. One accessible palette for every badge/pill
 * in the app (WCAG-friendly foregrounds on light fills — no *-400 text on white).
 */
export const statusStyles = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  new: "bg-blue-50 text-blue-700 border-blue-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
} as const;

export type StatusKey = keyof typeof statusStyles;

export function statusClass(status: string): string {
  return statusStyles[(status.toLowerCase() as StatusKey)] ?? statusStyles.completed;
}
