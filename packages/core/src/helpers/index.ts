import { JobStatus, JobPriority, ProblemDifficulty, ProblemStatus } from "@job-tracker/types";

// ─── Job Status Styles ────────────────────────────────────────────────────────

export const JOB_STATUS_COLORS: Record<JobStatus, { bg: string; text: string; dot: string }> = {
  [JobStatus.Applied]:           { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500" },
  [JobStatus.RecruiterReachout]: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  [JobStatus.OAScheduled]:       { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  [JobStatus.OACompleted]:       { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  [JobStatus.Interviewing]:      { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  [JobStatus.FinalRound]:        { bg: "bg-cyan-100",   text: "text-cyan-700",   dot: "bg-cyan-500" },
  [JobStatus.NegotiatingOffer]:  { bg: "bg-teal-100",   text: "text-teal-700",   dot: "bg-teal-500" },
  [JobStatus.OfferReceived]:     { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
  [JobStatus.Rejected]:          { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500" },
  [JobStatus.Ghosted]:           { bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400" },
  [JobStatus.OnHold]:            { bg: "bg-slate-100",  text: "text-slate-600",  dot: "bg-slate-400" },
  [JobStatus.RequiresFollowUp]:  { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500" },
};

export const JOB_PRIORITY_COLORS: Record<JobPriority, { bg: string; text: string }> = {
  [JobPriority.Low]:    { bg: "bg-green-50",  text: "text-green-600" },
  [JobPriority.Medium]: { bg: "bg-yellow-50", text: "text-yellow-600" },
  [JobPriority.High]:   { bg: "bg-red-50",    text: "text-red-600" },
};

// ─── Problem Difficulty Styles ────────────────────────────────────────────────

export const DIFFICULTY_COLORS: Record<ProblemDifficulty, { bg: string; text: string }> = {
  [ProblemDifficulty.Easy]:   { bg: "bg-green-100",  text: "text-green-700" },
  [ProblemDifficulty.Medium]: { bg: "bg-yellow-100", text: "text-yellow-700" },
  [ProblemDifficulty.Hard]:   { bg: "bg-red-100",    text: "text-red-700" },
};

export const PROBLEM_STATUS_COLORS: Record<ProblemStatus, { bg: string; text: string }> = {
  [ProblemStatus.NotStarted]:    { bg: "bg-gray-100",   text: "text-gray-600" },
  [ProblemStatus.Attempted]:     { bg: "bg-yellow-100", text: "text-yellow-700" },
  [ProblemStatus.Solved]:        { bg: "bg-green-100",  text: "text-green-700" },
  [ProblemStatus.NeedsRevision]: { bg: "bg-orange-100", text: "text-orange-700" },
};

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function toInputDateValue(dateStr: string | undefined): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

import type { Job, Problem, Resource, DashboardStats } from "@job-tracker/types";

export function computeDashboardStats(
  jobs: Job[],
  problems: Problem[],
  resources: Resource[]
): DashboardStats {
  return {
    totalApplications: jobs.length,
    activeInterviews: jobs.filter(
      (j) =>
        j.status === JobStatus.Interviewing ||
        j.status === JobStatus.FinalRound
    ).length,
    offers: jobs.filter((j) => j.status === JobStatus.OfferReceived).length,
    rejections: jobs.filter((j) => j.status === JobStatus.Rejected).length,
    solvedProblems: problems.filter(
      (p) => p.status === ProblemStatus.Solved
    ).length,
    totalProblems: problems.length,
    savedLinks: resources.length,
  };
}
