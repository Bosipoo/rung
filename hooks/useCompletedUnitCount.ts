"use client";

import { useSyncExternalStore } from "react";
import { curriculum, weekTasks } from "@/content/curriculum";
import { taskUnitRefs, unitKey } from "@/lib/units";
import { isUnitComplete, subscribe } from "@/lib/storage";

function countCompleted(): number {
  let count = 0;
  for (const week of curriculum.weeks) {
    for (const task of weekTasks(week)) {
      if (task.kind === "rest") continue;
      for (const ref of taskUnitRefs(week.number, task)) {
        if (isUnitComplete(unitKey(ref))) count++;
      }
    }
  }
  return count;
}

function getServerSnapshot(): number {
  return 0;
}

export function useCompletedUnitCount(): number {
  return useSyncExternalStore(subscribe, countCompleted, getServerSnapshot);
}
