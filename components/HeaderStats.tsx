"use client";

import { getTotalTaskCount, getWeeks } from "@/lib/queries";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useCompletedTaskCount } from "@/hooks/useCompletedTaskCount";

export function HeaderStats() {
  const currentWeek = useCurrentWeek() ?? 1;
  const completed = useCompletedTaskCount();
  const total = getTotalTaskCount();
  const totalWeeks = getWeeks().length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-muted">
      <span>
        week <b className="text-foreground">{currentWeek}</b>/{totalWeeks}
      </span>
      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-panel-2">
        <span className="block h-full bg-cyan" style={{ width: `${percent}%` }} />
      </span>
      <span data-testid="progress-count">
        <b className="text-foreground">{completed}</b>/{total}
      </span>
    </div>
  );
}
