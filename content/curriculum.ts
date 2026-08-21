// content/curriculum.ts
//
// The single source of curriculum content. Shared by everyone; per-user
// progress lives in lib/storage.ts.
//
// Pace: one hour a day, six days a week. Each week = five authored days
// (learn / practice / build) + a challenge day (katas + a debug drill with a
// hidden solution) + a rest day. Code lives in the learner's GitHub repo, one
// folder per week (week-01/day-05-madlibs.py); the mentor reviews it weekly.
//
// Resources are limited to ones we trust: Futurecoder, the official Python
// tutorial, freeCodeCamp (v9 paths, verified 2026-08), MDN, GitHub Docs.

export type Stage = "python" | "html" | "css" | "javascript";
export type TaskKind = "learn" | "practice" | "build" | "challenge" | "rest";

export interface Resource {
  label: string;
  url: string;
}

export interface Task {
  day: number; // 1–7
  kind: TaskKind;
  title: string;
  instruction: string;
  resource?: Resource;
  code?: string; // debug drill: the broken program
  solution?: string; // debug drill: hidden until attempted
}

export interface Drill {
  code: string;
  solution: string;
}

export interface Week {
  number: number; // 1–26
  stage: Stage;
  topic: string;
  concepts: string;
  project: string;
  description: string;
  stretch: string;
  resource: Resource; // the week's primary lesson
  katas: string; // what to hunt for on challenge day
  days: Task[]; // days 1–5, authored
  drill: Drill; // day 6
}

export interface Curriculum {
  slug: string;
  title: string;
  weeks: Week[];
}

// --- resources ----------------------------------------------------------------

const r = (label: string, url: string): Resource => ({ label, url });

const FC = (chapter: string) => r(`Futurecoder — ${chapter}`, "https://futurecoder.io/course/");
const PY = (section: string, path: string) => r(`Python tutorial — ${section}`, `https://docs.python.org/3/tutorial/${path}`);
const PY_RANDOM = r("Python docs — random", "https://docs.python.org/3/library/random.html");
const GITHUB = r("GitHub Docs — get started", "https://docs.github.com/en/get-started");
const CODEWARS = r("Codewars — Python katas (filter to 8 kyu)", "https://www.codewars.com/kata/search/python");
const CODEWARS_JS = r("Codewars — JavaScript katas (filter to 8 kyu)", "https://www.codewars.com/kata/search/javascript");
const CLASH = r("CodinGame — Clash of Code", "https://www.codingame.com/multiplayer/clashofcode");
const RWD = r("freeCodeCamp — Responsive Web Design", "https://www.freecodecamp.org/learn/responsive-web-design-v9/");
const JS = r("freeCodeCamp — JavaScript", "https://www.freecodecamp.org/learn/javascript-v9/");
const MDN = (label: string, path: string) => r(`MDN — ${label}`, `https://developer.mozilla.org/en-US/docs/${path}`);
const MDN_HTML = MDN("HTML", "Web/HTML");
const MDN_FORM = MDN("<form>", "Web/HTML/Element/form");
const MDN_CSS = MDN("CSS", "Web/CSS");
const MDN_FLEX = MDN("Flexbox", "Web/CSS/CSS_flexible_box_layout");
const MDN_GRID = MDN("Grid", "Web/CSS/CSS_grid_layout");
const MDN_JS = MDN("JavaScript", "Web/JavaScript");
const MDN_DOM = MDN("The DOM", "Web/API/Document_Object_Model");
const MDN_EVENTS = MDN("addEventListener", "Web/API/EventTarget/addEventListener");
const MDN_STORAGE = MDN("localStorage", "Web/API/Window/localStorage");
const MDN_TIMERS = MDN("setInterval", "Web/API/Window/setInterval");
const GH_PAGES = r("GitHub Pages", "https://pages.github.com/");

// --- helpers ------------------------------------------------------------------

const t = (day: number, kind: TaskKind, title: string, instruction: string, resource?: Resource): Task => ({ day, kind, title, instruction, resource });

// --- the 26 weeks -------------------------------------------------------------

