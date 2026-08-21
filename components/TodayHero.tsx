"use client";

import Link from "next/link";
import type { TaskKind } from "@/content/curriculum";
import { getTasks, getWeek } from "@/lib/queries";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useTaskComplete } from "@/hooks/useTaskComplete";
import { useTodayDayNumber } from "@/hooks/useTodayDayNumber";
import { splitInstruction } from "@/lib/instruction";
import { parsePushTarget } from "@/lib/pushTarget";
import { weekdayName } from "@/lib/dates";

const KIND_LABEL: Record<TaskKind, string> = {
  learn: "Learn",
  practice: "Practice",
  build: "Build",
  challenge: "Challenge",
  rest: "Rest",
};

export function TodayHero() {
  const weekNumber = useCurrentWeek() ?? 1;
  const today = useTodayDayNumber();
  const week = getWeek(weekNumber);
  const task = week ? getTasks(weekNumber).find((t) => t.day === today) : undefined;
  const [done, toggle] = useTaskComplete(weekNumber, task?.day ?? 0);

  if (!week || !task) return null;

  const { body, proveIt } = splitInstruction(task.instruction);
  const pushTarget = parsePushTarget(task.instruction);

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
      <p className="mt-1 max-w-xl text-muted">{body}</p>
      {proveIt && (
        <div className="mt-4 rounded-r-xl border-l-2 border-cyan bg-cyan/5 px-4 py-3">
          <span className="font-mono text-xs uppercase text-cyan">Prove it</span>
          <p className="mt-1 text-sm">{proveIt}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {task.resource && (
          <a
            href={task.resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-background"
          >
            Open {task.resource.label}
          </a>
        )}
        {task.kind !== "rest" && (
          <button
            type="button"
            onClick={toggle}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              done ? "border-green text-green" : "border-line-2 text-foreground"
            }`}
          >
            {done ? "✓ Done for today" : "Mark done"}
          </button>
        )}
        {pushTarget && <span className="ml-auto font-mono text-xs text-dim">push → {pushTarget}</span>}
      </div>
    </section>
  );
}
