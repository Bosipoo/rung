"use client";

import { useRouter } from "next/navigation";
import type { Week } from "@/content/curriculum";
import { getWeek, getWeeks } from "@/lib/queries";
import { isWeekLocked } from "@/lib/stages";
import { setCurrentWeek } from "@/lib/storage";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useWeekDone } from "@/hooks/useWeekDone";

export function WeekAdvance({ week }: { week: Week }) {
  const router = useRouter();
  const currentWeekNumber = useCurrentWeek();
  const done = useWeekDone(week);
  const totalWeeks = getWeeks().length;

  if (done && week.number < totalWeeks) {
    return (
      <button
        type="button"
        onClick={() => {
          setCurrentWeek(week.number + 1);
          router.push(`/week/${week.number + 1}`);
        }}
        className="w-fit rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-background"
      >
        Start week {week.number + 1} →
      </button>
    );
  }

  const currentWeek = getWeek(currentWeekNumber);
  const locked = currentWeek ? isWeekLocked(week, currentWeek) : false;
  if (week.number > currentWeekNumber && !locked) {
    return (
      <button type="button" onClick={() => setCurrentWeek(week.number)} className="w-fit font-mono text-xs text-cyan">
        I&apos;m on this week
      </button>
    );
  }

  return null;
}
