import { notFound } from "next/navigation";
import { getWeek } from "@/lib/queries";
import { STAGE_LABEL } from "@/lib/stages";
import { Checklist } from "@/components/Checklist";

export default async function WeekPage({ params }: PageProps<"/week/[n]">) {
  const { n } = await params;
  const weekNumber = Number(n);
  const week = Number.isInteger(weekNumber) ? getWeek(weekNumber) : undefined;

  if (!week) notFound();

  const folder = `week-${String(week.number).padStart(2, "0")}/`;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-5">
      <div className="rounded-2xl border border-line-2 bg-panel p-6">
        <span className="font-mono text-xs uppercase text-dim">
          Week {week.number} · {STAGE_LABEL[week.stage]}
        </span>
        <h1 className="mt-1 font-heading text-2xl font-bold">{week.topic}</h1>
        <p className="mt-1 text-muted">{week.concepts}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span>
            <b className="font-heading">Build:</b> {week.project}
          </span>
          <span className="text-muted">
            <b className="font-heading">Stretch:</b> {week.stretch}
          </span>
          <span className="font-mono text-xs text-dim">{folder}</span>
        </div>
      </div>
      <Checklist weekNumber={week.number} />
    </main>
  );
}
