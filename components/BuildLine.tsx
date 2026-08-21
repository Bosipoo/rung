import type { Week } from "@/content/curriculum";
import { weekdayName } from "@/lib/dates";

export function BuildLine({ week }: { week: Week }) {
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-3 rounded-xl border border-dashed border-line-2 p-3.5">
      <span className="font-mono text-xs uppercase text-coral">{weekdayName(5)}&apos;s build</span>
      <b className="font-heading text-base font-semibold">{week.project}</b>
      <span className="text-sm text-muted">{week.description}</span>
      <span className="text-xs text-dim">+ stretch: {week.stretch}</span>
    </div>
  );
}