const weeks: Week[] = [
  // ─────────────────────────── Stage 1 · Python: learning to think ───────────
  {
    number: 1, stage: "python", topic: "Talk to the machine",
    concepts: "variables, print, input, f-strings, string methods, numbers, if/elif/else",
    project: "Mad Libs — hard mode",
    description: "A story that changes depending on the answers, not just fills in blanks.",
    stretch: "Add a third branch and a running word count.",
    resource: FC("Getting started → Strings → If statements"),
    katas: "two 8-kyu string katas",
    days: [
      t(1, "learn", "Set up like a developer", "Install Python + VS Code, create a GitHub repo called coding-journey with a week-01 folder. Learn three commands only: git add ., git commit -m 'message', git push. Prove it: a hello.py that prints your name, committed and visible on GitHub.", GITHUB),
      t(2, "learn", "Variables, input, strings", "Variables, print, input(), f-strings, and .upper() .lower() .len(). Prove it: a profile card that takes name + birth year and prints a formatted card with your age AND your name in uppercase and reversed. (Reversing isn't spoon-fed — work it out.)", FC("Getting started, Strings")),
      t(3, "learn", "Numbers", "int vs float, +-*/, // and %, converting input to numbers. Learn the trap: input() always gives you text. Prove it: a tip calculator that splits a bill between friends and rounds correctly.", FC("Numbers")),
      t(4, "learn", "Decisions", "if/elif/else, comparisons, and/or/not. Prove it: a grade calculator that refuses a mark over 100 or below 0 — your first input validation. Then three drills, no notes: swap two variables without a third; format any name as 'LAST, First'; convert temperature both directions.", FC("If statements")),
      t(5, "build", "Build: Mad Libs, hard mode", "Ask for words and stitch a story — but a name over 6 letters gets a different opening, and an age under 13 branches the ending. Conditionals inside string-building. Push to week-01/day-05-madlibs.py."),
    ],
    drill: {
      code: `name = input("Name: ")
age = input("Age: ")
if age > 18
    print("Adult: " + name)
else:
    print("Minor: " name)`,
      solution: `1) age is text — int(input("Age: ")) before comparing. 2) The if line is missing its colon. 3) "Minor: " name is missing the + (or use an f-string).`,
    },
  },
  {
    number: 2, stage: "python", topic: "Repetition",
    concepts: "while, for, range, nested loops, accumulators, breaking out",
    project: "Rock Paper Scissors — best of 5",
    description: "A full match with a scoreboard, input checking, and a rematch prompt.",
    stretch: "Add lizard & spock, and a 'first to N' setting.",
    resource: FC("For loops → While loops → Nested loops"),
    katas: "two 8-kyu loop/counting katas",
    days: [
      t(1, "learn", "while loops", "while, conditions that eventually end, break. You WILL write an infinite loop — celebrate it and log it. Prove it: a countdown that asks for a number and refuses to start until you type a positive one.", FC("While loops")),
      t(2, "learn", "for + range", "for loops, range(start, stop, step), accumulators. Prove it: sum of all multiples of 3 or 5 below 1000; then print a right-angled triangle of stars of any height.", FC("For loops")),
      t(3, "practice", "Loop drills", "No new material. FizzBuzz to 100; reverse a string with a loop (no slicing); count vowels in a sentence; a 'guess my number' where the computer picks and you get 7 tries.", FC("Loops")),
      t(4, "learn", "Nested loops", "Loops inside loops. Prove it: a full 1–12 times table grid, neatly aligned; then every unique pair from a list of names (no repeats, no self-pairs).", FC("Nested loops")),
      t(5, "build", "Build: Rock Paper Scissors", "Best of 5 vs the computer, scoreboard each round, rejects invalid input, offers a rematch. Push to week-02/day-05-rps.py."),
    ],
    drill: {
      code: `count = 5
while count > 0:
    print(count)

total = 0
for i in range(1, 10):
    total += i
print("Sum 1-10:", total)

for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end=" ")
print()`,
      solution: `1) count never changes — add count -= 1 inside the while (infinite loop). 2) range(1, 10) stops at 9 — use range(1, 11). 3) print() must be inside the outer loop to end each row.`,
    },
  },
  {
    number: 3, stage: "python", topic: "Functions",
    concepts: "def, parameters, return, scope, one job per function, docstrings",
    project: "Calculator that can't be crashed",
    description: "Menu-driven, one function per operation, survives every bad input you throw at it.",
    stretch: "Add power, square root, and a running history.",
    resource: FC("Functions"),
    katas: "two 8-kyu katas solved as clean single functions",
    days: [
      t(1, "learn", "Defining functions", "def, parameters, calling. Why: reuse and readability. Prove it: greet(name, excited) that returns different text; is_even(n); area of a circle given radius. Each function does one job.", FC("Functions")),
      t(2, "learn", "return and scope", "return vs print (the classic confusion), local vs global, why functions shouldn't touch outside variables. Prove it: a function that returns the largest of three numbers WITHOUT max(); then explain out loud why a variable inside a function vanishes.", FC("Functions")),
      t(3, "practice", "Function drills", "Refactor Week 1's Mad Libs and Week 2's RPS so every chunk of logic is a named function. If a function needs 'and' to describe it, split it. Add a one-line docstring to each.", FC("Functions")),
      t(4, "learn", "Validating input", "A helper that keeps asking until it gets a valid number. Prove it: get_number(prompt) that never crashes and never returns text; reuse it in your RPS.", FC("Functions")),
      t(5, "build", "Build: the calculator", "Menu of + − × ÷, each its own function, division by zero handled, letters rejected, loops until 'q'. Push to week-03/day-05-calculator.py."),
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
    concepts: "indexing, slicing, append/remove/sort, looping, in, list comprehensions",
    project: "Hangman",
    description: "Guess the word letter by letter; the drawing grows with each miss.",
    stretch: "Word categories and a two-player mode where one types the word.",
    resource: FC("Lists"),
    katas: "two 8-kyu list katas",
    days: [
      t(1, "learn", "Lists basics", "Making lists, indexing (including negatives), slicing, len. Prove it: from a list of scores, print the highest, the last, and the middle two using slices only.", FC("Lists")),
      t(2, "learn", "Changing lists", "append, insert, remove, pop, sort/sorted, in. Prove it: a shopping list you can add to, remove from, and print sorted — in a loop until 'done'.", FC("Lists")),
      t(3, "practice", "List drills", "Reverse a list without reverse(); find duplicates; sum only even numbers; rewrite one loop as a list comprehension and explain the difference.", FC("Lists")),
      t(4, "learn", "Lists + loops together", "Loop with index and value (enumerate), building one list from another. Prove it: a program that keeps the guessed letters of a word visible as _ _ a _ — the heart of Hangman.", FC("Lists")),
      t(5, "build", "Build: Hangman", "Random word from a list, guessed letters shown, six lives, ASCII drawing grows, win/lose message. Push to week-04/day-05-hangman.py."),
    ],
    drill: {
      code: `scores = [10, 20, 30, 40]
print(scores[4])
scores.append([50])
top = scores.sort()
print(top)`,
      solution: `1) scores[4] doesn't exist — indexes are 0–3 (use scores[-1] for the last). 2) append([50]) adds a list inside the list — append(50). 3) sort() sorts in place and returns None — call scores.sort() then print(scores), or use sorted(scores).`,
    },
  },
  {
    number: 5, stage: "python", topic: "Dictionaries",
    concepts: "key/value, get, items(), nested data, when to use a dict vs a list",
    project: "Quiz Game with categories",
    description: "Questions stored as data, scored, with categories and difficulty.",
    stretch: "Save the high score to a file (a preview of Week 8).",
    resource: FC("Dictionaries"),
    katas: "two 8-kyu katas that need a dictionary",
    days: [
      t(1, "learn", "Dictionaries", "Key/value pairs, adding, updating, .get() to avoid crashes. Prove it: a phone book you can add to and look up, that says 'not found' instead of crashing.", FC("Dictionaries")),
      t(2, "learn", "Looping dicts", ".items(), .keys(), .values(), counting with a dict. Prove it: count how many times each word appears in a sentence.", FC("Dictionaries")),
      t(3, "practice", "Data-shape drills", "Decide list vs dict for: a class register, a leaderboard, a translation table. Then build a nested structure: a dict of students → list of marks, and print each student's average.", FC("Dictionaries")),
      t(4, "learn", "Data-driven programs", "Store questions as a list of dicts (question, options, answer, category). Prove it: a loop that asks each and scores it — the program shouldn't change if you add a question.", FC("Dictionaries")),
      t(5, "build", "Build: the Quiz Game", "Pick a category, get scored, see results per category at the end. Push to week-05/day-05-quiz.py."),
    ],
    drill: {
      code: `ages = {"Sam": 14, "Ali": 15}
print(ages["Zoe"])
if 15 in ages:
    print("someone is 15")
for k, v in ages:
    print(k, v)`,
      solution: `1) ages["Zoe"] raises KeyError — use ages.get("Zoe"). 2) "in ages" checks keys, not values — use ages.values(). 3) Looping a dict gives keys only — use ages.items() to unpack k, v.`,
    },
  },
  {
    number: 6, stage: "python", topic: "Strings & randomness",
    concepts: "string algorithms, slicing, join/split, the random module",
    project: "Password Generator + strength checker",
    description: "Generate a password to spec, then judge any password's strength.",
    stretch: "A passphrase mode from a word list.",
    resource: PY_RANDOM,
    katas: "two 8-kyu string-manipulation katas",
    days: [
      t(1, "learn", "String algorithms", "Slicing tricks, split/join, checking characters (isdigit, isupper). Prove it: is a word a palindrome? Is one string an anagram of another?", FC("Strings")),
      t(2, "learn", "The random module", "randint, choice, shuffle, sample — and why 'random' on a computer is a thing to think about. Prove it: roll two dice 10,000 times and print how often each total appears.", PY_RANDOM),
      t(3, "practice", "String drills", "Caesar cipher (encode AND decode); title-case a sentence by hand; count words longer than 5 letters; remove all vowels.", FC("Strings")),
      t(4, "learn", "Strength rules", "Turn rules into code: length ≥ 12, has upper, lower, digit, symbol. Prove it: strength(pw) returns weak/ok/strong with reasons.", FC("Strings")),
      t(5, "build", "Build: Password Generator", "Choose length and which character sets; generate; then check its strength with your own function. Push to week-06/day-05-password.py."),
    ],
    drill: {
      code: `import random
word = "python"
print(word[6])
print(word.upper)
n = random.randint(1, 10)
print("Rolled " + n)`,
      solution: `1) word[6] is out of range — indexes are 0–5. 2) word.upper is the method, not its result — call it: word.upper(). 3) Can't add text and a number — use f"Rolled {n}".`,
    },
  },
  {
    number: 7, stage: "python", topic: "When things go wrong",
    concepts: "exceptions, try/except/finally, raising, defensive programming",
    project: "Bank account simulator",
    description: "Deposits, withdrawals, and transfers that refuse to do anything impossible.",
    stretch: "Transaction history and an overdraft rule.",
    resource: PY("Errors and exceptions", "errors.html"),
    katas: "two 8-kyu katas where you must handle bad input",
    days: [
      t(1, "learn", "Reading tracebacks", "What an exception is, how to read the last line first, the common ones (ValueError, TypeError, IndexError, KeyError, ZeroDivisionError). Prove it: deliberately cause each one and explain each message in your own words.", PY("Errors", "errors.html")),
      t(2, "learn", "try / except", "Catch specific errors, never a bare except. Prove it: rewrite get_number() from Week 3 with try/except; then a divide() that handles both non-numbers and zero.", PY("Handling exceptions", "errors.html#handling-exceptions")),
      t(3, "practice", "Robustness drills", "Take Hangman and the Quiz Game and make them impossible to crash by typing nonsense. Log every crash you found first in the bug journal.", PY("Errors", "errors.html")),
      t(4, "learn", "raise and finally", "raise your own errors when a rule is broken; finally for cleanup. Prove it: withdraw(amount) raises ValueError for negative or over-balance amounts, and the caller handles it.", PY("Raising exceptions", "errors.html#raising-exceptions")),
      t(5, "build", "Build: the bank", "Accounts as dicts, deposit/withdraw/transfer as functions that raise on impossible actions, a menu that catches and reports. Push to week-07/day-05-bank.py."),
    ],
    drill: {
      code: `try:
    n = int(input("Number: "))
except:
    print("Not a number")
result = 10 / n
print(result)

def safe_div(a, b):
    try:
        return a / b
    except ValueError:
        return None
print(safe_div(1, 0))`,
      solution: `1) Bare except hides everything — catch ValueError. 2) After a failed input, n doesn't exist and 10 / n crashes — loop until valid, or exit. 3) Dividing by zero raises ZeroDivisionError, not ValueError — catch the right one.`,
    },
  },
  {
    number: 8, stage: "python", topic: "Files & persistence",
    concepts: "open/with, read/write/append, lines, CSV, data that survives the program",
    project: "To-do list that remembers",
    description: "Add, complete, and delete tasks — and they're still there tomorrow.",
    stretch: "Due dates and an 'overdue' view.",
    resource: PY("Reading and writing files", "inputoutput.html#reading-and-writing-files"),
    katas: "two 8-kyu katas on parsing text",
    days: [
      t(1, "learn", "Reading files", "open, with, read vs readlines, why with matters. Prove it: read a text file and print the number of lines, words, and characters.", PY("Files", "inputoutput.html#reading-and-writing-files")),
      t(2, "learn", "Writing files", "'w' vs 'a', writing lines, the overwrite trap. Prove it: a diary — each run appends a dated entry; another mode prints them all.", PY("Files", "inputoutput.html#reading-and-writing-files")),
      t(3, "practice", "File drills", "Save the Quiz high score to a file and load it on start; save Hangman's word list in a file so adding words needs no code changes.", PY("Files", "inputoutput.html")),
      t(4, "learn", "Structured data", "CSV with the csv module: rows → lists/dicts and back. Prove it: a grades.csv reader that prints each student's average and the top student.", r("Python docs — csv", "https://docs.python.org/3/library/csv.html")),
      t(5, "build", "Build: persistent to-do", "Tasks stored in a file, loaded on start, saved on every change; add/complete/delete/list. Push to week-08/day-05-todo.py."),
    ],
    drill: {
      code: `f = open("scores.txt")
f.write("100\\n")
lines = f.read()
for line in lines:
    print(line)
f.close`,
      solution: `1) Opened for reading — writing needs open("scores.txt", "a") (or "w"). 2) Looping over read() gives characters — use readlines() or splitlines(). 3) f.close is never called (missing parens) — better: use "with open(...) as f:" so it closes itself.`,
    },
  },
  {
    number: 9, stage: "python", topic: "Organising code",
    concepts: "modules, import, splitting into files, __main__, datetime, project structure",
    project: "Habit tracker (multi-file)",
    description: "Track daily habits with streaks — your first program spread across files.",
    stretch: "A weekly summary and a 'best streak' record.",
    resource: PY("Modules", "modules.html"),
    katas: "two 8-kyu katas — solve each in a separate module and import it into a test file",
    days: [
      t(1, "learn", "Modules & import", "Import the standard library well (math, random, datetime), read the docs to find a function you've never used. Prove it: days until your next birthday, using datetime.", PY("Modules", "modules.html")),
      t(2, "learn", "Your own modules", "Split code into files, import your own functions, the if __name__ == '__main__' guard. Prove it: move your Week 3 validators into helpers.py and import them from two different programs.", PY("Modules", "modules.html")),
      t(3, "practice", "Refactor week", "Take the bank simulator and split it: data.py (load/save), rules.py (logic), main.py (menu). Nothing should behave differently.", PY("Modules", "modules.html")),
      t(4, "learn", "Design before code", "Plan the habit tracker on paper first: what data, which functions, which file. Prove it: a written plan in a README.md in the week folder, then the data layer only.", PY("Modules", "modules.html")),
      t(5, "build", "Build: habit tracker", "habits.json or CSV, mark today done, streaks computed from dates, split across files. Push to week-09/."),
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
      solution: `1) math.sqrt needs to be called with a number: math.sqrt(16). 2) datetime.now is a method — call it: datetime.now(). 3) main is never called — main(), ideally under if __name__ == "__main__":.`,
    },
  },
  {
    number: 10, stage: "python", topic: "Thinking in algorithms",
    concepts: "linear vs binary search, writing a sort by hand, counting steps, recursion taste",
    project: "The computer guesses YOUR number",
    description: "Flip Week 2's game: you think of a number, the computer finds it in ≤ 7 guesses.",
    stretch: "Word frequency counter over a whole book (Project Gutenberg text).",
    resource: FC("Bringing it together"),
    katas: "one 8-kyu and one 7-kyu kata — the 7-kyu is meant to be hard",
    days: [
      t(1, "learn", "Searching", "Linear search by hand, then binary search on a sorted list. Prove it: both written as functions; count and print how many comparisons each makes on a 1000-item list.", FC("Lists")),
      t(2, "learn", "Sorting by hand", "Bubble sort or selection sort written yourself — no sort(). Prove it: sort a list, then explain out loud why it gets slow on big lists.", FC("Nested loops")),
      t(3, "practice", "Algorithm drills", "Find the second-largest number in one pass; check if a list is sorted; merge two sorted lists into one sorted list without sorting.", FC("Lists")),
      t(4, "learn", "A taste of recursion", "A function that calls itself, with a base case. Prove it: factorial and a countdown, both recursive; then explain what happens without the base case (and log the crash).", FC("Functions")),
      t(5, "build", "Build: computer guesses", "You pick 1–100 in your head, answer higher/lower, the computer uses binary search and always wins in ≤ 7. Push to week-10/day-05-guesser.py."),
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
      solution: `1) return -1 sits inside the loop, so it gives up after the first item — move it after the loop. 2) / gives a float — use // for a whole-number midpoint. 3) The recursion never narrows (mid is reused) — use mid + 1 and mid - 1, or it loops forever.`,
    },
  },
  {
    number: 11, stage: "python", topic: "Python capstone",
    concepts: "planning, multi-file design, everything so far",
    project: "Tic-Tac-Toe with an unbeatable-ish AI",
    description: "Two-player, then vs computer that blocks and takes wins. Multi-file, tested by hand.",
    stretch: "Make the AI genuinely unbeatable (look up minimax and try).",
    resource: FC("Tic Tac Toe"),
    katas: "one 7-kyu kata; and revisit your Week 1 katas — feel the difference",
    days: [
      t(1, "learn", "Plan it", "Board as a list, win-check as a function, players as data. Write the plan in README.md before code. Prove it: show_board() and winner() with a hand-run test of every winning line.", FC("Tic Tac Toe")),
      t(2, "build", "Two-player game", "Full two-player game: turns, input validation, occupied squares rejected, win and draw detection. Push it — this alone is a milestone.", FC("Tic Tac Toe")),
      t(3, "build", "The AI, part 1", "Computer picks a random free square. Then: if it can win this turn, it does. Prove it: play five games and log any AI mistakes.", FC("Tic Tac Toe")),
      t(4, "build", "The AI, part 2", "If the human can win next turn, block. Prefer the centre, then corners. Play until it stops losing carelessly.", FC("Tic Tac Toe")),
      t(5, "build", "Polish & ship", "Split into board.py, ai.py, main.py; clean names, docstrings, dead code deleted; a README with how to play. Push to week-11/. Stage gate this week: on the call, explain every function line by line."),
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
      solution: `1) return False is inside the loop, so only the first line is ever checked — dedent it after the loop. 2) Moves are 1–9 but indexes are 0–8 — use board[move - 1]. 3) Nothing stops a player taking an occupied square (and nothing detects a draw) — check board[i] == " " first, and end when the board is full.`,
    },
  },

  // ─────────────────────────── Stage 2 · HTML: structure ─────────────────────
  {
    number: 12, stage: "html", topic: "HTML, properly",
    concepts: "the document model, semantic elements, headings, links, images, lists, validation",
    project: "Passion Page",
    description: "A well-structured page about something you love — with real semantics, not divs.",
    stretch: "A second page and a shared nav; validate both with zero errors.",
    resource: RWD,
    katas: "no katas this week — instead, view-source on two real sites and name the semantic elements they use",
    days: [
      t(1, "learn", "The document", "You've typed tags before — now learn what a document IS: doctype, head vs body, how the browser builds a tree. Prove it: a page from a blank file with a title, an h1, two paragraphs, and a nested list — then look at it in devtools' Elements panel and match the tree.", RWD),
      t(2, "learn", "Text & links", "Headings as an outline (h1→h6, one h1), p, strong/em, a with href — relative vs absolute, opening in a new tab. Prove it: a two-page mini site that links both ways.", RWD),
      t(3, "learn", "Images, lists, semantics", "img with alt that actually describes; ul/ol/dl; header, nav, main, section, article, footer. Prove it: rewrite Day 1's page using only semantic elements — no div unless you can say why.", MDN_HTML),
      t(4, "practice", "Structure drills", "Take a messy div-soup snippet (write your own, or ask your mentor for one) and re-mark it up semantically. Run both through the W3C validator and fix every error.", MDN_HTML),
      t(5, "build", "Build: Passion Page", "A page about a game/team/band you love: header, nav, main with sections, images with real alt text, a footer. Valid HTML. Push to week-12/."),
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
      solution: `1) <title> is never closed. 2) <a> and <p> are mis-nested — close them in reverse order: </a></p>. 3) The image has no alt text. (Bonus: no <!DOCTYPE html>, no lang attribute.)`,
    },
  },
  {
    number: 13, stage: "html", topic: "Forms & accessibility",
    concepts: "form, input types, label/for, name, required, fieldset, tables, accessible markup",
    project: "Survey form",
    description: "A real form that's usable with a keyboard and a screen reader, validated by the browser.",
    stretch: "A data table of results with proper headers and a caption.",
    resource: RWD,
    katas: "no katas — tab through your form with the keyboard only, then with a screen reader on (VoiceOver / Narrator) and fix what's awkward",
    days: [
      t(1, "learn", "Forms", "form, action/method, input types (text, email, number, date, checkbox, radio), name attributes, submit. Prove it: a sign-up form that submits to a page showing the values in the URL — read them.", MDN_FORM),
      t(2, "learn", "Labels & validation", "label/for, required, min/max, pattern, placeholder is not a label. Prove it: the same form, every input labelled, browser-validated, keyboard-tabbable in the right order.", RWD),
      t(3, "learn", "Accessibility", "Why alt, why labels, heading order, contrast, focus. Prove it: audit your Passion Page with your browser's accessibility checker (Lighthouse) and fix everything it flags.", RWD),
      t(4, "learn", "Tables & fieldsets", "table/thead/tbody/th scope, caption; fieldset/legend to group radios. Prove it: a results table plus a grouped radio question in your form.", MDN_HTML),
      t(5, "build", "Build: Survey form", "A multi-section survey: text, email, number, radios in a fieldset, checkboxes, a select, textarea, submit; fully labelled, validated, keyboard-friendly. Push to week-13/. Stage gate: sketch the difference between block and inline elements from memory."),
    ],
    drill: {
      code: `<form>
  <label>Name</label>
  <input type="text">
  <label for="email">Email</label>
  <input type="text" id="mail">
  <input type="submit" value="Send">
</form>`,
      solution: `1) The first label isn't linked to its input — add for="name" and id="name" (or wrap the input in the label). 2) for="email" doesn't match id="mail". 3) The email field should be type="email", and inputs need name attributes or nothing gets submitted.`,
    },
  },

  // ─────────────────────────── Stage 3 · CSS: making it look good ────────────
  {
    number: 14, stage: "css", topic: "CSS fundamentals",
    concepts: "selectors, the cascade & specificity, the box model, colour, typography, units",
    project: "Style your Passion Page",
    description: "The same HTML, now designed — spacing, type, colour, all deliberate.",
    stretch: "A dark theme using CSS variables and a hover state on every link.",
    resource: RWD,
    katas: "no katas — reproduce a simple card you find on any site, pixel-close, from a blank file",
    days: [
      t(1, "learn", "Selectors & the cascade", "Element/class/id selectors, combinators, specificity, why !important is a smell. Prove it: predict which of five conflicting rules wins before you check — get all five right.", MDN_CSS),
      t(2, "learn", "The box model", "content / padding / border / margin, box-sizing: border-box, margin collapse. This confuses everyone — go slow. Prove it: draw the box model on paper, then build three boxes of exact pixel sizes and verify in devtools.", RWD),
      t(3, "learn", "Colour & type", "Hex/rgb/hsl, contrast, font-family stacks, rem vs px, line-height. Prove it: a readable article page with a heading scale and comfortable line length.", MDN_CSS),
      t(4, "practice", "CSS drills", "Centre a box horizontally; make a button look like a button (states: hover, active, focus); style your survey form's inputs consistently.", RWD),
      t(5, "build", "Build: styled Passion Page", "External stylesheet, variables for colours, consistent spacing scale, styled nav and footer, images sized responsively. Push to week-14/."),
    ],
    drill: {
      code: `<style>
  .box { width: 200px; padding: 20px; border: 5px solid; }
  #title { color: #12345; }
  p { font-size: 16; }
</style>
<div class="box">
  <h1 id="title">Hi</h1>
  <p>Hello</p>
</div>`,
      solution: `1) The box renders 250px wide (200 + 2×20 padding + 2×5 border) — use box-sizing: border-box or adjust. 2) #12345 is not a valid hex colour (needs 3 or 6 digits). 3) font-size: 16 has no unit — 16px or 1rem.`,
    },
  },
  {
    number: 15, stage: "css", topic: "Flexbox",
    concepts: "flex containers & items, direction, justify/align, wrap, gap, flex-grow",
    project: "Profile card + nav bar",
    description: "A centred card and a real horizontal nav — the two most common flex jobs.",
    stretch: "A row of cards that wraps neatly at any width.",
    resource: MDN_FLEX,
    katas: "no katas — play a Flexbox game (Flexbox Froggy) to the end, then explain justify vs align in one sentence",
    days: [
      t(1, "learn", "Flex basics", "display: flex, main vs cross axis, flex-direction, justify-content, align-items. Prove it: centre a box perfectly in the viewport in three lines of CSS.", MDN_FLEX),
      t(2, "learn", "Sizing & wrapping", "flex-grow/shrink/basis, flex: 1, flex-wrap, gap. Prove it: three columns that share space equally, then one that takes twice the space.", MDN_FLEX),
      t(3, "practice", "Flex drills", "Nav bar with logo left and links right; a footer with three columns; a media object (image left, text right, vertically centred).", RWD),
      t(4, "learn", "Real layouts", "Nested flex containers, order, align-self. Prove it: a card with an image on top, text in the middle, and a button pinned to the bottom regardless of text length.", MDN_FLEX),
      t(5, "build", "Build: profile card + nav", "A homepage skeleton: sticky flex nav, a centred profile card, a row of project cards. Push to week-15/."),
    ],
    drill: {
      code: `<style>
.row { display: flex; justify-items: center; }
.row .item { flex: 1; width: 500px; }
.col { flex-direction: column; align-items: center; }
</style>`,
      solution: `1) justify-items isn't a flexbox property — you want justify-content. 2) width fights flex: 1 — drop the width or set flex-basis instead. 3) .col never sets display: flex, so flex-direction and align-items do nothing.`,
    },
  },
  {
    number: 16, stage: "css", topic: "Grid & responsive",
    concepts: "grid-template, fr, gap, areas, media queries, mobile-first, viewport meta",
    project: "Responsive homepage",
    description: "A full homepage that reflows from phone to desktop without breaking.",
    stretch: "A named-areas layout that rearranges completely on mobile.",
    resource: MDN_GRID,
    katas: "no katas — resize three real sites and note exactly where their layouts change and why",
    days: [
      t(1, "learn", "Grid basics", "grid-template-columns, fr, gap, repeat(), spanning. Prove it: a photo gallery grid; then a 12-column layout with a sidebar.", MDN_GRID),
      t(2, "learn", "Media queries", "min-width vs max-width, mobile-first thinking, the viewport meta tag (and what happens without it). Prove it: your gallery goes 1 → 2 → 4 columns at three breakpoints.", RWD),
      t(3, "practice", "Responsive drills", "Make your Week 15 nav collapse to a stacked list on small screens; make images never overflow; make text sizes scale with clamp().", RWD),
      t(4, "learn", "Grid areas & auto-fit", "grid-template-areas, minmax(), auto-fit — grids that respond without media queries. Prove it: a card grid that reflows with zero breakpoints.", MDN_GRID),
      t(5, "build", "Build: responsive homepage", "Header, hero, project grid, about, footer — right on a phone, a tablet, and a desktop; test in devtools device mode. Push to week-16/. Stage gate: sketch the box model AND explain flex vs grid in one sentence each."),
    ],
    drill: {
      code: `<style>
.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16; }
@media (max-width: 600px) {
  .grid { grid-template-columns: 1fr; }
}
.grid { grid-template-columns: repeat(3, 1fr); }
</style>`,
      solution: `1) gap: 16 has no unit — 16px. 2) The later .grid rule overrides the media query because it comes after with equal specificity — move it above the media query. 3) On a phone nothing changes without <meta name="viewport" content="width=device-width, initial-scale=1"> in the head.`,
    },
  },
  {
    number: 17, stage: "css", topic: "Ship it",
    concepts: "GitHub Pages, relative paths, transitions, polish, feedback",
    project: "Publish your portfolio",
    description: "Your homepage on the real internet, at a real URL, sent to a real person.",
    stretch: "A custom 404 page and a favicon.",
    resource: GH_PAGES,
    katas: "no katas — send your URL to two people, collect one piece of feedback each, act on it",
    days: [
      t(1, "learn", "Deploy", "Turn on GitHub Pages for your repo. Learn why relative paths matter and why file names are case-sensitive on the server. Prove it: your homepage live at a github.io URL, images and CSS loading.", GH_PAGES),
      t(2, "learn", "Transitions & polish", "transition, transform, hover/focus states, prefers-reduced-motion. Prove it: every interactive element has a state, and animations respect reduced motion.", MDN_CSS),
      t(3, "practice", "Cross-browser check", "Open your site in two browsers and on your phone; list every difference; fix what you can, log the rest.", GH_PAGES),
      t(4, "learn", "Portfolio content", "Add a projects section that links to your Python repos on GitHub with a sentence each. Prove it: someone who's never met you understands what you've built.", GH_PAGES),
      t(5, "build", "Ship: portfolio live", "Final polish, README updated, URL in your GitHub profile. Push to week-17/ and send the link to your mentor. This URL grows for years."),
    ],
    drill: {
      code: `<link rel="stylesheet" href="C:\\Users\\me\\site\\style.css">
<img src="/images/Logo.png">   <!-- the file on disk is images/logo.png -->
<a href="about">About</a>       <!-- the file is about.html -->`,
      solution: `1) An absolute local path only works on your computer — use a relative one: href="style.css". 2) Logo.png vs logo.png: the server is case-sensitive, and a leading slash breaks on a project-pages URL — use images/logo.png. 3) The link needs the file name: href="about.html".`,
    },
  },

  // ─────────────────────────── Stage 4 · JavaScript: making it alive ─────────
  {
    number: 18, stage: "javascript", topic: "JavaScript, fast",
    concepts: "let/const, types, functions, conditionals, loops — the Python logic in new clothes",
    project: "Guessing Game — JS remix",
    description: "Rebuild Week 2's game in the browser console. Same brain, new syntax.",
    stretch: "Limit the tries and show a hint after three wrong.",
    resource: JS,
    katas: "two 8-kyu JS katas — pick ones you already solved in Python",
    days: [
      t(1, "learn", "Syntax transfer", "Variables (let/const, never var), numbers vs strings, === vs ==, template literals. For each concept, write the Python version alongside. Prove it: your Week 1 profile card in the browser console.", JS),
      t(2, "learn", "Functions & conditionals", "function and arrow syntax, return, if/else, ternary. Prove it: largest-of-three without Math.max; FizzBuzz.", JS),
      t(3, "practice", "Loop drills in JS", "for, while, for…of; reverse a string; count vowels; the times-table grid to the console. Note every place JS bit you.", JS),
      t(4, "learn", "Truthiness & scope", "Falsy values, block scope, the difference between undefined and null. Prove it: predict the output of six tricky snippets before running them.", MDN_JS),
      t(5, "build", "Build: guessing game", "prompt() for input, console/alert for output, best-of logic, input validation. Push to week-18/day-05-guess.js. Then explain on the call: what transferred from Python, and what didn't."),
    ],
    drill: {
      code: `let score = "10";
score = score + 5;
console.log(score);

const name = "Sam";
name = "Ali";

if (score = 15) { console.log("fifteen"); }`,
      solution: `1) "10" + 5 is "105" (string concatenation) — Number(score) first. 2) You can't reassign a const — use let, or don't reassign. 3) = assigns; you meant === to compare.`,
    },
  },
  {
    number: 19, stage: "javascript", topic: "Arrays & objects",
    concepts: "arrays, objects, map/filter/find/reduce, destructuring, JSON",
    project: "Quote Machine",
    description: "A page with a button that shows a random quote from an array of objects.",
    stretch: "Filter by author and a 'copy to clipboard' button.",
    resource: JS,
    katas: "two 8-kyu array katas — solve one with a loop and again with map/filter",
    days: [
      t(1, "learn", "Arrays", "push/pop/slice/splice, indexOf/includes, length is a property. Prove it: your Week 4 list drills in JS.", JS),
      t(2, "learn", "Objects", "Key/value like dicts, dot vs bracket, arrays of objects, JSON.stringify/parse. Prove it: your quiz data as an array of objects; loop and score it in the console.", JS),
      t(3, "learn", "Array methods", "map, filter, find, reduce, forEach — and when a plain loop is clearer. Prove it: from an array of students, get the names of everyone over 80 in one line; then their average.", MDN_JS),
      t(4, "practice", "Data drills", "Sort objects by a field; group by category into an object; count occurrences with reduce; destructure in a loop.", JS),
      t(5, "build", "Build: Quote Machine", "An HTML page, an array of quote objects, a button that picks one at random and puts it on the page (yes, that's a peek at the DOM — next week explains it). Push to week-19/."),
    ],
    drill: {
      code: `const nums = [1, 2, 3];
nums.push(4);
console.log(nums.length());
const doubled = nums.map(n => { n * 2 });
console.log(doubled);
console.log(nums[nums.length]);`,
      solution: `1) length is a property, not a function — nums.length. 2) An arrow with braces needs return — n => n * 2, or { return n * 2 }. 3) The last index is length − 1 — nums[nums.length - 1].`,
    },
  },
  {
    number: 20, stage: "javascript", topic: "The DOM I",
    concepts: "selecting elements, changing text/attributes/classes, creating elements, script placement",
    project: "Theme Switcher",
    description: "Buttons that restyle the page live by toggling classes — and remember your choice.",
    stretch: "Build the list of theme buttons FROM an array, not by hand.",
    resource: MDN_DOM,
    katas: "one 8-kyu kata; then find a real page and change its heading text from the console",
    days: [
      t(1, "learn", "What the DOM is", "The page as a tree of objects JS can touch; querySelector, getElementById; why the script goes at the end (or defer). Prove it: change your Passion Page's heading and every link's text from JS.", MDN_DOM),
      t(2, "learn", "Changing things", "textContent vs innerHTML, setAttribute, classList.add/remove/toggle, style. Prove it: a button that toggles a 'dark' class on body — CSS does the rest.", MDN_DOM),
      t(3, "learn", "Creating things", "createElement, append, removeChild, building a list from an array. Prove it: render your quiz questions to the page from data — the page changes when the array changes.", MDN_DOM),
      t(4, "practice", "DOM drills", "Highlight every other row of a table; count the links on a page; add a 'back to top' link to any page via JS.", MDN_DOM),
      t(5, "build", "Build: Theme Switcher", "Themes as an array of names; buttons generated from it; clicking sets a class; the choice persists (localStorage — you'll learn it properly in Week 22, look it up for now). Push to week-20/."),
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
      solution: `1) getElementById takes the id without # — "title". 2) The script runs before the button exists in the page — move it to the end of body or add defer. 3) getElementsByClassName returns a collection, not one element — pick [0] or use querySelector(".card").`,
    },
  },
  {
    number: 21, stage: "javascript", topic: "The DOM II — events",
    concepts: "addEventListener, event objects, forms & preventDefault, keyboard, delegation",
    project: "Web Calculator",
    description: "Your Week 3 calculator, now with real buttons and keyboard support.",
    stretch: "A history panel you can click to reuse a result.",
    resource: MDN_EVENTS,
    katas: "one 8-kyu kata; then bind a keyboard shortcut to something on your portfolio",
    days: [
      t(1, "learn", "Events", "addEventListener, passing a function (not calling it), click/input/change. Prove it: a live character counter under a textarea.", MDN_EVENTS),
      t(2, "learn", "Forms & the event object", "submit + preventDefault, reading form values, e.target. Prove it: your survey form shows a summary on the page instead of navigating away.", MDN_EVENTS),
      t(3, "learn", "Keyboard & delegation", "keydown, e.key, one listener on a parent handling many children. Prove it: an on-screen keypad driven by both clicks and real keys.", MDN_EVENTS),
      t(4, "practice", "Event drills", "A counter with +/−/reset; a show/hide toggle; a form that disables submit until valid.", MDN_EVENTS),
      t(5, "build", "Build: Web Calculator", "Buttons + keyboard, one function per operation (reuse your Python thinking), division-by-zero handled, clear/backspace. Push to week-21/."),
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
      solution: `1) greet() runs immediately — pass the function itself: addEventListener("click", greet). 2) onClick isn't a thing — it's onclick (lowercase), or better, addEventListener. 3) e.key is "Enter" with a capital E — case matters.`,
    },
  },
  {
    number: 22, stage: "javascript", topic: "State & persistence",
    concepts: "state as data, render from state, localStorage, JSON, immutability basics",
    project: "To-Do List that persists",
    description: "Add, complete, delete, filter — and it's all still there after a refresh.",
    stretch: "Drag to reorder, or a due date with 'overdue' styling.",
    resource: MDN_STORAGE,
    katas: "one 8-kyu kata; then inspect what YOUR portfolio has in localStorage in devtools",
    days: [
      t(1, "learn", "State → render", "Keep data in an array; write one render() that redraws the page from it; every change updates the array THEN calls render. Prove it: a to-do list in memory that never touches the DOM directly except in render.", MDN_JS),
      t(2, "learn", "localStorage", "setItem/getItem, strings only, JSON.stringify/parse, handling 'nothing saved yet'. Prove it: your to-do list survives a refresh.", MDN_STORAGE),
      t(3, "practice", "State drills", "Add filters (all/active/done); a 'clear completed' button; edit a task in place. Every feature: change state, re-render.", MDN_STORAGE),
      t(4, "learn", "Don't mutate carelessly", "Copying arrays/objects, why shared references bite, spread syntax. Prove it: predict what six snippets print, then confirm.", MDN_JS),
      t(5, "build", "Build: persistent To-Do", "Full CRUD, filters, count of remaining, persisted, keyboard-friendly, clean state → render architecture. Push to week-22/."),
    ],
    drill: {
      code: `const todos = ["milk"];
localStorage.setItem("todos", todos);
const saved = localStorage.getItem("todos");
saved.push("eggs");
render();
function render() {
  list.innerHTML = "";
  todos.forEach(t => list.innerHTML += "<li>" + t);
}`,
      solution: `1) localStorage stores strings — JSON.stringify(todos) when saving. 2) getItem returns a string — JSON.parse it before push. 3) Pushing to saved doesn't change todos or re-save — update the one state array, save it, then render. (Also: close your <li>.)`,
    },
  },
  {
    number: 23, stage: "javascript", topic: "Game logic",
    concepts: "setTimeout/setInterval, randomness, game state, start/stop, scoring",
    project: "Whack-a-Mole",
    description: "Moles pop up randomly; click them for points before the timer runs out.",
    stretch: "Difficulty levels and a best-score board.",
    resource: MDN_TIMERS,
    katas: "one 8-kyu kata; from now on, also one Clash of Code round per week",
    days: [
      t(1, "learn", "Timers", "setTimeout vs setInterval, clearing them, passing functions not calls. Prove it: a 10-second countdown that can be paused and resumed.", MDN_TIMERS),
      t(2, "learn", "Randomness & timing", "Math.random ranges, random intervals, avoiding the same hole twice. Prove it: a light that jumps to a random square every 0.5–1.5s.", MDN_TIMERS),
      t(3, "learn", "Game state", "idle → running → over; what each button does in each state; why a stray timer is a bug. Prove it: start/stop that never double-starts.", MDN_JS),
      t(4, "practice", "Game drills", "Score that only counts a mole once; a visible time bar; a 'game over' overlay. Log every timing bug — there'll be several.", MDN_TIMERS),
      t(5, "build", "Build: Whack-a-Mole", "Grid of holes, random pops, click scoring, 30-second round, best score saved. Push to week-23/."),
    ],
    drill: {
      code: `let score = 0;
setInterval(popMole, 1000);
function popMole() {
  const hole = holes[Math.floor(Math.random() * holes.length + 1)];
  hole.classList.add("up");
  setTimeout(hole.classList.remove("up"), 800);
}`,
      solution: `1) The + 1 makes the index go one past the end sometimes — Math.floor(Math.random() * holes.length). 2) setTimeout needs a function — () => hole.classList.remove("up"). 3) The interval is never cleared, so the game never ends — store it and clearInterval on game over.`,
    },
  },
  {
    number: 24, stage: "javascript", topic: "Time & structure",
    concepts: "formatting time, closures, functions as values, modules in the browser",
    project: "Pomodoro Timer",
    description: "A 25/5 study timer with start, pause, reset, and a session count.",
    stretch: "Custom durations and a chime (Web Audio) when a session ends.",
    resource: MDN_JS,
    katas: "one 7-kyu kata; one Clash of Code round",
    days: [
      t(1, "learn", "Formatting time", "Minutes/seconds from a total, padStart, avoiding drift. Prove it: a display that reads 24:59, 24:58… correctly.", MDN_JS),
      t(2, "learn", "Functions as values", "Passing and returning functions, closures — why a function 'remembers' its variables. Prove it: makeCounter() returns a function that counts up each call; two counters don't share.", MDN_JS),
      t(3, "learn", "Splitting the code", "ES modules in the browser (type='module'), one file per concern. Prove it: timer.js (logic), ui.js (DOM), main.js (wiring).", MDN_JS),
      t(4, "practice", "Timer drills", "Pause/resume without losing time; a work/break toggle; a session counter that persists.", MDN_TIMERS),
      t(5, "build", "Build: Pomodoro", "Work/break cycles, start/pause/reset, sessions counted and saved, split into modules. Push to week-24/."),
    ],
    drill: {
      code: `let seconds = 1500;
const timer = setInterval(() => {
  seconds - 1;
  display.textContent = seconds / 60 + ":" + seconds % 60;
  if (seconds === 0) clearInterval(timer);
});`,
      solution: `1) seconds - 1 doesn't change anything — seconds -= 1. 2) setInterval has no delay — add 1000. 3) 1500/60 is 25 but 1499/60 is 24.98… — use Math.floor for minutes and padStart(2, "0") for seconds.`,
    },
  },
  {
    number: 25, stage: "javascript", topic: "Big build I",
    concepts: "planning a real project, shuffling, matching logic, locking input, everything so far",
    project: "Memory Game — build",
    description: "A card grid: flip two, match pairs, count moves. Your biggest build yet.",
    stretch: "A theme of your own (emoji, your photos, band logos).",
    resource: JS,
    katas: "one Clash of Code round — and screenshot one you lost for the call",
    days: [
      t(1, "learn", "Plan it", "Cards as data (id, value, flipped, matched); the state machine (0, 1, or 2 cards up); what render() draws. Prove it: the plan in README.md and a static grid rendered from data.", JS),
      t(2, "build", "Shuffle & flip", "Correct shuffle (Fisher-Yates — look up why sort(Math.random) is wrong); click flips a card; a second click on the same card is ignored.", JS),
      t(3, "build", "Matching", "Two up: match → stay; no match → flip back after a delay; input locked during the delay. Log the bugs — this step has the most.", JS),
      t(4, "build", "Score & win", "Move counter, matched-pairs count, win detection, restart. Prove it: play to the end five times, no glitches.", JS),
      t(5, "build", "Checkpoint", "Refactor: state → render, small functions, no dead code, comments that explain why. Push to week-25/. Next week is polish and shipping."),
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
      solution: `1) The comparator must return negative/positive — Math.random() - 0.5 (and even that's biased; use Fisher-Yates). 2) first is never reset after the second card, so the third flip compares against the wrong card — set first = null after handling. 3) Clicking the same card twice matches it with itself — ignore clicks on an already-flipped card. (Also: flip back after a delay so the player sees the second card.)`,
    },
  },
  {
    number: 26, stage: "javascript", topic: "Big build II — ship it",
    concepts: "polish, timers, best times, publishing, retrospective",
    project: "Memory Game — finish & publish",
    description: "A win screen, a timer, a best-time record, and it's live on your portfolio.",
    stretch: "Sound, animations, or a two-player mode.",
    resource: GH_PAGES,
    katas: "one Clash of Code round; then re-solve your very first Week 1 kata and compare",
    days: [
      t(1, "build", "Timer & best time", "Elapsed timer, best time saved with localStorage (handle 'no best yet'), win screen shows both.", MDN_STORAGE),
      t(2, "build", "Polish", "Flip animation (CSS transform), keyboard access, reduced motion respected, looks right on a phone.", MDN_CSS),
      t(3, "build", "Test it hard", "Ask two people to try to break it. Log every bug they find; fix them.", JS),
      t(4, "build", "Publish", "Add it to your portfolio with a screenshot and a paragraph; live on GitHub Pages; link sent to your mentor.", GH_PAGES),
      t(5, "build", "Retrospective", "Write RETRO.md: what was hardest, what you'd do differently, three things you can do now that you couldn't in Week 1. Reread your bug journal from Week 1. Stage gate: explain how the game knows two cards match — and what comes next: your capstone."),
    ],
    drill: {
      code: `<script src="/js/game.js"></script>
<script>
  localStorage.setItem("best", bestTime);   // bestTime is a number
  const best = localStorage.getItem("best");
  if (time < best) localStorage.setItem("best", time);
</script>`,
      solution: `1) A root-relative /js/… path breaks on a GitHub project-pages URL — use a relative js/game.js. 2) getItem returns a string — Number(best) before comparing. 3) When there's no best yet, getItem is null (which coerces to 0, so nothing ever beats it) — treat null as 'no record' and save the first time.`,
    },
  },
];

export const curriculum: Curriculum = {
  slug: "coding-journey",
  title: "Coding Journey",
  weeks,
};

// --- day plan -----------------------------------------------------------------
// Days 1–5 are authored per week. Day 6 (challenge) and Day 7 (rest) are
// derived so we don't hand-maintain them 26 times.

export function weekTasks(week: Week): Task[] {
  const katas = week.stage === "python" ? CODEWARS : CODEWARS_JS;
  const challenge: Task = {
    day: 6,
    kind: "challenge",
    title: "Challenge day",
    instruction: `${week.katas}. Then the debug drill: read the code and find the bugs BEFORE running it, fix them, then reveal the solution. Log anything that surprised you.`,
    resource: week.number >= 9 ? CLASH : katas,
    code: week.drill.code,
    solution: week.drill.solution,
  };
  const rest: Task = {
    day: 7,
    kind: "rest",
    title: "Rest",
    instruction: "Genuinely off. Your brain files the week away while you're not looking.",
  };
  return [...week.days, challenge, rest];
}
