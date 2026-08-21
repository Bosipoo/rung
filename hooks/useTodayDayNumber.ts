"use client";

import { useSyncExternalStore } from "react";
import { dayNumber } from "@/lib/dates";

// "Today" can differ between the server's clock/timezone and the browser's,
// so it's read the same way as any other value that may change after
// hydration: fixed on the server, reconciled once the client mounts.
function subscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): number {
  return 1;
}

export function useTodayDayNumber(): number {
  return useSyncExternalStore(subscribe, dayNumber, getServerSnapshot);
}
