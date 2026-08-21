// lib/instruction.ts
//
// Task instructions embed a "Prove it:" callout inline as prose. This is the
// only place that knows how to split it back out for rendering.

export interface SplitInstruction {
  body: string;
  proveIt?: string;
}

const MARKER = "Prove it:";

export function splitInstruction(instruction: string): SplitInstruction {
  const index = instruction.indexOf(MARKER);
  if (index === -1) return { body: instruction.trim() };
  return {
    body: instruction.slice(0, index).trim(),
    proveIt: instruction.slice(index + MARKER.length).trim(),
  };
}
