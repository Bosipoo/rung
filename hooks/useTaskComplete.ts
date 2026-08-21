"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isTaskComplete, setTaskComplete, subscribe } from "@/lib/storage";

function getServerSnapshot(): boolean {
  return false;
}

export function useTaskComplete(week: number, day: number): [boolean, () => void] {
  const getSnapshot = useCallback(() => isTaskComplete(week, day), [week, day]);
  const done = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => setTaskComplete(week, day, !done), [week, day, done]);
  return [done, toggle];
}
