// content/curriculum.ts  (v3)
//
// The single source of curriculum content. Shared by everyone; per-user
// progress lives in lib/storage.ts.
//
// Shape of a week: five authored days (learn / practice / build) + a derived
// challenge day (katas + debug drill with hidden solution) + rest.
// Shape of a day: concept line — lesson[] (real course blocks, in order, each
// a link) — exercises[] (tickable) — prove-it (the day's capstone) — push target.
//
// Resources (trusted only):
//  - Futurecoder: single-page app. Deep links use #PageSlug and work when
//    signed out; when signed in, Futurecoder may reopen your last page — the
//    UI shows "if you land elsewhere, open ☰ and pick the page". Slugs marked
//    verified come from the course's own page list; chapters without a
//    verified slug link to the table of contents (#toc) with the exact name.
//  - freeCodeCamp v9 (RWD + JavaScript): modelled block-by-block on the live
//    curriculum (captured 2026-08-19). Links with a verified block slug deep-link
//    via the cert page's #block anchor; the rest link to the cert page, whose
//    "Search lessons" box finds the named block instantly.
//  - Official Python tutorial for what Futurecoder doesn't cover.

import { kataFor } from "./katas";

export type Stage = "python" | "html" | "css" | "javascript";
export type TaskKind = "learn" | "practice" | "build" | "challenge" | "rest";

export interface Resource { label: string; url: string }

export interface Task {
  day: number; // 1–7
  kind: TaskKind;
  title: string;
  concept: string; // one line: what today is about
  lesson?: Resource[]; // course blocks to complete, in order
  exercises?: string[]; // tickable drills
  prove?: string; // the day's capstone
  push?: string; // file/folder to push, e.g. week-01/day-03-tip.py
  code?: string; // debug drill
  solution?: string; // hidden until attempted
}

export interface Week {
  number: number;
  stage: Stage;
  topic: string;
  concepts: string;
  project: string;
  description: string;
  stretch: string;
  katas: string;
  days: Task[]; // days 1–5
  drill: { code: string; solution: string };
}

export interface Curriculum { slug: string; title: string; weeks: Week[] }

// --- resources ----------------------------------------------------------------

const r = (label: string, url: string): Resource => ({ label, url });

const FC_URL = "https://futurecoder.io/course/";
/** Futurecoder page. slug = verified page slug; omit — table of contents. */
const fc = (label: string, slug?: string) => r(`Futurecoder — ${label}`, `${FC_URL}#${slug ?? "toc"}`);

const RWD_URL = "https://www.freecodecamp.org/learn/responsive-web-design-v9/";
const JS_URL = "https://www.freecodecamp.org/learn/javascript-v9/";
/** freeCodeCamp block. slug = verified block slug; omit — cert page (use its search). */
const rwd = (label: string, slug?: string) => r(`fCC — ${label}`, slug ? `${RWD_URL}#${slug}` : RWD_URL);
const fjs = (label: string, slug?: string) => r(`fCC — ${label}`, slug ? `${JS_URL}#${slug}` : JS_URL);

const py = (label: string, path: string) => r(`Python tutorial — ${label}`, `https://docs.python.org/3/tutorial/${path}`);
const pylib = (label: string, mod: string) => r(`Python docs — ${label}`, `https://docs.python.org/3/library/${mod}.html`);
const GITHUB = r("GitHub Docs — get started", "https://docs.github.com/en/get-started");
const GH_PAGES = r("GitHub Pages", "https://pages.github.com/");
const CLASH = r("CodinGame — Clash of Code", "https://www.codingame.com/multiplayer/clashofcode");
const VALIDATOR = r("W3C HTML validator", "https://validator.w3.org/");

// --- helpers ------------------------------------------------------------------

type DayBody = Omit<Task, "day" | "kind" | "title">;
const d = (day: number, kind: TaskKind, title: string, body: DayBody): Task => ({ day, kind, title, ...body });

// --- weeks --------------------------------------------------------------------

