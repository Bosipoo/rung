// lib/storage.ts
//
// The only module that knows where progress data lives. Phase 1 backs it
// with localStorage; Phase 2 swaps this file for Supabase without changing
// any caller.

const KEYS = {
  currentWeek: "rung:currentWeek",
  taskCompletion: "rung:taskCompletion",
  journal: "rung:journal",
} as const;

export interface JournalEntry {
  id: string;
  week: number;
  day: number;
  text: string;
  createdAt: string;
}

type TaskCompletionMap = Record<string, boolean>;

const listeners = new Set<() => void>();

// Lets client components stay in sync via useSyncExternalStore instead of
// re-reading storage inside effects.
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (SSR, private browsing, quota) — fail silently
  }
  for (const listener of listeners) listener();
}

// --- current week -----------------------------------------------------------

export function getCurrentWeek(): number | null {
  return read<number | null>(KEYS.currentWeek, null);
}

export function setCurrentWeek(week: number): void {
  write(KEYS.currentWeek, week);
}

// --- unit completion ------------------------------------------------------
// Keys are opaque strings built by lib/units.ts (e.g. "3:2:lesson:0",
// "3:2:ex:1", "3:2:prove") — storage doesn't need to know their shape.

export function isUnitComplete(key: string): boolean {
  const map = read<TaskCompletionMap>(KEYS.taskCompletion, {});
  return map[key] ?? false;
}

export function setUnitComplete(key: string, complete: boolean): void {
  const map = read<TaskCompletionMap>(KEYS.taskCompletion, {});
  map[key] = complete;
  write(KEYS.taskCompletion, map);
}

// --- journal ------------------------------------------------------------------

export function getJournalEntries(): JournalEntry[] {
  return read<JournalEntry[]>(KEYS.journal, []);
}

export function addJournalEntry(entry: {
  week: number;
  day: number;
  text: string;
}): JournalEntry {
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  write(KEYS.journal, [...getJournalEntries(), newEntry]);
  return newEntry;
}

export function deleteJournalEntry(id: string): void {
  write(
    KEYS.journal,
    getJournalEntries().filter((entry) => entry.id !== id),
  );
}
