"use client";

import { useState } from "react";

interface RevealSolutionProps {
  solution: string;
}

export function RevealSolution({ solution }: RevealSolutionProps) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-2 text-xs text-cyan underline"
      >
        Reveal solution
      </button>
    );
  }

  return <p className="mt-2 text-sm text-foreground/70">{solution}</p>;
}
