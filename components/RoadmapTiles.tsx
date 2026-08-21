"use client";

import Link from "next/link";
import type { Week } from "@/content/curriculum";
import { getWeeks } from "@/lib/queries";
import { STAGE_LABEL, STAGE_ORDER } from "@/lib/stages";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useWeekDone } from "@/hooks/useWeekDone";

export function RoadmapTiles() {
  const currentWeek = useCurrentWeek() ?? 1;
  const weeks = getWeeks();
  const currentStage = weeks.find((week) => week.number === currentWeek)?.stage;
  const currentStageIndex = STAGE_ORDER.indexOf(currentStage ?? STAGE_ORDER[0]);

  return (
    <div className="flex flex-col gap-3">
      {STAGE_ORDER.map((stage, stageIndex) => (
        <div
          key={stage}
          className="grid grid-cols-1 gap-2 border-t border-line pt-3 sm:grid-cols-[110px_1fr] sm:items-center"
        >
          <p className="font-heading text-sm font-semibold">{STAGE_LABEL[stage]}</p>
          <div className="flex flex-wrap gap-1.5">
            {weeks
              .filter((week) => week.stage === stage)
              .map((week) => (
                <RoadmapTile
                  key={week.number}
                  week={week}
                  isCurrent={week.number === currentWeek}
                  locked={stageIndex > currentStageIndex}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapTile({
  week,
  isCurrent,
  locked,
}: {
  week: Week;
  isCurrent: boolean;
  locked: boolean;
}) {
  const done = useWeekDone(week);

  const stateClass = isCurrent
    ? "border-amber bg-amber font-bold text-background"
    : done
      ? "border-green/35 bg-green/10 text-green"
      : locked
        ? "border-line text-dim opacity-40"
        : "border-line text-muted hover:border-line-2 hover:text-foreground";

  const content = (
    <>
      {week.number}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-2 bg-panel-2 px-2.5 py-1.5 font-sans text-xs font-normal normal-case text-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {week.topic}
      </span>
    </>
  );

  const className = `group relative grid h-11 w-11 place-items-center rounded-lg border font-mono text-xs ${stateClass}`;

  // Locked only blocks marking a week done (enforced on its Checklist) — every
  // week stays readable, so the tile is always a real link.
  return (
    <Link
      href={`/week/${week.number}`}
      className={className}
      data-testid={isCurrent ? "current-week-marker" : undefined}
    >
      {content}
    </Link>
  );
}
