// content/katas.ts
//
// Challenge-day kata. Every id below was read off a live Codewars search page
// (Python 2026-08-20, JavaScript 2026-08-20). None are from memory.
//
// The first two entries per week are the picks; the rest are alternates.
// Where no suitable kata exists, the week gets a filtered search link, or no
// entry at all, with a comment saying why. Better an honest gap than a kata
// that does not fit.
//
// On the JavaScript stage: from week 9 onwards the challenge day already leads
// with Clash of Code, and the JS weeks lean on freeCodeCamp's own labs (already
// linked in curriculum.ts). Kata here are the warm-up, not the main event --
// just as well, since Codewars cannot test DOM, forms or storage work at all.

import type { Resource } from "./curriculum";

const K = (
  id: string,
  name: string,
  lang: "python" | "javascript",
  kyu = 8,
): Resource => ({
  label: `Codewars - ${name}${kyu === 8 ? "" : ` (${kyu} kyu, a step up)`}`,
  url: `https://www.codewars.com/kata/${id}/train/${lang}`,
});

const P = (id: string, name: string, kyu = 8) => K(id, name, "python", kyu);
const J = (id: string, name: string, kyu = 8) => K(id, name, "javascript", kyu);

/** The 8 kyu search for a language, optionally narrowed to a tag. */
export const kataSearch = (
  lang: "python" | "javascript",
  tag?: string,
): Resource => ({
  label: `Codewars - 8 kyu ${lang === "python" ? "Python" : "JavaScript"}${tag ? `, ${tag}` : ""}`,
  url:
    `https://www.codewars.com/kata/search/${lang}?order_by=sort_date+desc&r%5B%5D=-8&sample=true` +
    (tag ? `&tags=${encodeURIComponent(tag)}` : ""),
});

export const KATAS: Record<number, Resource[]> = {
  // ---------------------------- Python, weeks 1-11 ----------------------------
  1: [
    P("55fab1ffda3e2e44f00000c6", "Beginner Series #4 Cockroach"), // floor division
    P("5513795bd3fafb56c200049e", "Count by X"), // build a list in a loop
    P("55f9bca8ecaa9eac7100004a", "Beginner Series #2 Clock"),
  ],
  2: [
    P("53d16bd82578b1fb5b00128c", "Grader"), // if/elif chain, same shape as the grade calculator
    P("568dcc3c7f12767a62000038", "L1: Set Alarm"), // two booleans, and / not
    P("57a429e253ba3381850000fb", "Calculate BMI"),
  ],
  3: [
    P("55f73f66d160f1f1db000059", "Grasshopper - Combine strings"), // write a two-parameter function
    P("56dae9dc54c0acd29d00109a", "Grasshopper - Function syntax debugging"), // fix a broken function
    P("58e3f824a33b52c1dc0001c0", "Geometry Basics: Circle Area in 2D"),
  ],
  4: [
    P("5715eaedb436cf5606000381", "Sum of positive"),
    P("53da6d8d112bd1a0dc00008b", "Reverse List Order"), // pairs with the day 1 prove-it
    P("5769b3802ae6f8e4890009d2", "Removing Elements"),
    P("511f0fe64ae8683297000001", "Basic Training: Add item to an Array"),
    P("545afd0761aa4c3055001386", "Enumerable Magic #25 - Take the First N Elements"),
  ],
  // No 8 kyu dictionary kata appeared in the sample. Use the site's search box
  // for "dictionary" or "count", or take two Fundamentals kata and solve each
  // one with a dict.
  5: [kataSearch("python", "Fundamentals")],
  6: [
    P("559ac78160f0be07c200005a", "Name Shuffler"), // split, reorder, join
    P("57faf12b21c84b5ba30001b0", "Exclamation marks #4"),
    P("55ad04714f0b468e8200001c", "get character from ASCII Value"),
    P("57fae964d80daa229d000126", "Exclamation marks #1"),
  ],
  7: [
    P("55c933c115a8c426ac000082", "Switch/Case - Bug Fixing #6"),
    kataSearch("python", "Debugging"), // pick a second from here
  ],
  // Codewars cannot test file I/O. These keep the formatting and loop muscles warm.
  8: [
    P("56e2f59fb2ed128081001328", "Printing Array elements with Comma delimiters"), // CSV-shaped output
    P("64fbfe2618692c2018ebbddb", "Flick Switch"), // a loop that carries state
  ],
  9: [
    P("563c13853b07a8f17c000022", "Is the date today"), // uses datetime
    P("5a6663e9fd56cb5ab800008b", "Cat years, Dog years"),
  ],
  10: [
    P("58f8a3a27a5c28d92e000144", "Find the first non-consecutive number"), // one pass
    P("57ab3c09bb994429df000a4a", "Return Two Highest Values in List"), // pairs with the second-largest drill
    P("54598e89cbae2ac001001135", "Enumerable Magic #2 - True for Any?"),
  ],
  11: [
    P("574c5075d27783851800169e", "Heads and Legs"), // do the algebra on paper first
    P("565f5825379664a26b00007c", "Surface Area and Volume of a Box"),
  ],

  // -------------------------- JavaScript, weeks 23-33 -------------------------
  // The 8 kyu JS pool I could verify is thin, so several weeks use a tag search.
  // That is fine: these weeks already lead with Clash of Code and freeCodeCamp's
  // own labs.
  23: [kataSearch("javascript", "Strings"), kataSearch("javascript", "Fundamentals")],
  24: [
    J("5ae62fcf252e66d44d00008e", "Expressions Matter"), // operators and comparison
    J("5a805d8cafa10f8b930005ba", "Find Nearest square number"), // Math methods
    J("56269eb78ad2e4ced1000013", "Find the next perfect square!", 7),
  ],
  25: [
    J("5899642f6e1b25935d000161", "Merge two sorted arrays into one"),
    J("57f6ad55cca6e045d2000627", "To square(root) or not to square(root)"), // map over an array
    J("541629460b198da04e000bb9", "Last", 7),
  ],
  26: [
    kataSearch("javascript", "Fundamentals"), // loop practice
    J("5ff2093d375dca00170057bc", "Dice Rotation", 7),
  ],
  27: [
    J("554e4a2f232cdd87d9000038", "Complementary DNA", 7), // map/replace over a string
    J("578fdcfc75ffd1112c0001a1", "The Lazy Startup Office", 7), // every/some over arrays
    J("5a433c7a8f27f23bb00000dc", "Split By Value", 7),
  ],
  // Weeks 28-31 are DOM, events, form validation and storage. Codewars cannot
  // test any of that. Do the freeCodeCamp lab for the week instead, plus a Clash
  // round. Deliberately no kata here.
  32: [
    J("515e188a311df01cba000003", "Get Planet Name By ID"), // a debugging kata, and week 32 is debugging
    J("5857e8bb9948644aa1000246", "Can Santa save Christmas?", 7), // Date object
  ],
  33: [kataSearch("javascript", "Object-oriented Programming")], // classes week
  // Weeks 34-36 are the memory game and the Weather App: Clash of Code only, so
  // the hour goes into the build.
};

/** Kata for a week. Empty when the week's challenge is a lab or a build. */
export const kataFor = (week: number): Resource[] => KATAS[week] ?? [];
