import type { Stage, Week } from "@/content/curriculum";

export const STAGE_ORDER: Stage[] = ["python", "html", "css", "javascript"];

export const STAGE_LABEL: Record<Stage, string> = {
  python: "Python",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

// Locked means "can't mark done yet", not "can't read" — a week is locked
// only once it's in a stage beyond the one the learner is currently in.
export function isWeekLocked(week: Week, currentWeek: Week): boolean {
  return STAGE_ORDER.indexOf(week.stage) > STAGE_ORDER.indexOf(currentWeek.stage);
}