const weeks: Week[] = [
  // ———————————————————————— Stage 1 · Python (1–11) · Futurecoder ———————————
  {
    number: 1, stage: "python", topic: "Talk to the machine",
    concepts: "the shell, strings, variables, input, f-strings, numbers, for loops",
    project: "Mad Libs", description: "Ask for words, stitch a story, print it inside a loop-built frame.",
    stretch: "A second story and a loop that tells both.",
    katas: "two 8-kyu string katas",
    days: [
      d(1, "learn", "Set up like a developer", {
        concept: "Python + VS Code + a GitHub repo. Three git commands, forever: add, commit, push.",
        lesson: [GITHUB, fc("Introducing the shell", "IntroducingTheShell"), fc("Navigating shell history", "NavigatingShellHistory")],
        exercises: ["Install Python and VS Code; run python3 --version", "Create repo coding-journey with a week-01 folder", "Commit and push hello.py"],
        prove: "hello.py prints your name and is visible on GitHub.", push: "week-01/hello.py",
      }),
      d(2, "learn", "Strings & variables", {
        concept: "Text in quotes, joining it, naming it, changing it.",
        lesson: [fc("Introducing strings", "IntroducingStrings"), fc("Adding strings", "AddingStrings"), fc("Introducing variables", "IntroducingVariables"), fc("Using variables", "UsingVariables"), fc("Writing programs", "WritingPrograms")],
        exercises: ["Store your name and town in variables and print a sentence", "Join three words into one with spaces between", "Print your name in uppercase using .upper()"],
        prove: "A profile card: asks for name and town with input(), prints a 3-line card with your name uppercased AND reversed (reversing isn't taught — work it out).", push: "week-01/day-02-profile.py",
      }),
      d(3, "learn", "Numbers & f-strings", {
        concept: "int vs float, + — * / // %, turning input() text into numbers, formatting with f-strings.",
        lesson: [fc("Storing calculations in variables", "StoringCalculationsInVariables"), fc("Introducing f-strings", "IntroducingFstrings")],
        exercises: ["Print 7 // 2 and 7 % 2 and explain both", "Ask for two numbers and print their sum, product and average", "Print a price to exactly 2 decimal places with an f-string"],
        prove: "A tip calculator: bill, tip %, number of people — each person's share, rounded to pence. The trap: input() gives text.", push: "week-01/day-03-tip.py",
      }),
      d(4, "learn", "for loops", {
        concept: "Repeating with for … in range(), indentation, building strings up inside a loop.",
        lesson: [fc("Introducing for loops", "IntroducingForLoops"), fc("Indentation", "Indentation"), fc("Basic for loop exercises", "BasicForLoopExercises"), fc("Building up strings", "BuildingUpStrings"), fc("Building up strings exercises", "BuildingUpStringsExercises")],
        exercises: ["Print 1 to 20, then only the even ones", "Print a right-angled triangle of * of any height", "Build 'a-b-c-d' from 'abcd' with a loop (no join)"],
        prove: "Sum of every multiple of 3 or 5 below 1000, printed with an f-string.", push: "week-01/day-04-loops.py",
      }),
      d(5, "build", "Build: Mad Libs", {
        concept: "Everything this week, in one program you'd show someone.",
        exercises: ["Ask for 5+ words (a name, a place, an adjective, a number…)", "Build the story with f-strings", "Print a frame of — characters above and below, sized to the longest line, using a loop"],
        prove: "Mad Libs runs, looks good, never crashes on what you type.", push: "week-01/day-05-madlibs.py",
      }),
    ],
    drill: {
      code: `name = input("Name: ")
print("Hello " name)
for i in range(3)
    print(i)
print(name.upper)`,
      solution: `1) "Hello " name is missing the + (or use an f-string). 2) The for line is missing its colon. 3) name.upper is the method itself — call it: name.upper().`,
    },
  },
  {
    number: 2, stage: "python", topic: "Decisions & repetition",
    concepts: "if / elif / else, comparisons, and / or / not, while loops, nested loops",
    project: "Rock Paper Scissors — best of 5", description: "A full match with a scoreboard, input checking and a rematch prompt.",
    stretch: "Lizard & Spock, and a 'first to N' option.",
    katas: "two 8-kyu katas that need an if",
    days: [
      d(1, "learn", "if statements", {
        concept: "Code that runs only when something is true. Comparison operators.",
        lesson: [fc("Introducing if statements", "IntroducingIfStatements"), fc("Combining compound statements", "CombiningCompoundStatements"), fc("If and else", "IfAndElse"), fc("The equality operator", "TheEqualityOperator"), fc("Introducing elif", "IntroducingElif"), fc("Other comparison operators", "OtherComparisonOperators")],
        exercises: ["Ask for a number; say positive / negative / zero", "Ask for a mark; print the grade A–F with elif", "Swap two variables without a third"],
        prove: "A grade calculator that REFUSES a mark over 100 or under 0 — your first input validation.", push: "week-02/day-01-grades.py",
      }),
      d(2, "learn", "Logic", {
        concept: "and / or / not, truthiness, combining conditions without tangling them.",
        lesson: [fc("Understanding programs with Snoop", "UnderstandingProgramsWithSnoop"), py("More on conditions", "datastructures.html#more-on-conditions")],
        exercises: ["Leap-year checker (divisible by 4, except 100s, except 400s)", "Format any name as 'LAST, First'", "Convert temperature BOTH directions based on a choice"],
        prove: "Mad Libs, hard mode: a name over 6 letters gets a different opening; an age under 13 branches the ending.", push: "week-02/day-02-madlibs-hard.py",
      }),
      d(3, "learn", "while loops", {
        concept: "Repeat until a condition changes. You WILL write an infinite loop — log it, celebrate it.",
        lesson: [py("First steps towards programming (while)", "introduction.html#first-steps-towards-programming"), py("break and continue", "controlflow.html#break-and-continue-statements-and-else-clauses-on-loops")],
        exercises: ["Countdown that refuses to start until you type a positive number", "Keep asking for a password until it's right (max 3 tries)", "Guess-my-number: computer picks 1–100, you get 7 guesses, higher/lower hints"],
        prove: "A menu loop: show options, act on the choice, repeat until 'q' — the skeleton of every program you'll write this month.", push: "week-02/day-03-menu.py",
      }),
      d(4, "learn", "Nested loops", {
        concept: "Loops inside loops; tracing what runs when.",
        lesson: [fc("Introducing nested loops", "IntroducingNestedLoops"), fc("Introducing Bird's Eye", "IntroducingBirdseye")],
        exercises: ["A full 1–12 times-table grid, neatly aligned", "Every unique pair from a list of names (no repeats, no self-pairs)", "FizzBuzz to 100"],
        prove: "Reverse a string with a loop — no slicing, no reversed().", push: "week-02/day-04-nested.py",
      }),
      d(5, "build", "Build: Rock Paper Scissors", {
        concept: "if + while + input validation + a score.",
        exercises: ["Computer picks with random.choice", "Best of 5 with a scoreboard each round", "Rejects invalid input; offers a rematch"],
        prove: "A full, unbreakable match.", push: "week-02/day-05-rps.py",
      }),
    ],
    drill: {
      code: `age = input("Age: ")
if age > 18:
    print("Adult")

count = 5
while count > 0:
    print(count)

for i in range(1, 10):
    print(i)  # wanted 1 to 10`,
      solution: `1) age is text — int(input("Age: ")) before comparing. 2) count never changes — count -= 1 inside the loop (infinite). 3) range(1, 10) stops at 9 — use range(1, 11).`,
    },
  },
  {
    number: 3, stage: "python", topic: "Functions",
    concepts: "def, parameters, return vs print, scope, one job per function, docstrings",
    project: "Calculator that can't be crashed", description: "Menu-driven, one function per operation, survives every bad input.",
    stretch: "Power, square root, and a running history.",
    katas: "two 8-kyu katas solved as clean single functions",
    days: [
      d(1, "learn", "Defining functions", {
        concept: "Name a chunk of code, give it inputs, reuse it. Why: readability and reuse.",
        lesson: [fc("Functions chapter — Defining functions"), fc("Functions chapter — Calling functions within functions"), fc("Terminology", "BasicTerminology")],
        exercises: ["greet(name, excited) returns different text depending on excited", "is_even(n)", "area of a circle given radius"],
        prove: "Three functions, each doing exactly one job, each with a one-line docstring.", push: "week-03/day-01-functions.py",
      }),
      d(2, "learn", "return & scope", {
        concept: "return hands a value back; print just shows it. Variables inside a function vanish outside.",
        lesson: [fc("Functions chapter — Returning from functions"), fc("Functions chapter — Testing functions"), py("Defining functions", "controlflow.html#defining-functions")],
        exercises: ["largest_of_three(a, b, c) WITHOUT max()", "Predict the output of a function that prints but doesn't return, used in an f-string", "Explain out loud why a local variable isn't visible after the function ends"],
        prove: "get_number(prompt): keeps asking until it gets a valid number; never crashes; never returns text.", push: "week-03/day-02-return.py",
      }),
      d(3, "practice", "Refactor day", {
        concept: "Turn last week's scripts into functions. If a function needs 'and' to describe it, split it.",
        exercises: ["Refactor RPS: play_round(), get_choice(), show_score()", "Refactor Mad Libs into build_story(words) and main()", "Reuse get_number() inside both"],
        prove: "Both programs behave identically but read like a table of contents.", push: "week-03/day-03-refactor/",
      }),
      d(4, "learn", "Defaults, keywords, small helpers", {
        concept: "Default parameter values, keyword arguments, functions calling functions.",
        lesson: [py("Default argument values", "controlflow.html#default-argument-values"), py("Keyword arguments", "controlflow.html#keyword-arguments")],
        exercises: ["shout(text, times=1)", "A temperature converter with a direction keyword", "A function that validates a menu choice against a list of allowed options"],
        prove: "A converter suite: temperature, distance, weight — each its own function, one menu.", push: "week-03/day-04-converters.py",
      }),
      d(5, "build", "Build: the calculator", {
        concept: "Functions + validation + a loop.",
        exercises: ["+ − × ÷ each as its own function", "Division by zero handled", "Letters rejected; loop until 'q'"],
        prove: "Throw the worst input you can at it. It survives.", push: "week-03/day-05-calculator.py",
      }),
    ],
    drill: {
      code: `def add(a, b):
    result = a + b

def greet(name):
    print("Hi " + name)

total = add(2, 3)
print(total + 1)
greet()
print(result)`,
      solution: `1) add never returns — add "return result", otherwise total is None. 2) greet() is called with no argument. 3) result is local to add — it doesn't exist outside; return it and use the returned value.`,
    },
  },
  {
    number: 4, stage: "python", topic: "Lists",
    concepts: "indexing, slicing, append/pop/sort, in, looping with index, nested lists, mutation",
    project: "Hangman", description: "Guess the word letter by letter; the drawing grows with each miss.",
    stretch: "Word categories; a two-player mode where one types the word.",
    katas: "two 8-kyu list katas",
    days: [
      d(1, "learn", "Lists", {
        concept: "Ordered collections, positions start at 0, negative indexes count from the end.",
        lesson: [fc("Introducing lists", "IntroducingLists"), fc("Building new lists", "BuildingNewLists"), fc("Using break", "UsingBreak"), fc("Getting elements at position", "GettingElementsAtPosition"), fc("Getting elements at position — exercises", "GettingElementsAtPositionExercises")],
        exercises: ["From a list of scores print the highest, the last, and the middle two — slices only", "Build a new list of only the even numbers", "Find the position of a value with a loop (no index())"],
        prove: "Reverse a list without reverse() or slicing.", push: "week-04/day-01-lists.py",
      }),
      d(2, "learn", "List methods & mutation", {
        concept: "append, insert, remove, pop, sort vs sorted — and why changing a list while looping bites.",
        lesson: [fc("Calling functions — terminology", "CallingFunctionsTerminology"), fc("Functions and methods for lists", "FunctionsAndMethodsForLists"), fc("More list functions and methods", "MoreListFunctionsAndMethods"), fc("String methods — understanding mutation", "StringMethodsUnderstandingMutation"), fc("Modifying while iterating", "ModifyingWhileIterating")],
        exercises: ["Shopping list: add / remove / show sorted, in a loop until 'done'", "Remove all duplicates (keep order)", "Explain the difference between sort() and sorted() out loud"],
        prove: "Sum only the even numbers; then the second-largest number in one pass.", push: "week-04/day-02-methods.py",
      }),
      d(3, "practice", "Lists + strings", {
        concept: "Strings are sequences too; splitting and joining; == vs is.",
        lesson: [fc("Equals vs is", "EqualsVsIs"), fc("Single and double quotes in strings", "SingleAndDoubleQuotesInStrings"), fc("How to find information with Google and more", "HowToFindInformationWithGoogleAndMore")],
        exercises: ["Count vowels in a sentence", "Title-case a sentence by hand (split, fix, join)", "Show a word as _ _ a _ given a set of guessed letters — the heart of Hangman"],
        prove: "Is a sentence a palindrome ignoring spaces and case?", push: "week-04/day-03-strings.py",
      }),
      d(4, "learn", "Nested lists & enumerate", {
        concept: "Lists of lists (grids), looping with index AND value, Python Tutor to see it.",
        lesson: [fc("Introducing nested lists", "IntroducingNestedLists"), fc("Understanding programs with Python Tutor", "UnderstandingProgramsWithPythonTutor")],
        exercises: ["Print a 3×3 grid stored as a nested list", "Row and column totals of a 2D list", "Print each item with its position using enumerate"],
        prove: "Transpose a 2D list (rows become columns).", push: "week-04/day-04-nested.py",
      }),
      d(5, "build", "Build: Hangman", {
        concept: "Lists, strings, loops, functions, validation.",
        exercises: ["random word from a list", "guessed letters shown as blanks", "six lives, ASCII drawing grows, win/lose"],
        prove: "Hangman, clean functions, can't be crashed.", push: "week-04/day-05-hangman.py",
      }),
    ],
    drill: {
      code: `scores = [10, 20, 30, 40]
print(scores[4])
scores.append([50])
top = scores.sort()
print(top)`,
      solution: `1) scores[4] doesn't exist — indexes are 0–3 (scores[-1] for the last). 2) append([50]) nests a list — append(50). 3) sort() sorts in place and returns None — scores.sort() then print(scores), or sorted(scores).`,
    },
  },
  {
    number: 5, stage: "python", topic: "Dictionaries",
    concepts: "key/value, get, items(), counting with dicts, nested data, list vs dict",
    project: "Quiz Game with categories", description: "Questions stored as data, scored, by category.",
    stretch: "Difficulty levels; remember the best score (a preview of Week 8).",
    katas: "two 8-kyu katas that need a dictionary",
    days: [
      d(1, "learn", "Dictionaries", {
        concept: "Look things up by name, not position. .get() instead of crashing.",
        lesson: [fc("Dictionaries chapter — Introducing dictionaries"), fc("Dictionaries chapter — Using dictionaries"), py("Dictionaries", "datastructures.html#dictionaries")],
        exercises: ["A phone book: add, look up, say 'not found' instead of crashing", "Update a value; delete a key", "Check if a key exists before using it"],
        prove: "A translation dictionary: type English, get French; unknown words are reported, not fatal.", push: "week-05/day-01-dicts.py",
      }),
      d(2, "learn", "Looping dicts & counting", {
        concept: ".items() .keys() .values(); the counting-with-a-dict pattern.",
        lesson: [fc("Dictionaries chapter — Dictionary keys and values"), py("Looping techniques", "datastructures.html#looping-techniques")],
        exercises: ["Count how many times each word appears in a sentence", "Count each letter in a word", "Print a dict sorted by value"],
        prove: "Word frequency of a paragraph, top 5 printed neatly.", push: "week-05/day-02-counting.py",
      }),
      d(3, "practice", "Shapes of data", {
        concept: "Choosing list vs dict vs nested; drawing the shape before coding.",
        exercises: ["Pick list or dict for: a class register, a leaderboard, a translation table — justify each", "students — list of marks; print each average", "A dict of dicts: people — {age, town}; print everyone over 16"],
        prove: "Inventory: items with quantity and price; total value; items running low.", push: "week-05/day-03-shapes.py",
      }),
      d(4, "learn", "Data-driven programs", {
        concept: "Store questions as a list of dicts; the code shouldn't change when the data does.",
        exercises: ["questions = [{'q':…, 'options':[…], 'answer':…, 'category':…}]", "A loop that asks each and scores it", "Add a question — no code change needed"],
        prove: "Results grouped per category at the end.", push: "week-05/day-04-data.py",
      }),
      d(5, "build", "Build: Quiz Game", {
        concept: "Dicts, lists, loops, functions.",
        exercises: ["Choose a category", "Scored, with feedback per question", "Summary by category"],
        prove: "A quiz you could hand to a friend.", push: "week-05/day-05-quiz.py",
      }),
    ],
    drill: {
      code: `ages = {"Sam": 14, "Ali": 15}
print(ages["Zoe"])
if 15 in ages:
    print("someone is 15")
for k, v in ages:
    print(k, v)`,
      solution: `1) ages["Zoe"] raises KeyError — use ages.get("Zoe"). 2) "in ages" checks keys, not values — ages.values(). 3) Looping a dict gives keys only — ages.items() to unpack k, v.`,
    },
  },
  {
    number: 6, stage: "python", topic: "Strings & randomness",
    concepts: "string methods, slicing tricks, join/split, the random module",
    project: "Password Generator + strength checker", description: "Generate to spec; judge any password.",
    stretch: "A passphrase mode from a word list.",
    katas: "two 8-kyu string-manipulation katas",
    days: [
      d(1, "learn", "String algorithms", {
        concept: "Slicing, split/join, isdigit/isupper, in — the toolbox for text problems.",
        lesson: [py("Text (strings)", "introduction.html#text"), pylib("str methods", "stdtypes#string-methods")],
        exercises: ["Anagram check", "Caesar cipher — encode AND decode", "Remove all vowels"],
        prove: "Count words longer than 5 letters; print them capitalised.", push: "week-06/day-01-strings.py",
      }),
      d(2, "learn", "The random module", {
        concept: "randint, choice, shuffle, sample — and why computer 'randomness' is worth a thought.",
        lesson: [pylib("random", "random")],
        exercises: ["Roll two dice 10,000 times; how often each total?", "Shuffle a deck of 52", "Pick 3 unique winners from a list"],
        prove: "A dice-roll histogram printed with * bars.", push: "week-06/day-02-random.py",
      }),
      d(3, "practice", "Rules — code", {
        concept: "Turning a spec into conditions.",
        exercises: ["strength(pw): length ≥ 12, upper, lower, digit, symbol", "Return weak/ok/strong WITH reasons", "Test it against 5 passwords you write down first"],
        prove: "Your checker agrees with your own judgement on all 5.", push: "week-06/day-03-strength.py",
      }),
      d(4, "learn", "Building text from parts", {
        concept: "Character sets, choosing from them, join — and a quick look at what makes a password strong.",
        exercises: ["Build letters/digits/symbols as strings", "Generate N random characters with choice + join", "Guarantee at least one from each set"],
        prove: "A generator that takes length and options.", push: "week-06/day-04-generate.py",
      }),
      d(5, "build", "Build: Password Generator", {
        concept: "Strings + random + your own strength checker.",
        exercises: ["Ask length and which sets", "Generate", "Check with strength() and show the verdict"],
        prove: "Generates only strong passwords.", push: "week-06/day-05-password.py",
      }),
    ],
    drill: {
      code: `import random
word = "python"
print(word[6])
print(word.upper)
n = random.randint(1, 10)
print("Rolled " + n)`,
      solution: `1) word[6] is out of range — indexes are 0–5. 2) word.upper is the method, not its result — word.upper(). 3) Can't add text and a number — f"Rolled {n}".`,
    },
  },
  {
    number: 7, stage: "python", topic: "When things go wrong",
    concepts: "reading tracebacks, exceptions, try/except, raise, finally, defensive code",
    project: "Bank account simulator", description: "Deposits, withdrawals, transfers that refuse impossible actions.",
    stretch: "Transaction history; an overdraft rule.",
    katas: "two 8-kyu katas where bad input must be handled",
    days: [
      d(1, "learn", "Reading tracebacks", {
        concept: "Last line first. ValueError, TypeError, IndexError, KeyError, ZeroDivisionError — name them on sight.",
        lesson: [py("Errors and exceptions", "errors.html"), py("Exceptions", "errors.html#exceptions")],
        exercises: ["Deliberately cause each of the five errors", "Explain each message in your own words", "Log them in the bug journal with what caused them"],
        prove: "A cheat-sheet file: error — what it means — the usual fix.", push: "week-07/day-01-errors.md",
      }),
      d(2, "learn", "try / except", {
        concept: "Catch SPECIFIC errors, never a bare except.",
        lesson: [py("Handling exceptions", "errors.html#handling-exceptions")],
        exercises: ["Rewrite get_number() with try/except", "divide(a, b) handling non-numbers AND zero", "Explain why 'except:' hides bugs"],
        prove: "A robust input helper you'll reuse for the rest of Python.", push: "week-07/day-02-try.py",
      }),
      d(3, "practice", "Robustness day", {
        concept: "Make old programs unbreakable.",
        exercises: ["Hangman: type nonsense, numbers, nothing — fix every crash", "Quiz: same", "Log every crash you found in the journal FIRST"],
        prove: "Neither program can be crashed from the keyboard.", push: "week-07/day-03-robust/",
      }),
      d(4, "learn", "raise & finally", {
        concept: "Raise your own errors when a rule is broken; finally for cleanup.",
        lesson: [py("Raising exceptions", "errors.html#raising-exceptions"), py("Defining clean-up actions", "errors.html#defining-clean-up-actions")],
        exercises: ["withdraw(amount) raises ValueError for negative or over-balance", "The caller catches and reports", "A function with finally that always prints 'done'"],
        prove: "Rules live in the functions; the menu only reports.", push: "week-07/day-04-raise.py",
      }),
      d(5, "build", "Build: the bank", {
        concept: "Dicts for accounts, functions that raise, a menu that catches.",
        exercises: ["deposit / withdraw / transfer", "Impossible actions raise", "Menu catches and explains"],
        prove: "Nothing impossible ever happens to a balance.", push: "week-07/day-05-bank.py",
      }),
    ],
    drill: {
      code: `try:
    n = int(input("Number: "))
except:
    print("Not a number")
result = 10 / n

def safe_div(a, b):
    try:
        return a / b
    except ValueError:
        return None
print(safe_div(1, 0))`,
      solution: `1) Bare except hides everything — catch ValueError. 2) After a failed input, n doesn't exist and 10 / n crashes — loop until valid, or exit. 3) Dividing by zero raises ZeroDivisionError, not ValueError.`,
    },
  },
  {
    number: 8, stage: "python", topic: "Files & persistence",
    concepts: "open/with, read/write/append, lines, CSV, data that survives the program",
    project: "To-do list that remembers", description: "Add, complete, delete — still there tomorrow.",
    stretch: "Due dates and an 'overdue' view.",
    katas: "two 8-kyu katas on parsing text",
    days: [
      d(1, "learn", "Reading files", {
        concept: "open, with, read vs readlines; why with matters.",
        lesson: [py("Reading and writing files", "inputoutput.html#reading-and-writing-files")],
        exercises: ["Count lines, words, characters in a text file", "Print only lines containing a word", "Print the longest line"],
        prove: "A tiny grep: file + word — matching lines with line numbers.", push: "week-08/day-01-read.py",
      }),
      d(2, "learn", "Writing files", {
        concept: "'w' vs 'a', the overwrite trap, writing lines.",
        lesson: [py("Methods of file objects", "inputoutput.html#methods-of-file-objects")],
        exercises: ["A diary: each run appends a dated entry", "A mode that prints all entries", "Demonstrate the overwrite trap, then fix it"],
        prove: "Quiz high score saved to a file and loaded on start.", push: "week-08/day-02-write.py",
      }),
      d(3, "practice", "Data out of code", {
        concept: "Move hard-coded data into files.",
        exercises: ["Hangman's word list in words.txt", "Quiz questions in a file", "Adding content needs zero code changes"],
        prove: "Both games load their data from files.", push: "week-08/day-03-datafiles/",
      }),
      d(4, "learn", "CSV", {
        concept: "Rows and columns with the csv module; rows → lists/dicts.",
        lesson: [pylib("csv", "csv")],
        exercises: ["Read grades.csv into a list of dicts", "Each student's average", "Write a summary.csv"],
        prove: "Top student and class average, from CSV to CSV.", push: "week-08/day-04-csv.py",
      }),
      d(5, "build", "Build: persistent to-do", {
        concept: "Load on start, save on every change.",
        exercises: ["add / complete / delete / list", "Saved to a file as CSV or lines", "Survives a restart"],
        prove: "Close it, reopen it, everything's there.", push: "week-08/day-05-todo.py",
      }),
    ],
    drill: {
      code: `f = open("scores.txt")
f.write("100\\n")
lines = f.read()
for line in lines:
    print(line)
f.close`,
      solution: `1) Opened for reading — writing needs open("scores.txt", "a") (or "w"). 2) Looping over read() gives characters — readlines() or splitlines(). 3) f.close is never called (missing parens) — better: with open(...) as f:.`,
    },
  },
  {
    number: 9, stage: "python", topic: "Organising code",
    concepts: "import, the standard library, your own modules, __main__, datetime, planning",
    project: "Habit tracker (multi-file)", description: "Daily habits with streaks — your first program across files.",
    stretch: "A weekly summary and a 'best streak' record.",
    katas: "two 8-kyu katas — each solved in its own module, imported into a test file",
    days: [
      d(1, "learn", "Modules & the standard library", {
        concept: "import math / random / datetime; reading docs to find a function you've never used.",
        lesson: [py("Modules", "modules.html"), pylib("datetime", "datetime")],
        exercises: ["Days until your next birthday", "Today's date formatted three ways", "math.sqrt, math.floor, round — predict, then check"],
        prove: "How many days old are you? Weeks? Hours?", push: "week-09/day-01-stdlib.py",
      }),
      d(2, "learn", "Your own modules", {
        concept: "Split code into files; import your own functions; the __main__ guard.",
        lesson: [py("Executing modules as scripts", "modules.html#executing-modules-as-scripts")],
        exercises: ["Move get_number() and friends into helpers.py", "Import them from two different programs", "Explain what if __name__ == '__main__' is for"],
        prove: "helpers.py imported by two scripts, no duplicated code.", push: "week-09/day-02-modules/",
      }),
      d(3, "practice", "Refactor the bank", {
        concept: "data.py (load/save), rules.py (logic), main.py (menu). Nothing behaves differently.",
        exercises: ["Split", "Run it", "Delete dead code"],
        prove: "Three files, one program, identical behaviour.", push: "week-09/day-03-bank/",
      }),
      d(4, "learn", "Design before code", {
        concept: "Plan on paper: what data, which functions, which file.",
        exercises: ["Write README.md for the habit tracker", "Decide the data shape (JSON or CSV)", "Build the data layer only"],
        prove: "A plan someone else could build from.", push: "week-09/day-04-plan/",
      }),
      d(5, "build", "Build: habit tracker", {
        concept: "Multi-file, persistent, with dates.",
        exercises: ["Mark today done", "Streaks computed from dates", "Split across files"],
        prove: "Tracks a real habit of yours for the rest of the roadmap.", push: "week-09/day-05-habits/",
      }),
    ],
    drill: {
      code: `import math
print(math.sqrt)
from datetime import datetime
today = datetime.now
print(today.year)
def main():
    print("Running")
main`,
      solution: `1) math.sqrt needs a number: math.sqrt(16). 2) datetime.now is a method — datetime.now(). 3) main is never called — main(), ideally under if __name__ == "__main__":.`,
    },
  },
  {
    number: 10, stage: "python", topic: "Thinking in algorithms",
    concepts: "linear vs binary search, sorting by hand, counting steps, recursion",
    project: "The computer guesses YOUR number", description: "You think of a number; the computer finds it in ≤ 7 guesses.",
    stretch: "Word-frequency over a whole book (Project Gutenberg text).",
    katas: "one 8-kyu and one 7-kyu — the 7 is meant to hurt",
    days: [
      d(1, "learn", "Searching", {
        concept: "Linear search by hand, then binary search on a sorted list; count comparisons.",
        exercises: ["linear_search(items, x)", "binary_search(items, x)", "Print comparison counts for both on 1,000 items"],
        prove: "Explain out loud why binary search needs a sorted list.", push: "week-10/day-01-search.py",
      }),
      d(2, "learn", "Sorting by hand", {
        concept: "Bubble or selection sort written yourself — no sort().",
        exercises: ["bubble_sort(nums)", "Count swaps", "Try it on 10, 100, 1,000 numbers and time it"],
        prove: "Explain why it gets slow on big lists.", push: "week-10/day-02-sort.py",
      }),
      d(3, "practice", "Algorithm drills", {
        concept: "Classic small problems.",
        exercises: ["Is a list sorted?", "Merge two sorted lists into one sorted list without sorting", "Second-largest in one pass"],
        prove: "All three, each a clean function with a docstring.", push: "week-10/day-03-drills.py",
      }),
      d(4, "learn", "A taste of recursion", {
        concept: "A function that calls itself, with a base case.",
        exercises: ["factorial(n) recursive", "countdown(n) recursive", "Remove the base case — watch what happens, log it"],
        prove: "Explain the call stack picture in your own words.", push: "week-10/day-04-recursion.py",
      }),
      d(5, "build", "Build: computer guesses", {
        concept: "Binary search as a game.",
        exercises: ["You pick 1–100 in your head", "Answer higher / lower / yes", "It always wins in ≤ 7"],
        prove: "It never needs an 8th guess.", push: "week-10/day-05-guesser.py",
      }),
    ],
    drill: {
      code: `def find(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
        else:
            return -1

def guess(low, high, secret):
    mid = (low + high) / 2
    if mid == secret:
        return mid
    if mid < secret:
        return guess(mid, high, secret)
    return guess(low, mid, secret)`,
      solution: `1) return -1 is inside the loop — move it after the loop. 2) / gives a float — use //. 3) The recursion never narrows (mid reused) — mid + 1 / mid - 1, or it loops forever.`,
    },
  },
  {
    number: 11, stage: "python", topic: "Python capstone",
    concepts: "planning, multi-file design, everything so far",
    project: "Tic-Tac-Toe with an AI", description: "Two-player, then vs a computer that blocks and wins.",
    stretch: "Make it unbeatable — look up minimax and try.",
    katas: "one 7-kyu; then redo a Week 1 kata and feel the difference",
    days: [
      d(1, "learn", "Plan it", {
        concept: "Board as a list, win-check as a function, players as data.",
        lesson: [fc("Tic Tac Toe project chapter")],
        exercises: ["README.md with the plan", "show_board()", "winner(board, player) — hand-test every line"],
        prove: "Every winning line detected, none falsely.", push: "week-11/",
      }),
      d(2, "build", "Two-player game", {
        concept: "Turns, validation, occupied squares, win and draw.",
        exercises: ["Input 1–9 mapped to index 0–8", "Reject taken squares", "Detect draw"],
        prove: "A complete two-player game. This alone is a milestone — push it.", push: "week-11/",
      }),
      d(3, "build", "The AI, part 1", {
        concept: "Random free square — take a win if one exists.",
        exercises: ["free_squares()", "winning_move(player)", "Play 5 games; log AI mistakes"],
        prove: "It never misses a win.", push: "week-11/",
      }),
      d(4, "build", "The AI, part 2", {
        concept: "Block the human's win; prefer centre, then corners.",
        exercises: ["Block", "Centre/corners preference", "Play until it stops losing carelessly"],
        prove: "You have to work to beat it.", push: "week-11/",
      }),
      d(5, "build", "Polish & ship", {
        concept: "board.py, ai.py, main.py; clean names; docstrings; README.",
        exercises: ["Split files", "Delete dead code", "README: how to play"],
        prove: "STAGE GATE — on the call, explain every function line by line.", push: "week-11/",
      }),
    ],
    drill: {
      code: `board = [" "] * 9

def winner(p):
    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a, b, c in lines:
        if board[a] == board[b] == board[c] == p:
            return True
        return False

turn = "X"
while True:
    move = int(input(f"{turn} move (1-9): "))
    board[move] = turn
    if winner(turn):
        print(turn, "wins")
        break
    turn = "O" if turn == "X" else "X"`,
      solution: `1) return False is inside the loop — dedent it after the loop. 2) Moves 1–9 vs indexes 0–8 — board[move - 1]. 3) Nothing stops taking an occupied square (or detects a draw) — check board[i] == " " first; end when full.`,
    },
  },

  // ———————————————————————— Stage 2 · HTML (12–14) · fCC Responsive Web Design —
  {
    number: 12, stage: "html", topic: "HTML, properly",
    concepts: "the document, attributes, boilerplate, divs/ids/classes, media, links",
    project: "Passion Page", description: "A well-built page about something you love — structure first, looks later.",
    stretch: "A second page and a shared nav.",
    katas: "no katas — view-source two real sites and name the elements you recognise",
    days: [
      d(1, "learn", "Outline & attributes", {
        concept: "You've typed tags before — now learn what a document IS and what attributes do.",
        lesson: [rwd("Build a Curriculum Outline (workshop)", "workshop-curriculum-outline"), rwd("Debug Camperbot's Profile Page (lab)", "lab-debug-camperbots-profile-page"), rwd("Understanding HTML Attributes (theory)", "lecture-understanding-html-attributes"), rwd("Debug a Pet Adoption Page (lab)", "lab-debug-pet-adoption-page")],
        exercises: ["Open the page in devtools — Elements and match the tree to your code"],
        prove: "Both labs passing.", push: "week-12/day-01/",
      }),
      d(2, "learn", "Boilerplate & the Cat Photo App", {
        concept: "doctype, head vs body, link, UTF-8 — then the classic 42-step build.",
        lesson: [rwd("Understanding the HTML Boilerplate (theory)", "lecture-understanding-the-html-boilerplate"), rwd("Build a Cat Photo App (workshop, 42 steps)", "workshop-cat-photo-app")],
        exercises: ["Recreate the Cat Photo App from a blank file WITHOUT the steps"],
        prove: "The from-memory version matches.", push: "week-12/day-02/",
      }),
      d(3, "learn", "Fundamentals & a Bookstore", {
        concept: "div, id, class, entities, script; then the Recipe lab and Bookstore workshop.",
        lesson: [rwd("Build a Recipe Page (lab)", "lab-recipe-page"), rwd("HTML Fundamentals (theory)", "lecture-html-fundamentals"), rwd("Build a Bookstore Page (workshop)", "workshop-bookstore-page")],
        exercises: ["Name three places you used a div — and whether a better element existed"],
        prove: "Recipe lab passing.", push: "week-12/day-03/",
      }),
      d(4, "learn", "SEO, media, links", {
        concept: "Meta description, audio/video, images & SVG, iframes, absolute vs relative paths.",
        lesson: [rwd("Understanding How HTML Affects SEO (theory)", "lecture-understanding-how-html-affects-seo"), rwd("Build a Travel Agency Page (lab)", "lab-travel-agency-page"), rwd("Working with Audio and Video Elements (theory)", "lecture-working-with-audio-and-video-elements"), rwd("Working with Images and SVGs (theory)"), rwd("Working with Links (theory)"), rwd("Basic HTML Review + Quiz", "review-basic-html")],
        exercises: ["Explain relative vs absolute paths out loud", "Take the Basic HTML Quiz"],
        prove: "Quiz passed; Travel Agency lab passing.", push: "week-12/day-04/",
      }),
      d(5, "build", "Build: Passion Page", {
        concept: "Your own page: header, nav, main, images with real alt, footer.",
        exercises: ["About a game/team/band you love", "Validate with the W3C validator — zero errors", "Push it"],
        lesson: [VALIDATOR],
        prove: "Valid HTML you wrote from nothing.", push: "week-12/day-05-passion/",
      }),
    ],
    drill: {
      code: `<html>
<head>
  <title>My Page
</head>
<body>
  <h1>Welcome</h1>
  <p>Read <a href="about.html">about me</p></a>
  <img src="me.jpg">
</body>
</html>`,
      solution: `1) <title> is never closed. 2) <a> and <p> are mis-nested — </a></p>. 3) The image has no alt. (Bonus: no <!DOCTYPE html>, no lang.)`,
    },
  },
  {
    number: 13, stage: "html", topic: "Semantic HTML, forms & tables",
    concepts: "meaningful elements, text/time semantics, forms, labels, tables, validation tools",
    project: "Event Hub + Book Catalog", description: "Two fCC labs that force real semantics and real tables.",
    stretch: "A Survey Form first draft (next week's cert project).",
    katas: "no katas — tab through your form with the keyboard only and fix what's awkward",
    days: [
      d(1, "learn", "Why semantics", {
        concept: "Structure that MEANS something: header/nav/main/article/footer, em vs i, strong vs b, description lists.",
        lesson: [rwd("Importance of Semantic HTML (theory)"), rwd("Understanding Nuanced Semantic Elements (theory)"), rwd("Build a List of Major Web Browsers (workshop)")],
        exercises: ["Rewrite your Passion Page with semantic elements — no div unless you can say why"],
        prove: "Zero unexplained divs.", push: "week-13/day-01/",
      }),
      d(2, "learn", "Text & time semantics", {
        concept: "Quotes, abbreviations, addresses, times; code, math, ruby.",
        lesson: [rwd("Working with Text and Time Semantic Elements (theory)"), rwd("Build Quincy's Job Tips Page (workshop)"), rwd("Working with Specialized Semantic Elements (theory)"), rwd("Build a Cat Blog Page (workshop)")],
        exercises: ["Add a <time> and a <blockquote> with a cite to your page"],
        prove: "Both workshops complete.", push: "week-13/day-02/",
      }),
      d(3, "learn", "Event Hub + review", {
        concept: "Apply semantics without hand-holding.",
        lesson: [rwd("Build an Event Hub (lab)", "lab-event-hub"), rwd("Semantic HTML Review + Quiz", "review-semantic-html")],
        exercises: ["Take the Semantic HTML Quiz"],
        prove: "Lab passing; quiz passed.", push: "week-13/day-03/",
      }),
      d(4, "learn", "Forms & tables", {
        concept: "form, label/for, input types, buttons, client-side validation; tables done right.",
        lesson: [rwd("Working with Forms (theory)"), rwd("Build a Hotel Feedback Form (workshop, 33 steps)"), rwd("Working with Tables (theory)"), rwd("Build a Final Exams Table (workshop)"), rwd("Working with HTML Tools (theory)")],
        exercises: ["Explain why placeholder is not a label"],
        prove: "Hotel Feedback Form complete and keyboard-tabbable in the right order.", push: "week-13/day-04/",
      }),
      d(5, "build", "Build: Book Catalog Table", {
        concept: "A real data table: thead/tbody/th scope/caption.",
        lesson: [rwd("Build a Book Catalog Table (lab)", "lab-book-catalog-table"), rwd("HTML Tables and Forms Review + Quiz", "review-html-tables-and-forms")],
        exercises: ["Lab passing", "Quiz passed", "Push your own copy"],
        prove: "STAGE CHECK — sketch block vs inline from memory.", push: "week-13/day-05-catalog/",
      }),
    ],
    drill: {
      code: `<form>
  <label>Name</label>
  <input type="text">
  <label for="email">Email</label>
  <input type="text" id="mail">
  <input type="submit" value="Send">
</form>`,
      solution: `1) First label isn't linked — for="name" + id="name" (or wrap the input). 2) for="email" doesn't match id="mail". 3) Email should be type="email", and inputs need name attributes or nothing submits.`,
    },
  },
  {
    number: 14, stage: "html", topic: "Accessibility",
    concepts: "screen readers, heading structure, accessible tables/forms, ARIA basics, alt & link text",
    project: "Survey Form — fCC certification project #1", description: "Your first official freeCodeCamp project.",
    stretch: "Checkout Page or Movie Review labs.",
    katas: "no katas — turn on VoiceOver/Narrator and use your survey form with it",
    days: [
      d(1, "learn", "What accessibility is", {
        concept: "Who uses what, and why structure matters to them.",
        lesson: [rwd("Importance of Accessibility and Good HTML Structure (theory)"), rwd("Debug a Coding Journey Blog Page (workshop)")],
        exercises: ["Audit your Passion Page with Lighthouse; fix every flag"],
        prove: "Lighthouse accessibility score ≥ 95 on your page.", push: "week-14/day-01/",
      }),
      d(2, "learn", "Accessible tables & forms", {
        concept: "Labels that are associated; tables with headers and scope.",
        lesson: [rwd("Working with Accessible Tables and Forms (theory)"), rwd("Build a Tech Conference Schedule Table (workshop)"), rwd("Debug a Donation Form (lab)", "lab-debug-donation-form")],
        exercises: ["Explain why every input needs a label"],
        prove: "Lab passing.", push: "week-14/day-02/",
      }),
      d(3, "learn", "ARIA & media", {
        concept: "Roles, aria-label, aria-hidden, aria-describedby; good alt, good link text, keyboard access.",
        lesson: [rwd("Introduction to ARIA (theory)"), rwd("Build an Accessible Audio Controller (workshop)"), rwd("Working with Accessible Media Elements (theory)")],
        exercises: ["Rewrite three bad alt texts and three 'click here' links"],
        prove: "Workshop complete.", push: "week-14/day-03/",
      }),
      d(4, "practice", "Labs + review", {
        concept: "Apply it without hints.",
        lesson: [rwd("Build a Checkout Page (lab)", "lab-checkout-page"), rwd("HTML Accessibility Review + Quiz", "review-html-accessibility"), rwd("HTML Review", "review-html")],
        exercises: ["Checkout lab passing", "Accessibility Quiz passed", "HTML Review read"],
        prove: "Ready for the cert project.", push: "week-14/day-04/",
      }),
      d(5, "build", "Build: Survey Form (cert project)", {
        concept: "Your first freeCodeCamp certification project.",
        lesson: [rwd("Build a Survey Form — Certification Project", "lab-survey-form")],
        exercises: ["All tests passing on fCC", "Valid, labelled, keyboard-friendly", "Copy into your repo"],
        prove: "STAGE GATE — Survey Form passes on fCC; on the call, explain block vs inline and why every label matters.", push: "week-14/day-05-survey/",
      }),
    ],
    drill: {
      code: `<img src="chart.png" alt="image">
<h1>Results</h1>
<h3>By region</h3>
<input type="text" placeholder="Email address">
<a href="report.pdf">click here</a>`,
      solution: `1) alt="image" says nothing — describe the chart (or alt="" if decorative). 2) Heading jumps h1 — h3 — use h2. 3) placeholder is not a label — add a <label for>; and "click here" should say what the link is ("Download the report (PDF)").`,
    },
  },

  // ———————————————————————— Stage 3 · CSS (15–22) · fCC Responsive Web Design —
  {
    number: 15, stage: "css", topic: "CSS fundamentals & design",
    concepts: "rules, selectors, inline/internal/external, width/height, margins & padding, specificity, the cascade, design basics",
    project: "Style the Passion Page", description: "The same HTML, now designed on purpose.",
    stretch: "A dark theme.",
    katas: "no katas — reproduce a simple card from any site, pixel-close",
    days: [
      d(1, "learn", "What CSS is", {
        concept: "Anatomy of a rule, default styles, viewport meta, where CSS lives.",
        lesson: [rwd("What Is CSS? (theory)"), rwd("Design a Cafe Menu (workshop, 89 steps) — first half")],
        exercises: ["Write the same style inline, internal, external — explain when each is right"],
        prove: "Cafe Menu steps 1–45.", push: "week-15/day-01/",
      }),
      d(2, "learn", "Box basics", {
        concept: "Width/height, inline vs block vs inline-block, margin and padding.",
        lesson: [rwd("Design a Cafe Menu (workshop) — finish"), rwd("Design a Business Card (lab)")],
        exercises: ["Make a box exactly 200×100 px including its padding — verify in devtools"],
        prove: "Business Card lab passing.", push: "week-15/day-02/",
      }),
      d(3, "learn", "Specificity & the cascade", {
        concept: "Which rule wins and why; !important is a smell.",
        lesson: [rwd("CSS Specificity, the Cascade Algorithm, and Inheritance (theory)"), rwd("CSS Fundamentals Review + Quiz")],
        exercises: ["Predict the winner of five conflicting rules BEFORE checking — get all five", "Take the quiz"],
        prove: "Quiz passed.", push: "week-15/day-03/",
      }),
      d(4, "learn", "Lists, links, backgrounds, design", {
        concept: "Styling lists and link states; backgrounds and borders; contrast, hierarchy, whitespace.",
        lesson: [rwd("Styling Lists and Links (theory)"), rwd("Build a Stylized To-Do List (lab)"), rwd("Working with Backgrounds and Borders (theory)"), rwd("User Interface Design Fundamentals (theory)"), rwd("User-Centered Design (theory)")],
        exercises: ["Style all four link states on your page", "Design Fundamentals Quiz"],
        prove: "To-Do lab passing.", push: "week-15/day-04/",
      }),
      d(5, "build", "Build: styled Passion Page", {
        concept: "External stylesheet, consistent spacing, deliberate type and colour.",
        exercises: ["External CSS file", "A spacing scale you stick to", "Links, nav, footer styled"],
        prove: "Someone would say 'that looks designed'.", push: "week-15/day-05-passion-styled/",
      }),
    ],
    drill: {
      code: `<style>
  .box { width: 200px; padding: 20px; border: 5px solid; }
  #title { color: #12345; }
  p { font-size: 16; }
</style>
<div class="box"><h1 id="title">Hi</h1><p>Hello</p></div>`,
      solution: `1) The box renders 250px wide (200 + 2×20 + 2×5) — box-sizing: border-box or adjust. 2) #12345 isn't a valid hex colour (3 or 6 digits). 3) font-size: 16 has no unit — 16px / 1rem.`,
    },
  },
  {
    number: 16, stage: "css", topic: "Units, pseudo-classes, colours",
    concepts: "px/%/em/rem/vh/vw/calc, pseudo-classes & pseudo-elements, colour models, gradients",
    project: "Blog Post Card + Greeting Card", description: "Hover states, real units, colours chosen on purpose.",
    stretch: "Job Application Form lab.",
    katas: "no katas — find three pseudo-classes in use on a real site's CSS",
    days: [
      d(1, "learn", "Units", {
        concept: "Absolute vs relative; when rem, when %, when vh; calc().",
        lesson: [rwd("Working with Relative and Absolute Units (theory)"), rwd("Build an Event Flyer Page (lab)"), rwd("CSS Relative and Absolute Units Review + Quiz")],
        exercises: ["Convert your Passion Page font sizes from px to rem", "Quiz"],
        prove: "Flyer lab passing.", push: "week-16/day-01/",
      }),
      d(2, "learn", "Pseudo-classes", {
        concept: ":hover :focus :nth-child :not and friends; ::before / ::after.",
        lesson: [rwd("Working with Pseudo-Classes and Pseudo-Elements in CSS (theory)"), rwd("Design a Greeting Card (workshop)")],
        exercises: ["Zebra-stripe a table with :nth-child", "A visible :focus-visible style on every interactive element"],
        prove: "Greeting Card complete.", push: "week-16/day-02/",
      }),
      d(3, "learn", "Forms with pseudo-classes", {
        concept: ":valid :invalid :required :checked — feedback without JS.",
        lesson: [rwd("Design a Parent Teacher Conference Form (workshop, 37 steps)"), rwd("CSS Pseudo-classes Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Workshop complete.", push: "week-16/day-03/",
      }),
      d(4, "learn", "Colours", {
        concept: "rgb, hsl, hex, named; contrast; gradients; a palette chosen with hsl.",
        lesson: [rwd("Working with Colors in CSS (theory)"), rwd("Build a Set of Colored Markers (workshop, 89 steps)"), rwd("Design a Set of Colored Boxes (lab)"), rwd("CSS Colors Review + Quiz")],
        exercises: ["Build a 5-colour palette in hsl with only hue changing", "Quiz"],
        prove: "Markers complete; Boxes lab passing.", push: "week-16/day-04/",
      }),
      d(5, "build", "Build: Blog Post Card", {
        concept: "A reusable card with hover/focus states and a gradient accent.",
        lesson: [rwd("Design a Blog Post Card (lab)")],
        exercises: ["Lab passing", "Reuse the card on your Passion Page", "Push"],
        prove: "Same card, two places.", push: "week-16/day-05-card/",
      }),
    ],
    drill: {
      code: `a:hover { color: blue; }
a:link  { color: red; }
button:focus { outline: none; }
li:nth-child(0) { font-weight: bold; }`,
      solution: `1) :link comes after :hover with equal specificity, so hover never shows — order LVHA (:link :visited :hover :active). 2) outline: none removes keyboard focus — replace it with a visible :focus-visible style. 3) nth-child is 1-based; (0) matches nothing.`,
    },
  },
  {
    number: 17, stage: "css", topic: "Forms & the box model",
    concepts: "styling inputs, appearance, the box model for real, margin collapse, border-box, resets, transforms, overflow, filters",
    project: "Style the Survey Form", description: "Your cert project, now beautiful.",
    stretch: "Feature Selection Page lab.",
    katas: "no katas — find a form in the wild and list three things its CSS does well",
    days: [
      d(1, "learn", "Styling forms", {
        concept: "Text inputs, appearance: none, the awkward inputs.",
        lesson: [rwd("Best Practices for Styling Forms (theory)"), rwd("Design a Registration Form (workshop, 61 steps) — first half")],
        exercises: ["Style a checkbox with appearance: none — and make it visible again"],
        prove: "Registration Form steps 1–30.", push: "week-17/day-01/",
      }),
      d(2, "learn", "Registration Form, finished", {
        concept: "Finish it; then a settings panel.",
        lesson: [rwd("Design a Registration Form (workshop) — finish"), rwd("Build a Game Settings Panel (workshop)"), rwd("Design a Contact Form (lab)")],
        exercises: ["Contact Form lab passing"],
        prove: "All three done.", push: "week-17/day-02/",
      }),
      d(3, "learn", "The box model, for real", {
        concept: "content/padding/border/margin, margin collapsing, content-box vs border-box, resets.",
        lesson: [rwd("Working with CSS Transforms, Overflow, and Filters (theory)"), rwd("Styling Forms Review + Quiz")],
        exercises: ["Draw the box model on paper", "Demonstrate margin collapse with two boxes", "Add a border-box reset to your stylesheet"],
        prove: "Quiz passed; you can explain margin collapse.", push: "week-17/day-03/",
      }),
      d(4, "learn", "Rothko: transforms & filters", {
        concept: "transform, overflow, filter — used with restraint.",
        lesson: [rwd("Design a Rothko Painting (workshop, 44 steps)"), rwd("Build a Confidential Email Page (lab)"), rwd("CSS Layouts and Effects Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Rothko complete; lab passing.", push: "week-17/day-04/",
      }),
      d(5, "build", "Build: styled Survey Form", {
        concept: "Apply the week to your own cert project.",
        exercises: ["Consistent input styling", "Visible focus", "Looks good at 375px"],
        prove: "Your Survey Form, designed.", push: "week-17/day-05-survey-styled/",
      }),
    ],
    drill: {
      code: `.card { width: 300px; padding: 20px; }
.card input { width: 100%; padding: 12px; border: 2px solid #888; }
.row { margin-bottom: 20px; }
.row + .row { margin-top: 20px; }   /* wanted a 40px gap */
input[type=checkbox] { appearance: none; }`,
      solution: `1) width: 100% + padding + border overflows the card — box-sizing: border-box. 2) Vertical margins collapse; the gap is 20px, not 40 — use one margin, or gap in a flex/grid parent. 3) appearance: none with no replacement styling makes the checkbox invisible — style it.`,
    },
  },
  {
    number: 18, stage: "css", topic: "Flexbox & typography",
    concepts: "flex containers/items, axis, justify/align, wrap, gap, grow; fonts, @font-face, Google Fonts, text-shadow",
    project: "Profile card + nav bar", description: "The two most common flex jobs, plus real typography.",
    stretch: "Page of Playing Cards lab.",
    katas: "no katas — Flexbox Froggy to the end, then explain justify vs align in one sentence",
    days: [
      d(1, "learn", "Flexbox", {
        concept: "Main vs cross axis; justify-content; align-items.",
        lesson: [rwd("Working with CSS Flexbox (theory)"), rwd("Build a Flexbox Photo Gallery (workshop)")],
        exercises: ["Centre a box perfectly in the viewport in three lines"],
        prove: "Gallery complete.", push: "week-18/day-01/",
      }),
      d(2, "learn", "Sizing & wrapping", {
        concept: "flex-grow/shrink/basis, flex: 1, wrap, gap.",
        lesson: [rwd("Design a Set of Colorful Boxes (workshop, 43 steps)")],
        exercises: ["Three equal columns; then one that takes double", "Nav: logo left, links right", "A media object (image left, text right, centred)"],
        prove: "Workshop complete + the three drills.", push: "week-18/day-02/",
      }),
      d(3, "learn", "Flexbox labs", {
        concept: "Apply it without steps.",
        lesson: [rwd("Build a Page of Playing Cards (lab)"), rwd("CSS Flexbox Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-18/day-03/",
      }),
      d(4, "learn", "Typography", {
        concept: "Font families, web-safe fonts, @font-face, Google Fonts, text-shadow, hierarchy.",
        lesson: [rwd("Working with CSS Fonts (theory)"), rwd("Build a Nutritional Label (workshop, 68 steps)"), rwd("Build a Newspaper Article (lab)"), rwd("CSS Typography Review + Quiz")],
        exercises: ["Pick a heading + body font pair and justify it", "Quiz"],
        prove: "Label complete; Newspaper lab passing.", push: "week-18/day-04/",
      }),
      d(5, "build", "Build: profile card + nav", {
        concept: "A homepage skeleton: sticky flex nav, centred profile card, a row of project cards.",
        exercises: ["Sticky nav", "Card with the button pinned to the bottom regardless of text length", "Row that wraps"],
        prove: "The skeleton of your portfolio.", push: "week-18/day-05-skeleton/",
      }),
    ],
    drill: {
      code: `.row { display: flex; justify-items: center; }
.row .item { flex: 1; width: 500px; }
.col { flex-direction: column; align-items: center; }`,
      solution: `1) justify-items isn't flexbox — justify-content. 2) width fights flex: 1 — drop it or use flex-basis. 3) .col never sets display: flex, so nothing applies.`,
    },
  },
  {
    number: 19, stage: "css", topic: "Accessibility & positioning",
    concepts: "contrast tools, hiding content accessibly; floats, relative/absolute/fixed/sticky, z-index",
    project: "Tribute Page — fCC certification project #2", description: "Second official project.",
    stretch: "Build a House Painting lab.",
    katas: "no katas — run a contrast checker on three sites; log the failures",
    days: [
      d(1, "learn", "Accessible CSS", {
        concept: "Contrast tools, visually-hidden done right.",
        lesson: [rwd("Best Practices for Accessibility and CSS (theory)"), rwd("Build a Quiz Webpage (workshop, 67 steps) — first half")],
        exercises: ["Add a .sr-only utility that hides visually but not from screen readers"],
        prove: "Quiz Webpage steps 1–35.", push: "week-19/day-01/",
      }),
      d(2, "learn", "Quiz Webpage, finished", {
        concept: "Finish it; review.",
        lesson: [rwd("Build a Quiz Webpage (workshop) — finish"), rwd("CSS Accessibility Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Workshop complete.", push: "week-19/day-02/",
      }),
      d(3, "learn", "Positioning", {
        concept: "static/relative/absolute/fixed/sticky; z-index; floats (and why flex replaced them).",
        lesson: [rwd("Understanding How to Work with Floats and Positioning in CSS (theory)"), rwd("Build a Cat Painting (workshop, 80 steps) — first half")],
        exercises: ["A badge pinned to a card's corner", "A sticky header", "Explain why absolute needs a positioned parent"],
        prove: "Cat Painting steps 1–40.", push: "week-19/day-03/",
      }),
      d(4, "learn", "Cat Painting, finished", {
        concept: "Finish; lab; review.",
        lesson: [rwd("Build a Cat Painting (workshop) — finish"), rwd("Build a House Painting (lab)"), rwd("CSS Positioning Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-19/day-04/",
      }),
      d(5, "build", "Build: Tribute Page (cert project)", {
        concept: "Second freeCodeCamp certification project.",
        lesson: [rwd("Build a Tribute Page — Certification Project")],
        exercises: ["All fCC tests passing", "Accessible and designed", "Copy into your repo"],
        prove: "Tribute Page passes on fCC.", push: "week-19/day-05-tribute/",
      }),
    ],
    drill: {
      code: `.card  { /* no position */ }
.badge { position: absolute; top: 0; right: 0; }
.modal { z-index: 100; }
.sr-only { display: none; }`,
      solution: `1) .badge positions against the page, not the card — give .card position: relative. 2) z-index does nothing without a position — add position: relative/absolute/fixed. 3) display: none hides from screen readers too — use the clip/1px visually-hidden pattern.`,
    },
  },
  {
    number: 20, stage: "css", topic: "Responsive design & variables",
    concepts: "media queries, breakpoints, mobile-first; custom properties, @property",
    project: "Technical Documentation Page — fCC certification project #3", description: "Third official project.",
    stretch: "Availability Table lab.",
    katas: "no katas — resize three real sites and note where layouts change and why",
    days: [
      d(1, "learn", "Responsive basics", {
        concept: "Media queries, common breakpoints, mobile-first — and the viewport meta.",
        lesson: [rwd("Best Practices for Responsive Web Design (theory)"), rwd("Design a Piano (workshop, 31 steps)"), rwd("Responsive Web Design Review + Quiz")],
        exercises: ["Make your Week 18 skeleton collapse its nav on small screens", "Quiz"],
        prove: "Piano complete.", push: "week-20/day-01/",
      }),
      d(2, "learn", "CSS variables", {
        concept: "Custom properties, fallbacks, theming.",
        lesson: [rwd("Working with CSS Variables (theory)"), rwd("Build a City Skyline (workshop, 115 steps) — first half")],
        exercises: ["Move your colours into :root variables", "A dark theme by swapping variables"],
        prove: "Skyline steps 1–60.", push: "week-20/day-02/",
      }),
      d(3, "learn", "City Skyline, finished", {
        concept: "Finish the skyline; review.",
        lesson: [rwd("Build a City Skyline (workshop) — finish"), rwd("Build an Availability Table (lab)"), rwd("CSS Variables Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-20/day-03/",
      }),
      d(4, "practice", "Responsive drills", {
        concept: "Make everything you've built survive a phone.",
        exercises: ["Images never overflow", "Text scales with clamp()", "Test Passion Page, Survey, Tribute in device mode"],
        prove: "Three pages, right at 375px and 1280px.", push: "week-20/day-04/",
      }),
      d(5, "build", "Build: Technical Documentation Page (cert project)", {
        concept: "Third certification project — a real sidebar-layout doc page.",
        lesson: [rwd("Build a Technical Documentation Page — Certification Project")],
        exercises: ["All fCC tests passing", "Sidebar — stacked on mobile", "Document something you learned in Python"],
        prove: "Passes on fCC; readable on a phone.", push: "week-20/day-05-docs/",
      }),
    ],
    drill: {
      code: `:root { --brand: #46D6DE; }
.btn { background: --brand; }
.title { color: var(--brnad); }
@media (min-width: 600px) { .nav { display: flex; } }
.nav { display: block; }`,
      solution: `1) Using a variable needs var(): background: var(--brand). 2) --brnad is a typo and has no fallback — var(--brand, #46D6DE). 3) The later .nav rule overrides the media query — move it above, or scope it.`,
    },
  },
  {
    number: 21, stage: "css", topic: "Grid",
    concepts: "grid-template, fr, gap, repeat, implicit vs explicit, minmax, grid-area, debugging CSS",
    project: "Product Landing Page — fCC certification project #4, published", description: "Fourth project — and your first one live on the internet.",
    stretch: "Design a Newspaper Layout lab.",
    katas: "no katas — find a site using grid (devtools badge) and sketch its template",
    days: [
      d(1, "learn", "Grid basics", {
        concept: "Columns, fr, gap, repeat, spanning.",
        lesson: [rwd("Working with CSS Grid (theory)"), rwd("Build a Magazine (workshop, 79 steps) — first half")],
        exercises: ["A photo gallery grid", "A 12-column layout with a sidebar"],
        prove: "Magazine steps 1–40.", push: "week-21/day-01/",
      }),
      d(2, "learn", "Magazine, finished", {
        concept: "Finish; areas; minmax; auto-fit.",
        lesson: [rwd("Build a Magazine (workshop) — finish"), rwd("Design a Newspaper Layout (lab)")],
        exercises: ["A card grid that reflows with ZERO media queries (auto-fit + minmax)"],
        prove: "Lab passing.", push: "week-21/day-02/",
      }),
      d(3, "learn", "Debugging CSS + review", {
        concept: "DevTools inspection, CSS validators.",
        lesson: [rwd("Debugging CSS (theory)"), rwd("CSS Grid Review + Quiz")],
        exercises: ["Quiz", "Run your stylesheets through a CSS validator; fix everything"],
        prove: "Zero validator errors across your repo.", push: "week-21/day-03/",
      }),
      d(4, "learn", "Deploy", {
        concept: "GitHub Pages; relative paths; case-sensitive filenames.",
        lesson: [GH_PAGES],
        exercises: ["Turn on Pages for your repo", "Fix every broken image/CSS path", "Send the URL to someone"],
        prove: "Your Passion Page live at a github.io URL.", push: "week-21/day-04/",
      }),
      d(5, "build", "Build: Product Landing Page (cert project)", {
        concept: "Fourth certification project — grid layout, responsive, live.",
        lesson: [rwd("Build a Product Landing Page — Certification Project")],
        exercises: ["All fCC tests passing", "Grid sections, responsive", "Published on Pages"],
        prove: "Passes on fCC and has a real URL.", push: "week-21/day-05-landing/",
      }),
    ],
    drill: {
      code: `.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16; }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
.grid { grid-template-columns: repeat(3, 1fr); }`,
      solution: `1) gap: 16 has no unit — 16px. 2) The later .grid rule overrides the media query — move it above. 3) Nothing changes on a phone without <meta name="viewport" content="width=device-width, initial-scale=1">.`,
    },
  },
  {
    number: 22, stage: "css", topic: "Animations & the portfolio",
    concepts: "@keyframes, animation properties, prefers-reduced-motion, transitions, transforms in motion",
    project: "Personal Portfolio — fCC certification project #5", description: "Fifth project; Responsive Web Design cert earned.",
    stretch: "Attribute Selectors module (Balance Sheet) — optional.",
    katas: "no katas — send your portfolio to two people; collect one piece of feedback each",
    days: [
      d(1, "learn", "Animations", {
        concept: "@keyframes, animation-name/duration/iteration/timing; accessibility and reduced motion.",
        lesson: [rwd("Animations and Accessibility (theory)"), rwd("Build an Animated Ferris Wheel (workshop)")],
        exercises: ["A hover transition on every interactive element", "A reduced-motion rule that disables it"],
        prove: "Ferris Wheel complete and respects reduced motion.", push: "week-22/day-01/",
      }),
      d(2, "learn", "Flappy Penguin", {
        concept: "A bigger animation build.",
        lesson: [rwd("Build a Flappy Penguin (workshop, 104 steps) — first half")],
        exercises: ["Steps 1–52"],
        prove: "Half a penguin.", push: "week-22/day-02/",
      }),
      d(3, "learn", "Flappy Penguin, finished", {
        concept: "Finish; lab; review.",
        lesson: [rwd("Build a Flappy Penguin (workshop) — finish"), rwd("Build a Moon Orbit (lab)"), rwd("CSS Animations Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-22/day-03/",
      }),
      d(4, "practice", "Portfolio content", {
        concept: "Write it like someone who's never met you will read it.",
        exercises: ["A projects section linking every fCC project and your Python repos", "A sentence about each", "A contact link"],
        prove: "A stranger understands what you've built.", push: "week-22/day-04/",
      }),
      d(5, "build", "Build: Personal Portfolio (cert project)", {
        concept: "Fifth certification project — your real portfolio, live.",
        lesson: [rwd("Build a Personal Portfolio — Certification Project"), rwd("CSS Review")],
        exercises: ["All fCC tests passing", "Published", "Claim the Responsive Web Design certificate on fCC"],
        prove: "STAGE GATE — certificate earned; on the call: box model, flex vs grid, one sentence each.", push: "week-22/day-05-portfolio/",
      }),
    ],
    drill: {
      code: `@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360); } }
@media (prefers-reduced-motion) { .wheel { animation: none; } }
.wheel { animation: spin 2s; }`,
      solution: `1) rotate(360) needs a unit — rotate(360deg). 2) The animation runs once and stops — add infinite (and linear). 3) The reduced-motion rule is overridden by the later .wheel rule — put it after, and write the feature as (prefers-reduced-motion: reduce).`,
    },
  },

  // ———————————————————————— Stage 4 · JavaScript (23–36) · fCC JavaScript —————
  {
    number: 23, stage: "javascript", topic: "Variables & strings",
    concepts: "let/const, data types, strings, immutability, template literals, string methods — Python logic in new clothes",
    project: "Profile card, remixed", description: "Your Week 1 Python program, in JavaScript.",
    stretch: "Sentence Maker lab.",
    katas: "two 8-kyu JS katas you already solved in Python",
    days: [
      d(1, "learn", "Introduction", {
        concept: "What JS is; types; variables; let vs const; strings; console.log.",
        lesson: [fjs("Introduction to JavaScript (theory)", "lecture-introduction-to-javascript"), fjs("Introduction to Strings (theory)"), fjs("Understanding Code Clarity (theory)"), fjs("Build a Greeting Bot (workshop)")],
        exercises: ["Write the Python version next to each JS line you learn today"],
        prove: "Greeting Bot complete.", push: "week-23/day-01/",
      }),
      d(2, "learn", "Trivia bot & data types", {
        concept: "Dynamic typing, typeof, the typeof null bug.",
        lesson: [fjs("Build a JavaScript Trivia Bot (lab)", "lab-javascript-trivia-bot"), fjs("Working with Data Types (theory)"), fjs("JavaScript Variables and Data Types Review + Quiz", "review-javascript-variables-and-data-types")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-23/day-02/",
      }),
      d(3, "learn", "Strings", {
        concept: "Bracket notation, escapes, template literals, indexOf, prompt().",
        lesson: [fjs("Working with Strings in JavaScript (theory)"), fjs("Build a Teacher Chatbot (workshop)"), fjs("Working with String Character Methods (theory)"), fjs("Working with String Search and Slice Methods (theory)"), fjs("Build a String Inspector (workshop)")],
        exercises: ["Reverse a string (Python way, then a JS way)", "Count vowels"],
        prove: "Both workshops complete.", push: "week-23/day-03/",
      }),
      d(4, "learn", "More strings", {
        concept: "Casing, trim, replace, repeat.",
        lesson: [fjs("Working with String Formatting Methods (theory)"), fjs("Build a String Formatter (workshop)"), fjs("Working with String Modification Methods (theory)"), fjs("Build a String Transformer (workshop)"), fjs("JavaScript Strings Review + Quiz", "review-javascript-strings")],
        exercises: ["Quiz"],
        prove: "Both workshops complete.", push: "week-23/day-04/",
      }),
      d(5, "build", "Build: profile card remix", {
        concept: "Week 1, in JS: prompt, template literals, uppercase + reversed.",
        lesson: [fjs("Build a Sentence Maker (lab)", "lab-sentence-maker")],
        exercises: ["Lab passing", "Your profile card in the browser console"],
        prove: "Same program, two languages — explain what transferred.", push: "week-23/day-05-profile.js",
      }),
    ],
    drill: {
      code: `let greeting = "Hi " + name;
const name = "Sam";
console.log(greeting.lenght);
let s = "hello";
s[0] = "H";
console.log(s);`,
      solution: `1) name is used before it's declared (const isn't hoisted usably) — declare it first. 2) .lenght is a typo — .length. 3) Strings are immutable; s[0] = "H" does nothing — build a new string: "H" + s.slice(1).`,
    },
  },
  {
    number: 24, stage: "javascript", topic: "Numbers, booleans, functions",
    concepts: "arithmetic, coercion, precedence, comparisons, conditionals, Math, functions, arrow functions, scope",
    project: "Guessing Game — JS remix", description: "Week 2's game, in the console.",
    stretch: "Limit tries; hint after three wrong.",
    katas: "two 8-kyu number katas",
    days: [
      d(1, "learn", "Numbers & operators", {
        concept: "Number type, arithmetic, what happens with numbers + strings, precedence, ++/--, compound assignment.",
        lesson: [fjs("Working with Numbers and Arithmetic Operators (theory)"), fjs("Working with Operator Behavior (theory)"), fjs("Debug Type Coercion Errors in a Buggy App (lab)"), fjs("Debug Increment and Decrement Operator Errors in a Buggy App (lab)")],
        exercises: ["Predict 10 coercion results ('5' + 3, '5' - 3, …) before running"],
        prove: "Both labs passing.", push: "week-24/day-01/",
      }),
      d(2, "learn", "Comparisons & conditionals", {
        concept: "Booleans, === vs ==, comparison operators, if/else if/else, logical operators, Math, switch.",
        lesson: [fjs("Working with Comparison and Boolean Operators (theory)"), fjs("Build a Logic Checker App (workshop)"), fjs("Working with Conditional Logic and Math Methods (theory)"), fjs("Build a Mathbot (workshop)"), fjs("Understanding Comparisons and Conditionals (theory)")],
        exercises: ["FizzBuzz", "Leap year", "Grade calculator with input validation"],
        prove: "Both workshops complete.", push: "week-24/day-02/",
      }),
      d(3, "learn", "Number methods + review", {
        concept: "isNaN, parseInt/parseFloat, toFixed; reviews and quizzes.",
        lesson: [fjs("Working with Numbers and Common Number Methods (theory)"), fjs("Build a Fortune Teller (lab)"), fjs("JavaScript Math Review + Quiz"), fjs("JavaScript Comparisons and Conditionals Review + Quiz")],
        exercises: ["Both quizzes"],
        prove: "Lab passing.", push: "week-24/day-03/",
      }),
      d(4, "learn", "Functions", {
        concept: "Purpose, arrow functions, global/local/block scope.",
        lesson: [fjs("Working with Functions (theory)"), fjs("Build a Calculator (workshop, 19 steps)"), fjs("Build a Loan Qualification Checker (workshop)"), fjs("Build a Celsius to Fahrenheit Converter (lab)"), fjs("JavaScript Functions Review + Quiz")],
        exercises: ["largest-of-three without Math.max", "Quiz"],
        prove: "Calculator workshop complete — compare it to your Python calculator.", push: "week-24/day-04/",
      }),
      d(5, "build", "Build: guessing game", {
        concept: "prompt, loops, conditionals, validation.",
        exercises: ["Computer picks 1–100", "Higher/lower, count guesses", "Reject nonsense"],
        prove: "Works in the console; explain what bit you coming from Python.", push: "week-24/day-05-guess.js",
      }),
    ],
    drill: {
      code: `let score = "10";
score = score + 5;
console.log(score);
const limit = 15;
limit = 20;
if (score = 15) { console.log("fifteen"); }`,
      solution: `1) "10" + 5 is "105" — Number(score) first. 2) Can't reassign a const. 3) = assigns; you meant ===.`,
    },
  },
  {
    number: 25, stage: "javascript", topic: "Arrays & objects",
    concepts: "arrays, common methods, 2D arrays, destructuring; objects, nested access, JSON, optional chaining",
    project: "Quote Machine", description: "A page, a button, a random quote from an array of objects.",
    stretch: "Filter by author; copy to clipboard.",
    katas: "two 8-kyu array katas",
    days: [
      d(1, "learn", "Arrays", {
        concept: "Access/update, push/pop/shift/unshift, 2D arrays, destructuring, reverse a string.",
        lesson: [fjs("Working with Arrays (theory)"), fjs("Build a Shopping List (workshop, 20 steps)"), fjs("Build a Lunch Picker Program (lab)")],
        exercises: ["Your Week 4 list drills, in JS"],
        prove: "Lab passing.", push: "week-25/day-01/",
      }),
      d(2, "learn", "Array methods", {
        concept: "indexOf, splice, includes, shallow copies.",
        lesson: [fjs("Working with Common Array Methods (theory)"), fjs("Build a Golf Score Translator (lab)"), fjs("JavaScript Arrays Review + Quiz")],
        exercises: ["Quiz", "Demonstrate a shallow-copy bug, then fix it"],
        prove: "Lab passing.", push: "week-25/day-02/",
      }),
      d(3, "learn", "Objects", {
        concept: "Properties, removing, checking, nested access, primitives vs objects, methods.",
        lesson: [fjs("Introduction to JavaScript Objects and Their Properties (theory)"), fjs("Build a Wildlife Tracker (workshop)"), fjs("Build a Cargo Manifest Validator (lab)")],
        exercises: ["Your Week 5 phone book, in JS"],
        prove: "Lab passing.", push: "week-25/day-03/",
      }),
      d(4, "learn", "JSON & destructuring", {
        concept: "JSON.parse/stringify, optional chaining, object destructuring.",
        lesson: [fjs("Working with JSON (theory)"), fjs("Working with Optional Chaining and Object Destructuring (theory)"), fjs("Build a Recipe Tracker (workshop)"), fjs("Build a Quiz Game (lab)"), fjs("JavaScript Objects Review + Quiz")],
        exercises: ["Quiz", "Your Python quiz data as an array of objects"],
        prove: "Quiz Game lab passing.", push: "week-25/day-04/",
      }),
      d(5, "build", "Build: Quote Machine", {
        concept: "An HTML page + an array of objects + a button (a peek at the DOM; Week 28 explains it).",
        exercises: ["quotes = [{text, author}, …]", "Button picks one at random", "Shows it on the page"],
        prove: "A real page that changes when you click.", push: "week-25/day-05-quotes/",
      }),
    ],
    drill: {
      code: `const nums = [1, 2, 3];
nums.push(4);
console.log(nums.length());
const doubled = nums.map(n => { n * 2 });
console.log(nums[nums.length]);`,
      solution: `1) length is a property — nums.length. 2) Arrow with braces needs return — n => n * 2. 3) Last index is length — 1.`,
    },
  },
  {
    number: 26, stage: "javascript", topic: "Loops",
    concepts: "for, for…of, for…in, while/do…while, break/continue, loops over data",
    project: "Sentence Analyzer + FizzBuzz suite", description: "fCC's loop workshops plus your Python loop drills re-done in JS.",
    stretch: "Heritage Library Catalog workshop.",
    katas: "two 8-kyu loop katas",
    days: [
      d(1, "learn", "Loops", {
        concept: "Every loop type and when to use each.",
        lesson: [fjs("Working with Loops (theory)"), fjs("Build a Word Counter (workshop)"), fjs("Build a Sentence Analyzer (workshop)")],
        exercises: ["FizzBuzz", "Times-table grid to the console"],
        prove: "Both workshops complete.", push: "week-26/day-01/",
      }),
      d(2, "learn", "Space Mission Roster", {
        concept: "A bigger loop-driven build.",
        lesson: [fjs("Build a Traffic Light Sequencer (lab)"), fjs("Build a Space Mission Roster (workshop, 32 steps)")],
        exercises: ["Nested loops: every unique pair from an array"],
        prove: "Workshop complete; lab passing.", push: "week-26/day-02/",
      }),
      d(3, "practice", "Loop labs", {
        concept: "Pick three labs; no hints.",
        lesson: [fjs("Build a Longest Word Finder App (lab)"), fjs("Build a Factorial Calculator (lab)"), fjs("Implement the Chunky Monkey Algorithm (lab)"), fjs("Build a Missing Letter Detector (lab)")],
        exercises: ["Three labs passing"],
        prove: "Each solved with a clean function.", push: "week-26/day-03/",
      }),
      d(4, "learn", "Festival simulator + review", {
        concept: "State changing inside loops.",
        lesson: [fjs("Build a Festival Crowd Flow Simulator (workshop, 33 steps)"), fjs("JavaScript Loops Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Workshop complete.", push: "week-26/day-04/",
      }),
      d(5, "build", "Build: Sentence Analyzer +", {
        concept: "Your own text tool: word count, longest word, vowel count, palindrome check — from a page textarea.",
        exercises: ["A textarea and a button", "Results rendered on the page", "Handles empty input"],
        prove: "Paste a paragraph; get real stats.", push: "week-26/day-05-analyzer/",
      }),
    ],
    drill: {
      code: `const arr = [3, 1, 2];
for (let i = 0; i <= arr.length; i++) console.log(arr[i]);
for (const i in arr) total += i;
let n = 0;
while (n < 5) { console.log(n); }`,
      solution: `1) <= runs one past the end (undefined) — use <. 2) for…in gives string KEYS ("0","1"), so total becomes text — use for…of to get values. 3) n never changes — infinite loop; n++.`,
    },
  },
  {
    number: 27, stage: "javascript", topic: "Fundamentals review & higher-order functions",
    concepts: "closures, naming, linters; callbacks, map/filter/reduce, sort, every/some, chaining",
    project: "Password Generator — JS", description: "Your Week 6 project in JS — fCC has the exact lab.",
    stretch: "Inventory Management Program lab.",
    katas: "two 8-kyu array katas — solve with a loop AND with map/filter",
    days: [
      d(1, "learn", "Fundamentals review", {
        concept: "String objects, toString, Number(), naming, closures, memory, linters.",
        lesson: [fjs("Working with Types and Objects (theory)"), fjs("Working with Arrays, Variables, and Naming Practices (theory)"), fjs("Working with Code Quality and Execution Concepts (theory)"), fjs("Build a Gradebook App (lab)")],
        exercises: ["makeCounter() — two counters that don't share"],
        prove: "Lab passing; explain a closure in one sentence.", push: "week-27/day-01/",
      }),
      d(2, "learn", "Review labs", {
        concept: "Pick three; no hints.",
        lesson: [fjs("Build a Pyramid Generator (lab)"), fjs("Build the Largest Number Finder (lab)"), fjs("Build a Title Case Converter (lab)"), fjs("JavaScript Fundamentals Review + Quiz")],
        exercises: ["Three labs", "Quiz"],
        prove: "Quiz passed.", push: "week-27/day-02/",
      }),
      d(3, "learn", "Higher-order functions", {
        concept: "Callbacks, forEach, map, filter, reduce, sort, every/some, chaining.",
        lesson: [fjs("Working with Higher Order Functions and Callbacks (theory)"), fjs("Build a Library Manager (workshop)")],
        exercises: ["Names of everyone over 80 in one line", "Their average with reduce", "Sort objects by a field"],
        prove: "Workshop complete.", push: "week-27/day-03/",
      }),
      d(4, "practice", "HOF labs", {
        concept: "Apply without hints.",
        lesson: [fjs("Build a Book Organizer (lab)"), fjs("Implement a Falsy Remover (lab)"), fjs("Implement a Matching Object Filter (lab)"), fjs("JavaScript Higher Order Functions Review + Quiz")],
        exercises: ["Three labs", "Quiz"],
        prove: "Rewrite one of your loop solutions with map/filter — which reads better?", push: "week-27/day-04/",
      }),
      d(5, "build", "Build: Password Generator (JS)", {
        concept: "Arrays, random, HOFs — and compare to your Python version.",
        lesson: [fjs("Build a Password Generator App (lab)")],
        exercises: ["Lab passing", "Add your strength checker", "Push"],
        prove: "Same project, two languages — which design was better?", push: "week-27/day-05-password/",
      }),
    ],
    drill: {
      code: `const names = users.map(u => { u.name });
const nums = [10, 9, 1];
nums.sort();
const total = [].reduce((a, b) => a + b);`,
      solution: `1) Arrow with braces needs return — u => u.name. 2) sort() with no comparator sorts as strings — [1, 10, 9]; use (a, b) => a - b. 3) reduce on an empty array with no initial value throws — pass 0.`,
    },
  },
  {
    number: 28, stage: "javascript", topic: "The DOM I",
    concepts: "what the DOM is, selecting, creating, changing text/attributes/classes, the Event object, addEventListener",
    project: "Theme Switcher", description: "Buttons that restyle the page live — and fCC has this exact lab.",
    stretch: "Favorite Icon Toggler lab.",
    katas: "one 8-kyu; then change a real page's heading from the console",
    days: [
      d(1, "learn", "The DOM", {
        concept: "APIs, the DOM tree, querySelector/All, innerHTML vs createElement, innerText vs textContent vs innerHTML.",
        lesson: [fjs("Working with the DOM, Click Events, and Web APIs (theory) — first half")],
        exercises: ["Change your Passion Page's heading and every link's text from JS", "Explain why the script goes at the end (or defer)"],
        prove: "You can read the DOM tree in devtools and name the nodes.", push: "week-28/day-01/",
      }),
      d(2, "learn", "Events & styles", {
        concept: "setAttribute, the Event object, addEventListener/remove, inline handlers (why not), style vs classList, DOMContentLoaded, timers.",
        lesson: [fjs("Working with the DOM, Click Events, and Web APIs (theory) — finish"), fjs("Build a Storytelling App (workshop)")],
        exercises: ["A button that toggles a 'dark' class on body — CSS does the rest"],
        prove: "Workshop complete.", push: "week-28/day-02/",
      }),
      d(3, "learn", "DOM labs I", {
        concept: "Apply it.",
        lesson: [fjs("Build a Favorite Icon Toggler (lab)"), fjs("Build a Real Time Counter (lab)")],
        exercises: ["Render your quiz questions to the page FROM data"],
        prove: "Both labs passing.", push: "week-28/day-03/",
      }),
      d(4, "learn", "DOM labs II + review", {
        concept: "More building.",
        lesson: [fjs("Build a Lightbox Viewer (lab)"), fjs("Build a Set of Football Team Cards (lab)"), fjs("DOM Manipulation and Click Events Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Labs passing.", push: "week-28/day-04/",
      }),
      d(5, "build", "Build: Theme Switcher", {
        concept: "Themes as an array; buttons generated from it; choice persisted (look up localStorage — Week 31 covers it).",
        lesson: [fjs("Build a Theme Switcher (lab)")],
        exercises: ["Lab passing", "Your own version on your portfolio", "Persists on reload"],
        prove: "Your portfolio has a working theme switcher.", push: "week-28/day-05-theme/",
      }),
    ],
    drill: {
      code: `<h1 id="title">Hi</h1>
<script>
  const el = document.getElementById("#title");
  el.textContent = "Hello";
  const btn = document.querySelector("button");
  btn.textContent = "Go";
  document.getElementsByClassName("card").textContent = "x";
</script>
<button>Click</button>
<p class="card"></p>`,
      solution: `1) getElementById takes the id without # — "title". 2) The script runs before the button exists — move it to the end of body or add defer. 3) getElementsByClassName returns a collection — [0], or querySelector(".card").`,
    },
  },
  {
    number: 29, stage: "javascript", topic: "The DOM II — events & accessibility",
    concepts: "change events, bubbling, delegation, keyboard; ARIA states for dynamic content",
    project: "Web Calculator", description: "Your calculator, now with real buttons and keyboard support.",
    stretch: "A history panel you can click to reuse a result.",
    katas: "one 8-kyu; bind a keyboard shortcut to something on your portfolio",
    days: [
      d(1, "learn", "Events, properly", {
        concept: "change, bubbling, delegation — one listener for many children.",
        lesson: [fjs("Build an Emoji Reactor (workshop)"), fjs("Understanding the Event Object and Event Delegation (theory)"), fjs("Build a Music Instrument Filter (workshop)")],
        exercises: ["A live character counter under a textarea", "An on-screen keypad driven by clicks AND real keys"],
        prove: "Both workshops complete.", push: "week-29/day-01/",
      }),
      d(2, "learn", "Rock Paper Scissors — the fCC version", {
        concept: "Your Week 2 game, as a web page.",
        lesson: [fjs("Build a Rock, Paper, Scissors Game (workshop)"), fjs("DOM Manipulation and Click Events with JavaScript Review + Quiz")],
        exercises: ["Quiz", "Compare with your Python RPS: what moved into the DOM?"],
        prove: "Workshop complete.", push: "week-29/day-02/",
      }),
      d(3, "learn", "JS & accessibility", {
        concept: "aria-expanded, aria-live, aria-controls, common ARIA states; accessible dynamic content.",
        lesson: [fjs("Understanding aria-expanded, aria-live, and Common ARIA States (theory)"), fjs("Build a Planets Tablist (workshop)")],
        exercises: ["Make your theme switcher announce its change with aria-live"],
        prove: "Workshop complete.", push: "week-29/day-03/",
      }),
      d(4, "learn", "Note-taking app + review", {
        concept: "A bigger accessible build.",
        lesson: [fjs("Build a Note Taking App (workshop)"), fjs("JavaScript and Accessibility Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Workshop complete.", push: "week-29/day-04/",
      }),
      d(5, "build", "Build: Web Calculator", {
        concept: "Buttons + keyboard; one function per operation; division by zero handled; clear/backspace.",
        exercises: ["Event delegation on the keypad", "keydown support", "Accessible: focusable, announced"],
        prove: "Usable with mouse, keyboard, and a screen reader.", push: "week-29/day-05-calculator/",
      }),
    ],
    drill: {
      code: `<button id="go">Go</button>
<script>
  const btn = document.getElementById("go");
  btn.addEventListener("click", greet());
  function greet() { alert("hi"); }
  btn.onClick = () => console.log("clicked");
  document.addEventListener("keydown", (e) => { if (e.key == "enter") greet(); });
</script>`,
      solution: `1) greet() runs immediately — pass the function: addEventListener("click", greet). 2) onClick isn't a thing — onclick, or better addEventListener. 3) e.key is "Enter" with a capital E.`,
    },
  },
  {
    number: 30, stage: "javascript", topic: "Form validation",
    concepts: "validating with JS, preventDefault, the submit event, error messaging",
    project: "Validated To-Do input", description: "The front door of next week's persistent to-do, done right.",
    stretch: "Customer Complaint Form lab.",
    katas: "one 8-kyu; then try to break three real sign-up forms and note what they get right",
    days: [
      d(1, "learn", "Validation", {
        concept: "Ways to validate, preventDefault, the submit event.",
        lesson: [fjs("Understanding Form Validation (theory)"), fjs("Build an Envelope Budget App (workshop, 98 steps) — steps 1–33")],
        exercises: ["Your Survey Form: show a summary on the page instead of navigating away"],
        prove: "Steps 1–33.", push: "week-30/day-01/",
      }),
      d(2, "learn", "Envelope Budget App II", {
        concept: "Keep going — this is a big build.",
        lesson: [fjs("Build an Envelope Budget App (workshop) — steps 34–66")],
        exercises: ["A form that disables submit until valid"],
        prove: "Steps 34–66.", push: "week-30/day-02/",
      }),
      d(3, "learn", "Envelope Budget App III", {
        concept: "Finish.",
        lesson: [fjs("Build an Envelope Budget App (workshop) — steps 67–98")],
        exercises: ["Explain what preventDefault stops"],
        prove: "Workshop complete.", push: "week-30/day-03/",
      }),
      d(4, "practice", "Lab + review", {
        concept: "Apply.",
        lesson: [fjs("Build a Customer Complaint Form (lab)"), fjs("Form Validation with JavaScript Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-30/day-04/",
      }),
      d(5, "build", "Build: validated to-do input", {
        concept: "An add-task form with inline errors, cleared on fix, submit blocked until valid.",
        exercises: ["Empty / too-long / duplicate rejected", "Errors announced (aria-live)", "Enter submits"],
        prove: "You can't add a bad task.", push: "week-30/day-05-todo-form/",
      }),
    ],
    drill: {
      code: `form.addEventListener("submit", () => { validate(); });
if (!email.value.includes("@")) { errorEl.textContent = "Bad email"; }
input.required = "false";`,
      solution: `1) No event parameter and no preventDefault — the page reloads: (e) => { e.preventDefault(); … }. 2) The error is never cleared on success — set errorEl.textContent = "" in the valid branch. 3) "false" is a non-empty string, which is truthy — input.required = false.`,
    },
  },
  {
    number: 31, stage: "javascript", topic: "localStorage & CRUD",
    concepts: "CRUD, localStorage/sessionStorage, cookies (awareness), state → render",
    project: "Persistent To-Do", description: "fCC's workshop is literally this; then your own version.",
    stretch: "Bookmark Manager lab.",
    katas: "one 8-kyu; inspect what your portfolio keeps in localStorage",
    days: [
      d(1, "learn", "Client-side storage", {
        concept: "CRUD, localStorage methods, sessionStorage, cookies, the anti-patterns.",
        lesson: [fjs("Working with Client-Side Storage and CRUD Operations (theory)"), fjs("Build a Todo App using Local Storage (workshop, 66 steps) — steps 1–22")],
        exercises: ["Store and read back an object (stringify/parse)", "Handle 'nothing saved yet'"],
        prove: "Steps 1–22.", push: "week-31/day-01/",
      }),
      d(2, "learn", "Todo workshop II", {
        concept: "Continue.",
        lesson: [fjs("Build a Todo App using Local Storage (workshop) — steps 23–44")],
        exercises: ["Explain state → render in one sentence"],
        prove: "Steps 23–44.", push: "week-31/day-02/",
      }),
      d(3, "learn", "Todo workshop III", {
        concept: "Finish.",
        lesson: [fjs("Build a Todo App using Local Storage (workshop) — finish"), fjs("Local Storage and CRUD Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Workshop complete.", push: "week-31/day-03/",
      }),
      d(4, "practice", "Bookmark manager", {
        concept: "Apply without hints.",
        lesson: [fjs("Build a Bookmark Manager App (lab)")],
        exercises: ["Lab passing"],
        prove: "Your second CRUD app.", push: "week-31/day-04/",
      }),
      d(5, "build", "Build: YOUR persistent To-Do", {
        concept: "Full CRUD, filters, count remaining, your Week 30 validated input, persisted — clean state → render.",
        exercises: ["One state array, one render()", "Filters all/active/done", "Survives refresh"],
        prove: "Compare with the Python to-do from Week 8 — what's the same idea?", push: "week-31/day-05-todo/",
      }),
    ],
    drill: {
      code: `const todos = ["milk"];
localStorage.setItem("todos", todos);
const saved = localStorage.getItem("todos");
saved.push("eggs");
render();`,
      solution: `1) localStorage stores strings — JSON.stringify(todos). 2) getItem returns a string — JSON.parse before push. 3) Pushing to saved doesn't change todos or re-save — update the one state array, save, then render.`,
    },
  },
  {
    number: 32, stage: "javascript", topic: "Debugging, dates, timers",
    concepts: "common errors, throw, try/catch/finally, debugger; the Date object; setTimeout/setInterval in anger",
    project: "Whack-a-Mole", description: "Moles pop randomly; click for points before time runs out.",
    stretch: "Difficulty levels; best-score board.",
    katas: "one 8-kyu; from now on ALSO one Clash of Code round per week",
    days: [
      d(1, "learn", "Debugging", {
        concept: "Common errors, throw, try/catch/finally, the debugger statement, devtools breakpoints.",
        lesson: [fjs("Debugging Techniques (theory)"), fjs("Debug a Random Background Color Changer (lab)"), fjs("Debugging JavaScript Review + Quiz")],
        exercises: ["Set a breakpoint in your to-do and step through a click", "Quiz"],
        prove: "Lab passing; you can step through code.", push: "week-32/day-01/",
      }),
      d(2, "learn", "Dates", {
        concept: "The Date object, formatting.",
        lesson: [fjs("Working with Dates (theory)"), fjs("Build a Date Conversion Program (lab)"), fjs("JavaScript Dates Review + Quiz")],
        exercises: ["Days until your birthday (Week 9, in JS)", "Quiz"],
        prove: "Lab passing.", push: "week-32/day-02/",
      }),
      d(3, "learn", "Timers", {
        concept: "setTimeout vs setInterval, clearing, passing functions not calls; a 10-second countdown with pause/resume.",
        exercises: ["A light that jumps to a random square every 0.5–1.5 s", "start/stop that never double-starts"],
        prove: "Countdown with pause/resume that doesn't drift.", push: "week-32/day-03/",
      }),
      d(4, "practice", "Game state", {
        concept: "idle → running → over; what each button does in each state; why a stray timer is a bug.",
        exercises: ["Score that counts a mole once", "A visible time bar", "A game-over overlay"],
        prove: "Log every timing bug — there'll be several.", push: "week-32/day-04/",
      }),
      d(5, "build", "Build: Whack-a-Mole", {
        concept: "Grid of holes, random pops, click scoring, 30-second round, best score saved.",
        exercises: ["Timers cleaned up on game over", "Best score in localStorage", "Keyboard-playable (numbers 1–9)"],
        prove: "A friend plays it twice.", push: "week-32/day-05-whack/",
      }),
    ],
    drill: {
      code: `let score = 0;
setInterval(popMole, 1000);
function popMole() {
  const hole = holes[Math.floor(Math.random() * holes.length + 1)];
  hole.classList.add("up");
  setTimeout(hole.classList.remove("up"), 800);
}`,
      solution: `1) + 1 pushes the index past the end sometimes — Math.floor(Math.random() * holes.length). 2) setTimeout needs a function — () => hole.classList.remove("up"). 3) The interval is never cleared — store it and clearInterval on game over.`,
    },
  },
  {
    number: 33, stage: "javascript", topic: "Classes",
    concepts: "class, constructor, this, methods, inheritance, static; modules in the browser",
    project: "Pomodoro with a Timer class", description: "A 25/5 study timer built around a class, split into modules.",
    stretch: "Custom durations; a chime when a session ends.",
    katas: "one 7-kyu; one Clash round",
    days: [
      d(1, "learn", "Classes", {
        concept: "What a class is, this, methods.",
        lesson: [fjs("Understanding How to Work with Classes in JavaScript (theory)"), fjs("Build a Shopping Cart (workshop, 61 steps) — steps 1–30")],
        exercises: ["A BankAccount class from your Python Week 7 bank"],
        prove: "Steps 1–30.", push: "week-33/day-01/",
      }),
      d(2, "learn", "Shopping Cart, finished", {
        concept: "Inheritance, static; finish.",
        lesson: [fjs("Build a Shopping Cart (workshop) — finish"), fjs("Build a Project Idea Board (lab)"), fjs("JavaScript Classes Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-33/day-02/",
      }),
      d(3, "learn", "Modules & time", {
        concept: "type='module', one file per concern; formatting mm:ss with padStart; avoiding drift.",
        lesson: [fjs("Understanding Modules, Imports, and Exports (theory)")],
        exercises: ["timer.js (a Timer class), ui.js (DOM), main.js (wiring)", "A display that reads 24:59, 24:58… correctly"],
        prove: "Three files, one app.", push: "week-33/day-03/",
      }),
      d(4, "practice", "Timer drills", {
        concept: "Pause/resume without losing time; work/break toggle; persisted session count.",
        exercises: ["Pause/resume", "Toggle", "Sessions saved"],
        prove: "No drift over 5 minutes (check against your phone).", push: "week-33/day-04/",
      }),
      d(5, "build", "Build: Pomodoro", {
        concept: "Work/break cycles, start/pause/reset, sessions counted and saved, a Timer class, modules.",
        exercises: ["Class-based", "Accessible controls", "Looks right on a phone"],
        prove: "Use it for your own next session.", push: "week-33/day-05-pomodoro/",
      }),
    ],
    drill: {
      code: `class Timer {
  constructor(sec) { seconds = sec; }
  start() {
    setInterval(function () { this.seconds--; }, 1000);
  }
}
const t = Timer(60);`,
      solution: `1) seconds = sec sets a global, not the instance — this.seconds = sec. 2) Inside function () { }, this isn't the Timer — use an arrow: () => { this.seconds--; }. 3) Classes need new: new Timer(60).`,
    },
  },
  {
    number: 34, stage: "javascript", topic: "Big build I — Memory Game",
    concepts: "planning a real project, Fisher-Yates shuffle, matching logic, locking input, state machines",
    project: "Memory Game — build", description: "Card grid: flip two, match pairs, count moves. Your biggest build yet.",
    stretch: "Your own card theme.",
    katas: "one Clash round — screenshot one you lost for the call",
    days: [
      d(1, "learn", "Plan it", {
        concept: "Cards as data (id, value, flipped, matched); state machine (0/1/2 up); what render() draws.",
        exercises: ["README.md plan", "A static grid rendered from data", "Decide the class/module structure"],
        prove: "A plan someone could build from.", push: "week-34/",
      }),
      d(2, "build", "Shuffle & flip", {
        concept: "Fisher-Yates (look up why sort(Math.random) is wrong); click flips; same-card double click ignored.",
        exercises: ["shuffle()", "flip(card)", "Ignore already-flipped"],
        prove: "Every shuffle is fair; no double-flip bug.", push: "week-34/",
      }),
      d(3, "build", "Matching", {
        concept: "Two up: match → stay; no match → flip back after a delay; input locked during the delay.",
        exercises: ["Lock", "Delay", "Reset the 'first' card"],
        prove: "Log the bugs — this step has the most.", push: "week-34/",
      }),
      d(4, "build", "Score & win", {
        concept: "Move counter, matched count, win detection, restart.",
        exercises: ["Moves", "Win screen", "Restart re-shuffles"],
        prove: "Play to the end five times, no glitches.", push: "week-34/",
      }),
      d(5, "build", "Checkpoint", {
        concept: "Refactor: state → render, small functions, no dead code, comments that explain why.",
        exercises: ["Refactor", "Delete dead code", "Push"],
        prove: "Next week: polish and ship.", push: "week-34/",
      }),
    ],
    drill: {
      code: `const cards = ["A","A","B","B"];
cards.sort(() => Math.random());
let first = null;
function flip(card) {
  card.classList.add("flipped");
  if (first === null) { first = card; }
  else if (first.dataset.value === card.dataset.value) { console.log("match"); }
  else { first.classList.remove("flipped"); card.classList.remove("flipped"); }
}`,
      solution: `1) The comparator must return negative/positive — and even Math.random() - 0.5 is biased; use Fisher-Yates. 2) first is never reset after the second card — first = null after handling. 3) Clicking the same card twice matches it with itself — ignore clicks on a flipped card. (Also delay the flip-back so the player sees it.)`,
    },
  },
  {
    number: 35, stage: "javascript", topic: "Big build II — ship it",
    concepts: "timers, best times, animation, testing with real people, publishing, retrospective",
    project: "Memory Game — finish & publish", description: "Win screen, timer, best time, live on your portfolio.",
    stretch: "Sound, or a two-player mode.",
    katas: "one Clash round; re-solve your very first Week 1 kata and compare",
    days: [
      d(1, "build", "Timer & best time", {
        concept: "Elapsed timer; best time in localStorage (handle 'no best yet'); win screen shows both.",
        exercises: ["Timer", "Best time", "Win screen"],
        prove: "A new best is detected correctly the first time and every time.", push: "week-35/",
      }),
      d(2, "build", "Polish", {
        concept: "Flip animation (CSS transform), keyboard access, reduced motion, mobile.",
        exercises: ["Animation", "Keyboard", "375px"],
        prove: "Feels like a real game.", push: "week-35/",
      }),
      d(3, "build", "Test it hard", {
        concept: "Two people try to break it.",
        exercises: ["Collect every bug", "Fix them", "Log them"],
        prove: "Nobody can break it.", push: "week-35/",
      }),
      d(4, "build", "Publish", {
        concept: "On your portfolio with a screenshot and a paragraph; live on Pages.",
        exercises: ["Portfolio entry", "Live URL", "Link to your mentor"],
        prove: "It's on the internet.", push: "week-35/",
      }),
      d(5, "build", "Retrospective", {
        concept: "RETRO.md: hardest part, what you'd do differently, three things you can do now that you couldn't in Week 1. Reread your Week 1 bug journal.",
        exercises: ["RETRO.md", "Reread journal", "Plan the capstone"],
        prove: "STAGE GATE — explain how the game knows two cards match.", push: "week-35/",
      }),
    ],
    drill: {
      code: `<script src="/js/game.js"></script>
<script>
  localStorage.setItem("best", bestTime);   // bestTime is a number
  const best = localStorage.getItem("best");
  if (time < best) localStorage.setItem("best", time);
</script>`,
      solution: `1) A root-relative /js/… path breaks on a GitHub project-pages URL — js/game.js. 2) getItem returns a string — Number(best). 3) With no best yet, getItem is null (coerces to 0, so nothing ever beats it) — treat null as 'no record'.`,
    },
  },
  {
    number: 36, stage: "javascript", topic: "Async JS & the Weather App",
    concepts: "sync vs async, fetch, JSON responses, promises, async/await, error handling",
    project: "Weather App — fCC JavaScript certification project", description: "Real data from the real internet. A capstone you can show anyone.",
    stretch: "Geolocation to detect the city; a 5-day view.",
    katas: "one Clash round; then look at the fCC modules we skipped and pick the one you'll do next",
    days: [
      d(1, "learn", "Async", {
        concept: "Async vs sync, async/defer, the Fetch API.",
        lesson: [fjs("Understanding Asynchronous Programming (theory) — first half")],
        exercises: ["fetch a public JSON endpoint and log it", "Explain why the log runs 'too early' without await"],
        prove: "Data from the internet in your console.", push: "week-36/day-01/",
      }),
      d(2, "learn", "Promises & async/await", {
        concept: "Promises, chaining, async/await, the engine and runtime, geolocation.",
        lesson: [fjs("Understanding Asynchronous Programming (theory) — finish"), fjs("Build an fCC Authors Page (workshop, 29 steps)")],
        exercises: ["Rewrite a .then chain with async/await", "Handle a failed request gracefully"],
        prove: "Workshop complete.", push: "week-36/day-02/",
      }),
      d(3, "learn", "Leaderboard lab + review", {
        concept: "Apply.",
        lesson: [fjs("Build an fCC Forum Leaderboard (lab)"), fjs("Asynchronous JavaScript Review + Quiz")],
        exercises: ["Quiz"],
        prove: "Lab passing.", push: "week-36/day-03/",
      }),
      d(4, "build", "Weather App I", {
        concept: "Plan; fetch by city; render; loading and error states.",
        lesson: [fjs("Build a Weather App — Certification Project", "lab-weather-app")],
        exercises: ["Plan in README", "Fetch + render", "Error and loading states"],
        prove: "Half the tests passing.", push: "week-36/day-04-weather/",
      }),
      d(5, "build", "Weather App II — ship", {
        concept: "Finish the cert project; publish; portfolio.",
        lesson: [fjs("JavaScript Review", "review-javascript")],
        exercises: ["All fCC tests passing", "Published on Pages", "On your portfolio with a screenshot"],
        prove: "ROADMAP COMPLETE — then the capstone of your choosing, and Raspberry Pi.", push: "week-36/day-05-weather/",
      }),
    ],
    drill: {
      code: `const data = fetch(url).json();
async function load() {
  const res = await fetch(url);
  return res.json;
}
load().then(d => console.log(d.main.temp));`,
      solution: `1) fetch returns a promise — await it (and .json() is async too). 2) res.json is a method — call it: await res.json(). 3) No check that res.ok and no try/catch — a bad city or offline network crashes on d.main.`,
    },
  },
];

export const curriculum: Curriculum = { slug: "coding-journey", title: "Coding Journey", weeks };

// --- derived days -------------------------------------------------------------

export function weekTasks(week: Week): Task[] {
  const katas = kataFor(week.number);
  const lesson = week.number >= 9 ? [...katas, CLASH] : katas;
  const challenge: Task = {
    day: 6, kind: "challenge", title: "Challenge day",
    concept: `${week.katas}. Then the debug drill: read the code and find the bugs BEFORE running it, fix them, then reveal the solution.`,
    lesson,
    exercises: ["Katas done", "Drill fixed before revealing", "Anything that surprised you — bug journal"],
    code: week.drill.code, solution: week.drill.solution,
  };
  const rest: Task = { day: 7, kind: "rest", title: "Rest", concept: "Genuinely off. Your brain files the week away while you're not looking." };
  return [...week.days, challenge, rest];
}

/** Every tickable unit in a week (used for granular progress). Rest days count zero. */
export function taskUnits(task: Task): number {
  if (task.kind === "rest") return 0;
  return (task.lesson?.length ?? 0) + (task.exercises?.length ?? 0) + (task.prove ? 1 : 0) || 1;
}
