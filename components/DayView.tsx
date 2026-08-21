"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Task, Week } from "@/content/curriculum";
import { getWeek, getWeeks } from "@/lib/queries";
import { isWeekLocked } from "@/lib/stages";
import { nextDay, previousDay } from "@/lib/dayNav";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useUnit } from "@/hooks/useUnit";
import type { UnitKind } from "@/lib/units";
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

  const totalWeeks = getWeeks().length;
  const prev = previousDay({ week: week.number, day: task.day });
  const next = nextDay({ week: week.number, day: task.day }, totalWeeks);

  const showFuturecoderNote = (task.lesson ?? []).some((resource) => resource.url.includes("futurecoder.io"));

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8 sm:px-5">
      <div>
        <p className="font-mono text-xs uppercase text-dim">
          Day {task.day} · {weekdayName(task.day)} · {KIND_LABEL[task.kind]}
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold">{task.title}</h1>
      </div>

      <p className="text-muted">{task.concept}</p>

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

      {task.lesson && task.lesson.length > 0 && (
        <div>
          <h2 className="font-mono text-xs uppercase text-cyan">Lesson</h2>
          {showFuturecoderNote && (
            <p className="mt-1 text-xs text-dim">
              If Futurecoder opens somewhere else, open the ☰ menu and pick the page named here.
            </p>
          )}
          <ul className="mt-2 flex flex-col gap-1.5">
            {task.lesson.map((resource, index) => (
              <UnitRow key={index} week={week.number} task={task} kind="lesson" index={index} locked={locked}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan underline"
                >
                  {resource.label}
                </a>
              </UnitRow>
            ))}
          </ul>
        </div>
      )}

      {task.exercises && task.exercises.length > 0 && (
        <div>
          <h2 className="font-mono text-xs uppercase text-cyan">Exercises</h2>
          <ul className="mt-2 flex flex-col gap-1.5">
            {task.exercises.map((text, index) => (
              <UnitRow key={index} week={week.number} task={task} kind="ex" index={index} locked={locked}>
                {text}
              </UnitRow>
            ))}
          </ul>
        </div>
      )}

      {task.prove && (
        <div className="rounded-r-xl border-l-2 border-cyan bg-cyan/5 px-4 py-3">
          <span className="font-mono text-xs uppercase text-cyan">Prove it</span>
          <ul className="mt-1">
            <UnitRow week={week.number} task={task} kind="prove" index={0} locked={locked}>
              {task.prove}
            </UnitRow>
          </ul>
        </div>
      )}

      {task.push && <p className="font-mono text-xs text-dim">push → {task.push}</p>}

      {task.code && (
        <pre className="overflow-x-auto rounded-lg border border-line bg-background p-4 font-mono text-xs">
          {task.code}
        </pre>
      )}
      {task.solution && <RevealSolution solution={task.solution} />}

      {task.kind !== "rest" && locked && (
        <p className="font-mono text-xs text-dim">Complete earlier weeks first.</p>
      )}

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

function UnitRow({
  week,
  task,
  kind,
  index,
  locked,
  children,
}: {
  week: number;
  task: Task;
  kind: UnitKind;
  index: number;
  locked: boolean;
  children: ReactNode;
}) {
  const [done, toggle] = useUnit({ week, day: task.day, kind, index });

  return (
    <li className="flex items-start gap-2 text-sm">
      {!locked && (
        <input
          type="checkbox"
          checked={done}
          onChange={toggle}
          data-testid={`unit-${week}-${task.day}-${kind}-${index}`}
          className="mt-1 accent-cyan"
        />
      )}
      <span className={done && !locked ? "text-muted line-through" : ""}>{children}</span>
    </li>
  );
}
