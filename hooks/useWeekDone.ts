"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Week } from "@/content/curriculum";
import { isWeekDone } from "@/lib/units";
import { isUnitComplete, subscribe } from "@/lib/storage";

function getServerSnapshot(): boolean {
  return false;
}

export function useWeekDone(week: Week): boolean {
  const getSnapshot = useCallback(() => isWeekDone(week, isUnitComplete), [week]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
