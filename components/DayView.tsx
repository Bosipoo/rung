"use client";

import Link from "next/link";
import type { Task, Week } from "@/content/curriculum";
import { getWeek, getWeeks } from "@/lib/queries";
import { isWeekLocked } from "@/lib/stages";
import { nextDay, previousDay } from "@/lib/dayNav";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useTaskComplete } from "@/hooks/useTaskComplete";
import { splitInstruction } from "@/lib/instruction";
import { parsePushTarget } from "@/lib/pushTarget";
import { weekdayName } from "@/lib/dates";
import { RevealSolution } from "@/components/RevealSolution";

const KIND_LABEL: Record<Task["kind"], string> = {
  learn: "Learn",
  practice: "Practice",
  build: "Build",
  challenge: "Challenge",
  rest: "Rest",
};

export function DayView({ week, task }: { week: Week; task: Task }) {
  const currentWeekNumber = useCurrentWeek() ?? 1;
  const currentWeek = getWeek(currentWeekNumber);
  const locked = currentWeek ? isWeekLocked(week, currentWeek) : false;
  const [done, toggle] = useTaskComplete(week.number, task.day);
  const { body, proveIt } = splitInstruction(task.instruction);
  const pushTarget = parsePushTarget(task.instruction);

  const totalWeeks = getWeeks().length;
  const prev = previousDay({ week: week.number, day: task.day });
  const next = nextDay({ week: week.number, day: task.day }, totalWeeks);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8 sm:px-5">
      <div>
        <p className="font-mono text-xs uppercase text-dim">
          Day {task.day} · {weekdayName(task.day)} · {KIND_LABEL[task.kind]}
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold">{task.title}</h1>
      </div>

      <p className="text-muted">{body}</p>

      {proveIt && (
        <div className="rounded-r-xl border-l-2 border-cyan bg-cyan/5 px-4 py-3">
          <span className="font-mono text-xs uppercase text-cyan">Prove it</span>
          <p className="mt-1 text-sm">{proveIt}</p>
        </div>
      )}

      {task.kind === "build" && (
        <div className="rounded-2xl border border-dashed border-line-2 p-4">
          <span className="font-mono text-xs uppercase text-coral">Project</span>
          <p className="mt-1 font-heading text-base font-semibold">{week.project}</p>
          <p className="mt-1 text-sm text-muted">{week.description}</p>
          <p className="mt-2 text-xs text-dim">+ stretch: {week.stretch}</p>
        </div>
      )}

      {task.kind === "challenge" && (
        <div className="rounded-2xl border border-violet/40 bg-violet/5 p-4">
          <span className="font-mono text-xs uppercase text-violet">Katas</span>
          <p className="mt-1 text-base font-medium">{week.katas}</p>
        </div>
      )}

      {task.resource && (
        <a
          href={task.resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-background"
        >
          Open {task.resource.label}
        </a>
      )}

      {task.code && (
        <pre className="overflow-x-auto rounded-lg border border-line bg-background p-4 font-mono text-xs">
          {task.code}
        </pre>
      )}
      {task.solution && <RevealSolution solution={task.solution} />}

      {pushTarget && <p className="font-mono text-xs text-dim">push → {pushTarget}</p>}

      {task.kind !== "rest" &&
        (locked ? (
          <p className="font-mono text-xs text-dim">Complete earlier weeks first.</p>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className={`w-fit rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              done ? "border-green text-green" : "border-line-2 text-foreground"
            }`}
          >
            {done ? "✓ Done" : "Mark done"}
          </button>
        ))}

      <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-xs">
        {prev ? (
          <Link href={`/week/${prev.week}/day/${prev.day}`} className="text-cyan">
            ← Day {prev.day}
            {prev.week !== week.number ? ` (Week ${prev.week})` : ""}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/week/${week.number}`} className="text-muted">
          Back to week
        </Link>
        {next ? (
          <Link href={`/week/${next.week}/day/${next.day}`} className="text-cyan">
            Day {next.day}
            {next.week !== week.number ? ` (Week ${next.week})` : ""} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
