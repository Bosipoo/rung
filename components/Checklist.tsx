"use client";

import Link from "next/link";
import type { Task } from "@/content/curriculum";
import { getTasks, getWeek } from "@/lib/queries";
import { isWeekLocked } from "@/lib/stages";
import { useTaskComplete } from "@/hooks/useTaskComplete";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useTodayDayNumber } from "@/hooks/useTodayDayNumber";
import { RevealSolution } from "@/components/RevealSolution";
import { splitInstruction } from "@/lib/instruction";
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
  const [done, toggle] = useTaskComplete(weekNumber, task.day);
  const { body, proveIt } = splitInstruction(task.instruction);

  return (
    <li
      className={`grid grid-cols-[22px_1fr] gap-3 rounded-2xl border p-4 ${
        isToday ? "border-amber bg-amber-soft" : "border-line bg-panel"
      } ${done ? "opacity-60" : ""}`}
    >
      <input
        type="checkbox"
        data-testid={`task-${task.day}`}
        checked={done}
        onChange={toggle}
        disabled={locked}
        className={`mt-1 accent-cyan ${locked ? "cursor-not-allowed opacity-40" : ""}`}
      />
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-dim">
            DAY {task.day} · {weekdayShort(task.day)}
          </span>
          <span className={`font-mono text-xs uppercase ${KIND_COLOR[task.kind]}`}>
            {isToday ? "today · " : ""}
            {task.kind}
          </span>
          <Link
            href={`/week/${weekNumber}/day/${task.day}`}
            className="ml-auto font-mono text-xs text-cyan"
          >
            Open day →
          </Link>
        </div>
        <h3 className="mt-1 font-heading text-base font-semibold">{task.title}</h3>
        <p className="mt-1 text-sm text-muted">{body}</p>
        {proveIt && (
          <div className="mt-2 rounded-r-xl border-l-2 border-cyan bg-cyan/5 px-3 py-2">
            <span className="font-mono text-xs uppercase text-cyan">Prove it</span>
            <p className="mt-1 text-sm">{proveIt}</p>
          </div>
        )}
        {task.code && (
          <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-background p-3 font-mono text-xs">
            {task.code}
          </pre>
        )}
        {task.solution && <RevealSolution solution={task.solution} />}
        {task.resource && (
          <a
            href={task.resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-lg border border-cyan/35 px-2.5 py-1.5 text-xs text-cyan"
          >
            ↗ {task.resource.label}
          </a>
        )}
      </div>
    </li>
  );
}
