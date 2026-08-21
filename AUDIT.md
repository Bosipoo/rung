# rung — Phase 1 gap report

Audited 2026-08-21. Read-only investigation: no source files were changed. Commands were
run (build/test/lint/dev server) as instructed; their artifacts (`.next/`, `test-results/`)
were cleaned up afterward. This file is the only file created by the audit.

---

## 1. What actually exists

### Routes (`app/`)

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home: Today hero, this-week strip, 36-week roadmap. Server component. |
| `/week/[n]` | `app/week/[n]/page.tsx` | Week overview: hero + 7-day derived-status list. Server component. |
| `/week/[n]/day/[d]` | `app/week/[n]/day/[d]/page.tsx` | Single day: full lesson/exercise/prove-it checklist. Server component. |
| (root layout) | `app/layout.tsx` | Fonts, sticky header with brand + `HeaderStats`. |

No `not-found.tsx` or `error.tsx` — invalid routes fall through to Next's default,
unstyled 404 (confirmed live: `/week/99` → 404, generic page, doesn't match the
dark-indigo theme).

### Components (`components/`)

| File | Purpose |
|---|---|
| `TodayHero.tsx` | Client. Today's task, full detail, links to its day page. |
| `WeekStrip.tsx` | Client. 7-day strip for the current week + `BuildLine`. |
| `BuildLine.tsx` | Server-safe (no `"use client"`, no hooks). "Friday's build" summary line. |
| `RoadmapTiles.tsx` | Client. 36 tiles grouped by stage, done/current/locked states. |
| `Checklist.tsx` | Client. Week-page day list — derived done badge, no checkboxes (interaction moved to day page). |
| `DayView.tsx` | Client. The day page body: Lesson/Exercises/Prove-it tickable lists, code+reveal, push target. |
| `RevealSolution.tsx` | Client. Collapsed-by-default solution reveal button. |
| `HeaderStats.tsx` | Client. Header's week-N/total + progress bar + unit count. |

Every component file is imported exactly once (by its direct parent) — no orphaned
component files.

### Hooks (`hooks/`)

| File | Purpose | Used by |
|---|---|---|
| `useCurrentWeek.ts` | Reads `currentWeek` from storage via `useSyncExternalStore`. | 6 files |
| `useTodayDayNumber.ts` | Today's weekday (1–7), server/client-safe. | 3 files |
| `useUnit.ts` | `[done, toggle]` for one tickable unit. | `DayView` only |
| `useDayDone.ts` | Derived "is this day fully ticked". | `WeekStrip`, `Checklist`, `TodayHero` |
| `useWeekDone.ts` | Derived "is this week fully ticked" (all non-rest days done). | `RoadmapTiles` only |
| `useCompletedUnitCount.ts` | Total ticked units across the whole curriculum. | `HeaderStats` only |

All six are consumed. No orphaned hooks.

### `lib/`

| File | Purpose |
|---|---|
| `storage.ts` | **The only module touching `localStorage`.** `currentWeek`, per-unit completion (generic string-keyed), journal CRUD, pub/sub for `useSyncExternalStore`. |
| `queries.ts` | Read-only curriculum access: `getWeeks`, `getWeek`, `getTasks`, `getTotalUnitCount`. |
| `units.ts` | Pure: `taskUnitRefs`, `unitKey`, `isDayDone` (injectable predicate). |
| `stages.ts` | `STAGE_ORDER`, `STAGE_LABEL`, `isWeekLocked`. |
| `dates.ts` | Pure: `dayNumber`, `weekdayName`, `weekdayShort`. |
| `dayNav.ts` | Pure: `nextDay`/`previousDay`, crosses week boundaries. |

All six are imported somewhere; none are orphaned.

### `content/`

| File | Purpose |
|---|---|
| `curriculum.ts` | The 36-week typed curriculum + `weekTasks()` + `taskUnits()`. |
| `katas.ts` | Hand-picked Codewars katas per Python week (1–11) + `kataSearch()` fallback + `kataFor()`. |

### Flagged: unreferenced / dead, and referenced-but-missing

