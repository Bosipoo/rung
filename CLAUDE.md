@AGENTS.md
# rung — project context

## What this is
A daily coding-journey web app for a teenager learning to code. It is a
scaffold *around* external courses (Futurecoder, freeCodeCamp), not a course
itself. Its job: show what to do each day, link out to the real lesson, let
him tick tasks off, track progress, and hold a bug journal.

## Stack
Next.js (App Router, TypeScript) · Tailwind · Vercel.
Supabase (Postgres + Auth + RLS) is added LATER — not in the first version.

## Hard rules (do not break)
- Short, clean code. Keep the codebase as concise as possible.
- Small, single-purpose files and components. One job each.
- Server Components by default; client components only where interaction needs them.
- No UI libraries — the design is hand-rolled. No unnecessary dependencies.
- Pure, testable functions for anything with logic (progress, streaks, dates).
- Delete dead code. Never leave commented-out code behind.
- No premature abstraction. Build what's needed now.

## Architecture rule that must not be violated
Curriculum content (shared) is SEPARATE from progress (per user).
- Curriculum lives in /content/curriculum.ts as typed data.
- Progress/journal go through /lib/storage.ts — a thin wrapper.
  Phase 1 backs it with localStorage. Phase 2 swaps that wrapper for Supabase.
  Nothing outside storage.ts should know where data is stored.

## Design tokens
Dark indigo base, off-white text. Cyan for progress/interactive.
Amber reserved ONLY for the current week ("you are here"). Coral/green as sparing
accents. Respect prefers-reduced-motion. Mobile-first, installable-app feel.

## Non-negotiable UI fixes
- The "you are here" marker renders on the CURRENT week only, never by default.
- Futurecoder is the only Python resource. No py4e.
- No Raspberry Pi price shown anywhere.

## Testing
Every feature ships a test. Pure logic → unit test (Vitest). Flows → Playwright.
Always include a one-line manual check to run before merging.