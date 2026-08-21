"use client";

import Link from "next/link";
import type { Task, TaskKind } from "@/content/curriculum";
import { getTasks, getWeek } from "@/lib/queries";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useDayDone } from "@/hooks/useDayDone";
import { useTodayDayNumber } from "@/hooks/useTodayDayNumber";
import { weekdayName } from "@/lib/dates";

const KIND_LABEL: Record<TaskKind, string> = {
  learn: "Learn",
  practice: "Practice",
  build: "Build",
  challenge: "Challenge",
  rest: "Rest",
};

const FALLBACK_TASK: Task = { day: 0, kind: "rest", title: "", concept: "" };

export function TodayHero() {
  const weekNumber = useCurrentWeek() ?? 1;
  const today = useTodayDayNumber();
  const week = getWeek(weekNumber);
  const task = week ? getTasks(weekNumber).find((t) => t.day === today) : undefined;
  const done = useDayDone(weekNumber, task ?? FALLBACK_TASK);

  if (!week || !task) return null;

  const primaryResource = task.lesson?.[0];

  return (
    <section className="rounded-2xl border border-amber/45 bg-amber-soft p-6">
      <span className="font-mono text-xs uppercase tracking-wide text-amber">
        {weekdayName(today)} · Week {week.number}
        {task.day <= 6 && ` · Day ${task.day} of 6`} · {KIND_LABEL[task.kind]}
      </span>
      <h1 className="mt-2 font-heading text-3xl font-bold">
        <Link href={`/week/${weekNumber}/day/${task.day}`} className="hover:text-amber">
          {task.title}
        </Link>
      </h1>
      <p className="mt-1 max-w-xl text-muted">{task.concept}</p>
      {task.prove && (
        <div className="mt-4 rounded-r-xl border-l-2 border-cyan bg-cyan/5 px-4 py-3">
          <span className="font-mono text-xs uppercase text-cyan">Prove it</span>
          <p className="mt-1 text-sm">{task.prove}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {primaryResource && (
          <a
            href={primaryResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-background"
          >
            Open {primaryResource.label}
          </a>
        )}
        {task.kind !== "rest" && (
          <span
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              done ? "border-green text-green" : "border-line-2 text-muted"
            }`}
          >
            {done ? "✓ Done" : "Not done yet"}
          </span>
        )}
        {task.push && <span className="ml-auto font-mono text-xs text-dim">push → {task.push}</span>}
      </div>
    </section>
  );
}