- **`content/katas.ts`: `kataFor()` is dead code.** Defined, exported, never imported
  anywhere (not even from `curriculum.ts`, which reimplements the same fallback logic
  inline in `weekTasks()` using `KATAS`/`kataSearch` directly). Violates the CLAUDE.md
  rule "Delete dead code."
- **`lib/storage.ts`: the journal API is unused by the app.** `JournalEntry`,
  `getJournalEntries`, `addJournalEntry`, `deleteJournalEntry` are exported and covered
  by `lib/storage.test.ts`, but no component or route in `app/`/`components/` imports
  any of them — there is no journal UI at all. Not literally dead (tested, and matches
  the documented Phase 2 page map), but currently unreachable from the product. Flagging
  per your request to list "anything unreferenced"; I'd class this as **expected
  Phase-2 scaffolding**, not a bug, given the earlier `/journal — Phase 2` page map.
- **`lib/storage.ts`: `setCurrentWeek()` is never called from app code.** It's exported,
  round-trip tested in isolation, but grep shows zero call sites in `app/` or
  `components/`. This means **the "current week" can never advance through the UI** —
  every page permanently reads `null` → falls back to `1` via `?? 1`. This is a
  functional gap, not dead code (the read side is used everywhere); see §6.
- **Referenced-but-missing: none found.** Every `import` I traced resolves to a real,
  exported symbol — no broken imports, no phantom modules.

---

## 2. Health

### `npm run build`
```
▲ Next.js 16.3.0 (Turbopack)
✓ Compiled successfully in 1927ms
✓ Running TypeScript ...  Finished TypeScript in 1123ms
✓ Generating static pages (4/4)

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /week/[n]
└ ƒ /week/[n]/day/[d]
```
**PASS.** Exit code 0.

### `npm test` (Vitest)
```
 Test Files  6 passed (6)
      Tests  113 passed (113)
   Duration  1.19s
```
**PASS.** Exit code 0.

### `npm run e2e`
**This script does not exist.**
```
npm error Missing script: "e2e"
npm error
npm error To see a list of scripts, run:
npm error   npm run
```
The actual script is `test:e2e` (`playwright test`). Running that instead:
```
Running 12 tests using 5 workers
  ✓ current-week-marker.spec.ts (1)
  ✓ day-done.spec.ts (1)
  ✓ day-page.spec.ts (3)
  ✓ locked-weeks.spec.ts (2)
  ✓ progress-count.spec.ts (1)
  ✓ task-persistence.spec.ts (1)
  ✓ week-routes.spec.ts (3)
  12 passed (4.8s)
```
**PASS** once the correct script name is used. Worth fixing the naming mismatch — see
prioritised list.

### `npx eslint .`
No output, exit code 0. **PASS.**

### `npx tsc --noEmit`
No output, exit code 0. **PASS.**

### Route-by-route check (dev server, `npm run dev`)

Checked HTTP status via `curl`, then re-checked every route in a real Chromium page
(Playwright) collecting `console.error`/`console.warn`/`pageerror` events to catch
hydration mismatches that a bare `curl` can't see.

| Route | HTTP | Console/hydration errors |
|---|---|---|
| `/` | 200 | none |
| `/week/1` | 200 | none |
| `/week/13` | 200 | none |
| `/week/26` | 200 | none |
| `/week/1/day/1` | 200 | none |
| `/week/1/day/6` | 200 | none |
| `/week/1/day/7` | 200 | none |
| `/week/99` (invalid) | 404 | one expected `Failed to load resource: 404` (the page itself, not a bug) |

Dev server log for the same requests showed no server-side exceptions. **No hydration
bugs found on any of these seven routes** — the `useSyncExternalStore` pattern used
throughout (`useCurrentWeek`, `useTodayDayNumber`, `useUnit`, `useDayDone`,
`useWeekDone`, `useCompletedUnitCount`) is doing its job.

**One real bug found via manual check, not by the above:** loading `/` at a 375px
viewport produces **10px of horizontal page overflow**. Traced to
`components/RoadmapTiles.tsx`'s hover-tooltip `<span>` (`whitespace-nowrap`,
absolutely positioned, `left-1/2 -translate-x-1/2`) — `opacity-0` hides it visually
but doesn't remove it from layout, so tiles near the left/right edge push a tooltip
partly off-screen and widen the document's scrollable area. `/week/1` and
`/week/1/day/6` had zero overflow at the same width. See §6 and the fix list.

