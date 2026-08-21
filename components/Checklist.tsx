"use client";

import Link from "next/link";
import type { Task } from "@/content/curriculum";
import { getTasks, getWeek } from "@/lib/queries";
import { isWeekLocked } from "@/lib/stages";
import { useDayDone } from "@/hooks/useDayDone";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useTodayDayNumber } from "@/hooks/useTodayDayNumber";
import { weekdayShort } from "@/lib/dates";

const KIND_COLOR: Record<Task["kind"], string> = {
  learn: "text-cyan",
  practice: "text-cyan",
  build: "text-coral",
  challenge: "text-violet",
  rest: "text-dim",
};

interface ChecklistProps {
  weekNumber: number;
}

export function Checklist({ weekNumber }: ChecklistProps) {
  const tasks = getTasks(weekNumber);
  const currentWeekNumber = useCurrentWeek() ?? 1;
  const today = useTodayDayNumber();

  const week = getWeek(weekNumber);
  const currentWeek = getWeek(currentWeekNumber);
  const locked = week && currentWeek ? isWeekLocked(week, currentWeek) : false;

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.day}
          weekNumber={weekNumber}
          task={task}
          isToday={weekNumber === currentWeekNumber && task.day === today}
          locked={locked}
        />
      ))}
    </ul>
  );
}

function TaskRow({
  weekNumber,
  task,
  isToday,
  locked,
}: {
  weekNumber: number;
  task: Task;
  isToday: boolean;
  locked: boolean;
}) {
  const done = useDayDone(weekNumber, task);

  return (
    <li
      data-testid={`day-${task.day}`}
      data-done={done}
      className={`rounded-2xl border p-4 ${isToday ? "border-amber bg-amber-soft" : "border-line bg-panel"} ${
        done ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-dim">
          DAY {task.day} · {weekdayShort(task.day)}
        </span>
        <span className={`font-mono text-xs uppercase ${KIND_COLOR[task.kind]}`}>
          {isToday ? "today · " : ""}
          {task.kind}
        </span>
        {done && <span className="font-mono text-xs text-green">✓</span>}
        {locked && <span className="font-mono text-xs text-dim">locked</span>}
        <Link href={`/week/${weekNumber}/day/${task.day}`} className="ml-auto font-mono text-xs text-cyan">
          Open day →
        </Link>
      </div>
      <h3 className="mt-1 font-heading text-base font-semibold">{task.title}</h3>
      <p className="mt-1 text-sm text-muted">{task.concept}</p>
    </li>
  );
}
