"use client";

import { useSyncExternalStore } from "react";
import { getCurrentWeek, subscribe } from "@/lib/storage";

function getServerSnapshot(): number | null {
  return null;
}

export function useCurrentWeek(): number | null {
  return useSyncExternalStore(subscribe, getCurrentWeek, getServerSnapshot);
}
