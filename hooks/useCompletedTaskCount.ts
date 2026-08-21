"use client";

import { useSyncExternalStore } from "react";
import { curriculum, weekTasks } from "@/content/curriculum";
import { isTaskComplete, subscribe } from "@/lib/storage";

// Mirrors getTotalTaskCount()'s rest-day exclusion so completed/total stay comparable.
function countCompleted(): number {
  let count = 0;
  for (const week of curriculum.weeks) {
    for (const task of weekTasks(week)) {
      if (task.kind !== "rest" && isTaskComplete(week.number, task.day)) count++;
    }
  }
  return count;
}

function getServerSnapshot(): number {
  return 0;
}

export function useCompletedTaskCount(): number {
  return useSyncExternalStore(subscribe, countCompleted, getServerSnapshot);
}
