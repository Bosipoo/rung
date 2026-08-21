// lib/pushTarget.ts
//
// Build-day instructions end with a "Push to <path>." sentence. This is the
// only place that knows how to pull the path back out.

const PUSH_PATTERN = /Push to (week-\d+\/\S*)/;

export function parsePushTarget(instruction: string): string | undefined {
  const match = instruction.match(PUSH_PATTERN);
  return match ? match[1].replace(/\.$/, "") : undefined;
}
