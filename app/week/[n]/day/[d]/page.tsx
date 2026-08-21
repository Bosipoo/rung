import { notFound } from "next/navigation";
import { getTasks, getWeek } from "@/lib/queries";
import { DayView } from "@/components/DayView";

export default async function DayPage({ params }: PageProps<"/week/[n]/day/[d]">) {
  const { n, d } = await params;
  const weekNumber = Number(n);
  const dayNumber = Number(d);
  const week = Number.isInteger(weekNumber) ? getWeek(weekNumber) : undefined;
  const task = week ? getTasks(week.number).find((t) => t.day === dayNumber) : undefined;

  if (!week || !task) notFound();

  return <DayView week={week} task={task} />;
}