---

## 3. Curriculum shape vs. code

**Version in the repo:** the file's own header comment says `(v3)`. **36 weeks**
(`grep -c "number: [0-9]*, stage:"` → 36), stages: `python` (1–11), `html` (12–14),
`css` (15–22), `javascript` (23–36).

**`Task` fields** (`content/curriculum.ts:30-41`):
```ts
export interface Task {
  day: number;
  kind: TaskKind;
  title: string;
  concept: string;
  lesson?: Resource[];
  exercises?: string[];
  prove?: string;
  push?: string;
  code?: string;
  solution?: string;
}
```
No `instruction` field, no single `resource` field — both were removed in the redesign
that introduced this shape (confirmed nothing in the app still expects them; see below).

**`weekTasks(week)`** — exists (`content/curriculum.ts:1801`), derives day 6
(challenge, katas + debug drill) and day 7 (rest) from the week's `days`, `katas`, and
`drill` fields, returns all 7. **`taskUnits(task)`** — exists (`content/curriculum.ts:1820`),
counts `lesson.length + exercises.length + (prove ? 1 : 0)`, 0 for rest, with a `|| 1`
fallback for a task with none of the three (dead in practice — every real task has at
least `exercises` or `prove`; a Vitest test (`content/curriculum.test.ts`) already
asserts `taskUnits()` agrees with `taskUnitRefs().length` for every week, which would
catch this the moment it ever becomes live).

### Hardcoded numbers / shape assumptions

- **`app/page.tsx:12` hardcodes "26 weeks"** in the roadmap section's copy —
  `<p>26 weeks, grouped by stage. Tap a tile to open its week.</p>` — but the data has
  36. This is stale text left over from the pre-v3 curriculum (26-week version). It's
  the only place in `app/`/`components/`/`hooks/`/`lib/` with a hardcoded week count;
  everywhere else (`HeaderStats`, `DayView`'s `nextDay`/`previousDay` boundary,
  `RoadmapTiles`) correctly derives the total from `getWeeks().length`.
- No other file assumes a fixed day range, week count, or Task shape that the data
  doesn't provide. `taskUnitRefs()`, `isDayDone()`, and every hook that walks
  `task.lesson`/`task.exercises`/`task.prove` use optional-chaining/`?? []`
  consistently — nothing dereferences these fields assuming they're always present.

---

## 4. Test coverage gaps

### What's tested

- **Curriculum data integrity, exhaustively** (`content/curriculum.test.ts`,
  `it.each(curriculum.weeks)` — all 36, not a sample): every week has 7 tasks in order
  1–7, day 6 has `code`+`solution`, `taskUnits()` agrees with `taskUnitRefs()`, and
  (new) every Python week 1–11 resolves to ≥1 kata resource with an `https` URL.
- **Pure logic** (`lib/*.test.ts`): `dayNumber`/`weekdayName`/`weekdayShort`,
  `nextDay`/`previousDay` week-boundary crossing, `isWeekLocked`, `taskUnitRefs`/
  `unitKey`/`isDayDone`, and `lib/storage.ts`'s full API including a resilience test
  (storage throws → nothing else throws).
- **Progress persists across reload** (`e2e/task-persistence.spec.ts`): tick a unit
  on a day page, reload, still checked. ✅ covered.
- **Exactly one current-week marker** (`e2e/current-week-marker.spec.ts`): asserts
  `getByTestId("current-week-marker")` has count 1 on the home page. ✅ covered.
- Locked-but-navigable roadmap tiles, locked day shows note + no checkboxes, header
  count increments on a lesson tick, day-strip reflects derived day-done, challenge-day
  reveal-solution, cross-week day navigation both directions.

### What isn't tested — and would let a regression ship

