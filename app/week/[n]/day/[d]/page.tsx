import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTasks, getWeek } from "@/lib/queries";
import { DayView } from "@/components/DayView";

export async function generateMetadata({ params }: PageProps<"/week/[n]/day/[d]">): Promise<Metadata> {
  const { n, d } = await params;
  const week = getWeek(Number(n));
  const task = week ? getTasks(week.number).find((t) => t.day === Number(d)) : undefined;
  if (!week || !task) return { title: "Not found | rung" };
  return { title: `${task.title} — Week ${week.number} Day ${task.day} | rung`, description: task.concept };
}

export default async function DayPage({ params }: PageProps<"/week/[n]/day/[d]">) {
  const { n, d } = await params;
  const weekNumber = Number(n);
  const dayNumber = Number(d);
  const week = Number.isInteger(weekNumber) ? getWeek(weekNumber) : undefined;
  const task = week ? getTasks(week.number).find((t) => t.day === dayNumber) : undefined;

  if (!week || !task) notFound();

  return <DayView week={week} task={task} />;
}
