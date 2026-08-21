"use client";

import Link from "next/link";
import type { Task } from "@/content/curriculum";
import { getTasks, getWeek } from "@/lib/queries";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useDayDone } from "@/hooks/useDayDone";
import { useTodayDayNumber } from "@/hooks/useTodayDayNumber";
import { weekdayShort } from "@/lib/dates";
import { BuildLine } from "@/components/BuildLine";

const KIND_COLOR: Record<Task["kind"], string> = {
  learn: "text-cyan",
  practice: "text-cyan",
  build: "text-coral",
  challenge: "text-violet",
  rest: "text-dim",
};

export function WeekStrip() {
  const weekNumber = useCurrentWeek() ?? 1;
  const today = useTodayDayNumber();
  const week = getWeek(weekNumber);

  if (!week) return null;

  const tasks = getTasks(weekNumber);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">This week — {week.topic}</h2>
        <Link href={`/week/${weekNumber}`} className="font-mono text-xs text-cyan">
          Open the full week →
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {tasks.map((task) => (
          <DayCell key={task.day} weekNumber={weekNumber} task={task} isToday={task.day === today} />
        ))}
      </div>
      <BuildLine week={week} />
    </section>
  );
}

function DayCell({
  weekNumber,
  task,
  isToday,
}: {
  weekNumber: number;
  task: Task;
  isToday: boolean;
}) {
  const done = useDayDone(weekNumber, task);

  return (
    <Link
      href={`/week/${weekNumber}/day/${task.day}`}
      data-testid={`day-strip-${task.day}`}
      data-done={done}
      className={`relative flex min-h-[92px] flex-col gap-1 rounded-xl border p-2.5 ${
        isToday ? "border-amber bg-amber-soft" : "border-line bg-panel"
      } ${done ? "opacity-55" : ""}`}
    >
      {done && <span className="absolute right-2 top-2 font-mono text-xs text-green">✓</span>}
      <span className={`font-mono text-xs font-semibold ${isToday ? "text-amber" : "text-dim"}`}>
        {weekdayShort(task.day)}
      </span>
      <span className={`font-mono text-[10px] font-bold uppercase tracking-wide ${KIND_COLOR[task.kind]}`}>
        {task.kind}
      </span>
      <span className="mt-0.5 font-heading text-xs font-semibold leading-tight">{task.title}</span>
    </Link>
  );
}