1. **Resource-link well-formedness for anything except the Python katas.** The new
   test checks `https://` for `KATAS`/`kataSearch()` links only. The other ~95% of
   resources — every `lesson: [...]` array on every authored day across all 36 weeks
   (built via `fc()`, `rwd()`, `fjs()`, `py()`, `pylib()`, plus the standalone
   constants `GITHUB`, `GH_PAGES`, `CLASH`, `VALIDATOR`) — has **no test** asserting
   the URLs are well-formed or `https`. I checked by hand (regex over the file) and
   found nothing currently broken — every helper's base URL is a hardcoded `https://`
   literal, so today's data is safe by construction — but there's no regression guard.
   A typo'd template literal or a new inline `r(...)` call with a bad scheme would
   ship silently. This is the single cheapest, highest-value test to add (a
   `content/curriculum.test.ts` case that walks every week's `weekTasks()` and asserts
   every `resource.url` starts with `https://` and parses as a URL).
2. **Every week PAGE actually renders over HTTP.** `e2e/week-routes.spec.ts` samples
   3 of 36 weeks (1, 14, 36). The underlying *data* is fully checked for all 36 (see
   above), but the *route* — `notFound()` logic, `Checklist` render, `STAGE_LABEL`
   lookup — is only exercised for those 3. A week whose `stage` value somehow fell
   outside `STAGE_LABEL`'s keys, for instance, wouldn't be caught except by luck of
   sampling. Cheap fix: either widen the Playwright sample or add a fast Vitest-level
   smoke test that doesn't need a browser (e.g., call the page's helper functions
   directly, or at minimum assert `getWeek(n)` and `getTasks(n)` succeed for all
   `n` in `1..getWeeks().length`).
3. **The home-page mobile overflow bug (§2) has no test at all.** No Playwright
   project runs at a mobile viewport (`playwright.config.ts` defines exactly one
   project, `chromium` / Desktop Chrome). This is why it went unnoticed.
4. **`setCurrentWeek()` is untested from the product's perspective** — trivially,
   since nothing calls it. Once a "advance my week" affordance exists, it'll need a
   test that the home page, roadmap, and locked/unlocked states all react.
5. **No accessibility assertions anywhere** — no test checks that a checkbox has an
   accessible name, that focus order is sane, or that interactive elements are
   reachable by keyboard only.
6. **Journal**: untestable because unbuilt (expected — Phase 2).

---

## 5. Storage boundary

**No violations found.** `grep -rn "localStorage"` across the whole repo (excluding
`node_modules`) returns hits only in `lib/storage.ts` itself, `lib/storage.test.ts`
(mocking `Storage.prototype`, appropriately), and `content/curriculum.ts` — and every
one of those `curriculum.ts` hits is inside **lesson prose** (Week 28's/31's/32's
concept/exercise text teaching the learner about `localStorage`, and the Week 31/35
debug-drill `code`/`solution` strings) — not executable app code. Nothing in `app/`,
`components/`, or `hooks/` touches `window.localStorage`/`sessionStorage` directly;
every read/write goes through `lib/storage.ts`'s `read`/`write`/`isUnitComplete`/
`setUnitComplete`/`getCurrentWeek`/`setCurrentWeek`/journal functions, and every
consumer reaches those either directly or via the `hooks/use*.ts` wrappers. The
Supabase swap described in CLAUDE.md would only require touching `lib/storage.ts`.

---

## 6. Phase 1 intent checklist

