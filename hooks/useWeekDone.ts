"use client";

import { useCallback, useSyncExternalStore } from "react";
import { weekTasks, type Week } from "@/content/curriculum";
import { isDayDone } from "@/lib/units";
import { isUnitComplete, subscribe } from "@/lib/storage";

function getServerSnapshot(): boolean {
  return false;
}

export function useWeekDone(week: Week): boolean {
  const getSnapshot = useCallback(
    () =>
      weekTasks(week)
        .filter((task) => task.kind !== "rest")
        .every((task) => isDayDone(week.number, task, isUnitComplete)),
    [week],
  );
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
