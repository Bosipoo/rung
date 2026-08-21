"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Task } from "@/content/curriculum";
import { isDayDone } from "@/lib/units";
import { isUnitComplete, subscribe } from "@/lib/storage";

function getServerSnapshot(): boolean {
  return false;
}

export function useDayDone(week: number, task: Task): boolean {
  const getSnapshot = useCallback(() => isDayDone(week, task, isUnitComplete), [week, task]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