| Feature | Status | File(s) |
|---|---|---|
| Day view's lesson/exercise/prove-it sub-checklists | **Present** | `components/DayView.tsx` — separate Lesson/Exercises/Prove-it sections, each item independently tickable via `useUnit`. |
| Derived day completion (not a stored flag) | **Present** | `lib/units.ts:isDayDone` — pure, takes an injected predicate, unit-tested directly; `hooks/useDayDone.ts` wraps it for components. |
| Granular progress counting (units, not tasks) | **Present** | `content/curriculum.ts:taskUnits`, `lib/queries.ts:getTotalUnitCount`, `hooks/useCompletedUnitCount.ts`; surfaced in `components/HeaderStats.tsx`. |
| "You are here" marker only on the current week | **Present** | `components/RoadmapTiles.tsx` sets `data-testid="current-week-marker"` and the amber styling only when `isCurrent`; `e2e/current-week-marker.spec.ts` asserts exactly one. |
| Locked-but-readable future weeks | **Present** | `lib/stages.ts:isWeekLocked` + `components/RoadmapTiles.tsx` (tiles are always real `<Link>`s) + `components/Checklist.tsx`/`components/DayView.tsx` (hide the tick controls, not the content, when locked). Tested in `e2e/locked-weeks.spec.ts`. |
| Mobile layout at 375px | **Partial** | Responsive classes exist (`grid-cols-4 sm:grid-cols-7` in `WeekStrip.tsx`, `max-w-2xl`/`max-w-3xl` containers, `flex-wrap` throughout) and `/week/1` + `/week/1/day/6` render with zero horizontal overflow at 375px. But **`/` (home) overflows by 10px** — see §2/§7, root cause in `components/RoadmapTiles.tsx`'s hover-tooltip span. Also: checkbox touch targets in `DayView.tsx`/`Checklist.tsx` are unlabelled and small (see §7). |
| Focus states | **Absent** | No `focus-visible:`/`focus:` Tailwind classes anywhere in `app/`/`components/`; relies entirely on browser UA-default focus rings against a custom dark theme. Not verified to be illegible, just not deliberately handled. |
| `prefers-reduced-motion` support | **Absent** | Zero `@media (prefers-reduced-motion)` anywhere in `app/globals.css` or component classes, despite CLAUDE.md's design tokens section explicitly requiring it. Practical impact is currently small — the only transition in the app is `RoadmapTiles.tsx`'s tooltip `transition-opacity` — but the rule as written is unmet. |

---

## 7. Other findings

- **CLAUDE.md contradiction: reduced-motion rule unmet.** See §6. Small blast radius
  today (one hover transition) but worth a one-line global CSS rule before more
  animation gets added, so it's not forgotten later.
- **`app/page.tsx`'s "26 weeks" copy is simply wrong** against the shipped 36-week
  curriculum — a user-visible factual error, not just an internal inconsistency (§3).
- **Dead code: `content/katas.ts:kataFor()`** — never called (§1). Violates CLAUDE.md's
  "delete dead code" rule directly.
- **`setCurrentWeek()` has no caller** — the app can never advance past week 1 through
  its own UI (§1). This may be intentional for the current milestone (nothing in the
  Phase 1 description you gave mentions a "mark week complete and advance" flow), but
  it means the locked/unlocked roadmap machinery, the day-page "Complete earlier weeks
  first" note, and the whole current-week concept are currently **unreachable in
  practice** beyond week 1 unless someone hand-edits `localStorage`. Worth confirming
  whether this is in scope for the next milestone or deliberately deferred.
