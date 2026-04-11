"use client";

import { Badge } from "@/components/ui";
import { DIFFICULTY_COLORS, PROBLEM_STATUS_COLORS } from "@job-tracker/core";
import type { ProblemDifficulty, ProblemStatus } from "@job-tracker/types";

export function DifficultyBadge({ difficulty }: { difficulty: ProblemDifficulty }) {
  const colors = DIFFICULTY_COLORS[difficulty];
  return <Badge className={`${colors.bg} ${colors.text}`}>{difficulty}</Badge>;
}

export function ProblemStatusBadge({ status }: { status: ProblemStatus }) {
  const colors = PROBLEM_STATUS_COLORS[status];
  return <Badge className={`${colors.bg} ${colors.text}`}>{status}</Badge>;
}
