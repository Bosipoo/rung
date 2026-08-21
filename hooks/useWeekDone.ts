"use client";

import { useCallback, useSyncExternalStore } from "react";
import { weekTasks, type Week } from "@/content/curriculum";
import { isTaskComplete, subscribe } from "@/lib/storage";

function getServerSnapshot(): boolean {
  return false;
}

export function useWeekDone(week: Week): boolean {
  const getSnapshot = useCallback(
    () =>
      weekTasks(week)
        .filter((task) => task.kind !== "rest")
        .every((task) => isTaskComplete(week.number, task.day)),
    [week],
  );
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
