"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isUnitComplete, setUnitComplete, subscribe } from "@/lib/storage";
import { unitKey, type UnitRef } from "@/lib/units";

function getServerSnapshot(): boolean {
  return false;
}

export function useUnit(ref: UnitRef): [boolean, () => void] {
  const key = unitKey(ref);
  const getSnapshot = useCallback(() => isUnitComplete(key), [key]);
  const done = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => setUnitComplete(key, !done), [key, done]);
  return [done, toggle];
}