- **Accessibility: unlabelled checkboxes.** Every tickable checkbox in
  `components/DayView.tsx` (`UnitRow`) and none in `components/Checklist.tsx` use a
  bare `<input type="checkbox">` next to a `<span>`, with no `<label>` wrapping or
  `htmlFor`/`id` pairing. Practically: clicking the visible text does nothing (only
  the ~16px checkbox itself is clickable), and screen readers aren't guaranteed an
  accessible name for the control. Same shape issue in `RevealSolution.tsx`'s button
  (fine, it's a real `<button>` with visible text) — the checkboxes are the actual gap.
- **`npm run e2e` doesn't exist** — the script is `test:e2e` (§2). Minor, but exactly
  the kind of thing that looks broken in CI logs or onboarding docs if referenced by
  the wrong name anywhere outside this repo.
- **No custom `not-found.tsx`.** Invalid routes (confirmed: `/week/99`, `/week/1/day/8`
  in earlier work) correctly 404, but land on Next's generic unstyled error page —
  breaks the "installable-app feel" CLAUDE.md asks for. Low priority, easy fix.
- **Nothing in this milestone's work is committed.** `git log` shows only the original
  three scaffold commits; `git status` shows ~59 entries, a mix of staged adds/
  modifies and a few stale `AD` (added-then-deleted-in-worktree) entries left over from
  files that were renamed/replaced across sessions (e.g. `hooks/useTaskComplete.ts` →
  `hooks/useUnit.ts`, `lib/instruction.ts`/`lib/pushTarget.ts` deleted). Not a code bug,
  but worth knowing before treating `git log` as a record of what's shipped — it isn't,
  yet. I did not touch the index or working tree during this audit.
- **README.md is generic boilerplate** ("Simple web application to guide coding
  newbies...") and doesn't mention the architecture CLAUDE.md describes. Cosmetic.
- **`design/redesign-mockup.html`** is static reference HTML (not imported by any code
  path) — its structure has already been implemented in `components/`. Harmless to
  keep as a historical reference; flagging only so it's not mistaken for live code.
- **No violation found** of "Server Components by default; client components only
  where interaction needs them" — `app/page.tsx`, `app/week/[n]/page.tsx`,
  `app/week/[n]/day/[d]/page.tsx`, and `components/BuildLine.tsx` are all plain
  Server Components; every `"use client"` file (`TodayHero`, `WeekStrip`,
  `RoadmapTiles`, `Checklist`, `DayView`, `RevealSolution`, `HeaderStats`) needs a
  hook or interactive state to do its job.
- **No unnecessary dependencies found** — `package.json` runtime deps are just
  `next`/`react`/`react-dom`; dev deps are Tailwind, Vitest, Playwright, ESLint,
  TypeScript, and `jsdom` for the test environment. Nothing extraneous.

---

## Prioritised fix list

Ordered by whether it blocks shipping Phase 1, most urgent first.

### 1. Home page overflows horizontally at mobile widths
**Problem:** `/` has 10px of horizontal scroll at 375px, caused by an invisible
off-screen tooltip element. **Files:** `components/RoadmapTiles.tsx`. **Size:** tiny
(a few lines — likely `overflow-hidden` on the tile or repositioning the tooltip so it
clamps to the viewport, e.g. swap `left-1/2 -translate-x-1/2` for edge-aware
positioning, or just add `overflow-x-clip` on the roadmap's outer wrapper).
**Prompt:** *"`components/RoadmapTiles.tsx`'s hover tooltip causes 10px of horizontal
page overflow at 375px width because the `opacity-0` tooltip span is still in layout
and gets clipped off-screen near the container edges. Fix it so the home page has zero
horizontal overflow at 375px — verify with a Playwright check of
`document.documentElement.scrollWidth` vs `clientWidth` — without changing the
tooltip's hover behavior on desktop."*

### 2. "26 weeks" text is wrong
**Problem:** `app/page.tsx` hardcodes "26 weeks" but the curriculum has 36.
**Files:** `app/page.tsx`. **Size:** one line. **Prompt:** *"`app/page.tsx`'s roadmap
section hardcodes '26 weeks' in its copy; the curriculum actually has 36. Make it
derive the count from data (`getWeeks().length`, matching the pattern already used in
`components/HeaderStats.tsx`) instead of a literal number, as a Server Component
value."*

### 3. Delete dead code: `kataFor()`
**Problem:** unused exported function, violates CLAUDE.md's dead-code rule.
**Files:** `content/katas.ts`. **Size:** tiny (delete ~3 lines; confirm no other
consumer first). **Prompt:** *"`content/katas.ts` exports `kataFor()`, which nothing
in the codebase calls (`content/curriculum.ts`'s `weekTasks()` reimplements the same
`KATAS[week] ?? [kataSearch()]` logic inline instead of using it). Confirm it's truly
unused, then delete it."*

### 4. No test guards resource-link validity outside the katas
**Problem:** ~95% of `Resource` URLs (every authored `lesson[]` across 36 weeks) have
no automated well-formedness/https check. **Files:** `content/curriculum.test.ts`.
**Size:** small (one new test, loops `weekTasks()` for every week). **Prompt:**
*"Add a Vitest test in `content/curriculum.test.ts` that walks `weekTasks(week)` for
every week in `curriculum.weeks` and asserts every `Resource` in `task.lesson` (and
the challenge day's) has a well-formed `https://` URL — not just the Python katas,
which are already covered."*

### 5. `npm run e2e` doesn't exist
**Problem:** the script name in `package.json` is `test:e2e`, not `e2e`. **Files:**
`package.json`. **Size:** trivial (rename or add an alias). **Prompt:** *"Add an `e2e`
script to `package.json` (alias for the existing `test:e2e`, i.e. `playwright test`)
so `npm run e2e` works, without removing `test:e2e`."*

### 6. No custom 404 page
**Problem:** invalid routes fall through to Next's generic unstyled 404. **Files:** new
`app/not-found.tsx`. **Size:** small. **Prompt:** *"Add `app/not-found.tsx` matching
the app's dark-indigo theme (reuse the existing color tokens from `app/globals.css`),
shown for any route `notFound()` triggers or an unmatched URL. Keep it to a short
message and a link back to `/`."*

### 7. Checkboxes have no accessible label / small touch target
**Problem:** `DayView.tsx`'s `UnitRow` checkboxes aren't wrapped in `<label>` or paired
via `htmlFor`; clicking the visible text does nothing, and the touch target is small.
**Files:** `components/DayView.tsx`. **Size:** small (wrap in `<label>`, no visual
change needed). **Prompt:** *"In `components/DayView.tsx`'s `UnitRow`, wrap the
checkbox and its label text in a `<label>` element (or add matching `htmlFor`/`id`) so
clicking the text toggles the checkbox and screen readers get a proper accessible
name. Keep the existing `data-testid` on the input so `e2e/*` tests keep passing."*

### 8. `prefers-reduced-motion` isn't respected anywhere
**Problem:** CLAUDE.md requires it; nothing in the codebase implements it. **Files:**
`app/globals.css`. **Size:** tiny (one global media-query rule disabling/shortening
transitions). **Prompt:** *"Add a `@media (prefers-reduced-motion: reduce)` rule to
`app/globals.css` that disables or shortens transitions/animations app-wide, per
CLAUDE.md's design-tokens requirement. There's currently only one transition in the
app (`components/RoadmapTiles.tsx`'s tooltip fade) — make sure it's covered, and set
the pattern up so future animations inherit it automatically."*

### 9. No focus-visible styling
**Problem:** interactive elements rely entirely on browser-default focus rings against
a custom dark theme; never deliberately styled. **Files:** likely `app/globals.css`
(a global rule) plus spot-checks in `components/*.tsx` for anything that suppresses
outlines. **Size:** small–medium (needs a visual pass, not just code). **Prompt:**
*"Audit keyboard-focus visibility across the app (tab through `/`, `/week/1`, and
`/week/1/day/1`) and add an explicit `focus-visible` style — consistent with the
existing cyan/amber token palette in `app/globals.css` — anywhere the default browser
outline is missing or low-contrast against the dark background."*

### 10. Only 3 of 36 week routes are exercised by Playwright
**Problem:** route-level rendering (as opposed to data shape, which is fully tested)
is only sampled at weeks 1/14/36. **Files:** `e2e/week-routes.spec.ts` or a new
Vitest-level smoke test. **Size:** small. **Prompt:** *"`e2e/week-routes.spec.ts`
only checks 3 of 36 week routes render. Add a fast, non-browser check (Vitest) that
`getWeek(n)`/`getTasks(n)` from `lib/queries.ts` succeed and return a well-shaped week
for every `n` from 1 to `getWeeks().length`, so a route-breaking data issue in any
week gets caught without needing a full Playwright pass per week."*

### 11. `setCurrentWeek()` is never called — confirm scope, then build the affordance
**Problem:** there's no way to advance the current week through the UI; everything
downstream of "current week" is effectively frozen at week 1 for a real user. **Files:**
likely a new small client component (e.g. a "mark week complete" or "advance" action)
wired to `lib/storage.ts:setCurrentWeek`, surfaced from `components/RoadmapTiles.tsx`
or `components/Checklist.tsx`. **Size:** medium — this is a real feature, not a
one-liner, and needs a product decision first (auto-advance when a week's `useWeekDone`
goes true? a manual "next week" button? something else?). **Prompt:** *"Nothing calls
`setCurrentWeek()` in `lib/storage.ts` anywhere in the app, so a real user can never
progress past week 1. Before writing code: confirm with me what should trigger the
advance (auto-advance when `useWeekDone` becomes true for the current week, vs. an
explicit user action), then implement it."* — **flagging this one for a scoping
conversation, not a blind fix, since it changes product behavior.**

---

Items 1–5 are cheap and low-risk; I'd do those first regardless of what's next.
Item 11 is the one genuine "is this actually in scope yet" question — everything else
on this list is a bounded, mechanical fix.
