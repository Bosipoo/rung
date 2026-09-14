import { TodayHero } from "@/components/TodayHero";
import { WeekStrip } from "@/components/WeekStrip";
import { RoadmapTiles } from "@/components/RoadmapTiles";
import { getWeeks } from "@/lib/queries";

export default function Home() {
  const totalWeeks = getWeeks().length;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-5">
      <TodayHero />
      <WeekStrip />
      <section>
        <h2 className="font-heading text-lg font-semibold">The road</h2>
        <p className="mt-1 text-sm text-muted">
          {totalWeeks} weeks, grouped by stage. Tap a tile to open its week.
        </p>
        <div className="mt-3">
          <RoadmapTiles />
        </div>
      </section>
    </main>
  );
}
