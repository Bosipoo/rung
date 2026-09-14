"use client";

import { useSyncExternalStore } from "react";
import { curriculum } from "@/content/curriculum";
import { firstIncompleteWeek } from "@/lib/currentWeek";
import { getCurrentWeek, isUnitComplete, subscribe } from "@/lib/storage";

// currentWeek = max(firstIncompleteWeek, storedOverride ?? 1), clamped to the
// curriculum's range — the frontier week, unless the learner has jumped ahead.
function getSnapshot(): number {
  const derived = firstIncompleteWeek(curriculum.weeks, isUnitComplete);
  const override = getCurrentWeek() ?? 1;
  return Math.min(Math.max(derived, override), curriculum.weeks.length);
}

function getServerSnapshot(): number {
  return 1;
}

export function useCurrentWeek(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
