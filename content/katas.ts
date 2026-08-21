// content/katas.ts
//
// Challenge-day kata for the Python stage (weeks 1–11), chosen to match each
// week's concepts. Every id below was taken from the Codewars 8-kyu Python
// search results (captured 2026-08-20) — none are from memory.
//
// The first two entries per week are the picks; anything after is an alternate
// if he's already done one. Weeks with no good 8-kyu match get a filtered
// search link instead of an invented one.

import type { Resource } from "./curriculum";

/** A kata, opened straight into the Python trainer. */
const K = (id: string, name: string): Resource => ({
  label: `Codewars — ${name}`,
  url: `https://www.codewars.com/kata/${id}/train/python`,
});

/** The 8-kyu Python search, optionally narrowed to a tag. */
export const kataSearch = (tag?: string): Resource => ({
  label: tag ? `Codewars — 8 kyu Python, ${tag}` : "Codewars — 8 kyu Python",
  url:
    "https://www.codewars.com/kata/search/python?order_by=sort_date+desc&r%5B%5D=-8&sample=true" +
    (tag ? `&tags=${encodeURIComponent(tag)}` : ""),
});

export const KATAS: Record<number, Resource[]> = {
  // 1 · variables, numbers, f-strings, for loops
  1: [
    K("55fab1ffda3e2e44f00000c6", "Beginner Series #4 Cockroach"), // floor division
    K("5513795bd3fafb56c200049e", "Count by X"), // build a list in a loop
    K("55f9bca8ecaa9eac7100004a", "Beginner Series #2 Clock"), // arithmetic
  ],

  // 2 · if / elif / else, and-or-not, loops
  2: [
    K("53d16bd82578b1fb5b00128c", "Grader"), // an if/elif chain — same shape as your grade calculator
    K("568dcc3c7f12767a62000038", "L1: Set Alarm"), // two booleans, and / not
    K("57a429e253ba3381850000fb", "Calculate BMI"), // arithmetic + elif
  ],

  // 3 · functions, parameters, return
  3: [
    K("55f73f66d160f1f1db000059", "Grasshopper — Combine strings"), // write a two-parameter function
    K("56dae9dc54c0acd29d00109a", "Grasshopper — Function syntax debugging"), // fix a broken function
    K("58e3f824a33b52c1dc0001c0", "Geometry Basics: Circle Area in 2D"), // return, and reject bad input
  ],

  // 4 · lists
  4: [
    K("5715eaedb436cf5606000381", "Sum of positive"), // loop + condition over a list
    K("53da6d8d112bd1a0dc00008b", "Reverse List Order"), // pairs with the day-1 prove-it
    K("5769b3802ae6f8e4890009d2", "Removing Elements"),
    K("511f0fe64ae8683297000001", "Basic Training: Add item to an Array"),
    K("545afd0761aa4c3055001386", "Enumerable Magic #25 — Take the First N Elements"),
  ],

  // 5 · dictionaries — no 8-kyu dict kata appeared in the sample.
  // Use the search box on the page for "dictionary" or "count", or take two
  // Fundamentals kata and solve each one using a dict.
  5: [kataSearch("Fundamentals")],

  // 6 · strings & randomness
  6: [
    K("559ac78160f0be07c200005a", "Name Shuffler"), // split, reorder, join
    K("57faf12b21c84b5ba30001b0", "Exclamation marks #4"), // strip and re-add characters
    K("55ad04714f0b468e8200001c", "get character from ASCII Value"),
    K("57fae964d80daa229d000126", "Exclamation marks #1"),
  ],

  // 7 · errors & debugging — read the broken code before running it
  7: [
    K("55c933c115a8c426ac000082", "Switch/Case — Bug Fixing #6"),
    kataSearch("Debugging"), // pick a second from here
  ],

  // 8 · files & CSV — Codewars can't test file I/O, so these keep the
  // formatting and loop muscles warm instead
  8: [
    K("56e2f59fb2ed128081001328", "Printing Array elements with Comma delimiters"), // CSV-shaped output
    K("64fbfe2618692c2018ebbddb", "Flick Switch"), // a loop that carries state
  ],

  // 9 · modules & datetime — solve each in its own module and import it
  9: [
    K("563c13853b07a8f17c000022", "Is the date today"), // uses datetime
    K("5a6663e9fd56cb5ab800008b", "Cat years, Dog years"),
  ],

  // 10 · algorithms
  10: [
    K("58f8a3a27a5c28d92e000144", "Find the first non-consecutive number"), // one pass
    K("57ab3c09bb994429df000a4a", "Return Two Highest Values in List"), // pairs with the second-largest drill
    K("54598e89cbae2ac001001135", "Enumerable Magic #2 — True for Any?"), // takes a function as an argument
  ],

  // 11 · capstone — one that needs real thought, then redo week 1's two and
  // compare your old solution with today's
  11: [
    K("574c5075d27783851800169e", "Heads and Legs"), // work the algebra out on paper first
    K("565f5825379664a26b00007c", "Surface Area and Volume of a Box"),
  ],
};

/** Kata for a week, falling back to the plain 8-kyu search. */
export const kataFor = (week: number, stage: string): Resource[] =>
  KATAS[week] ?? [kataSearch(stage === "python" ? undefined : undefined)];
