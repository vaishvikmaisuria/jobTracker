"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useJobStore } from "@/store/jobStore";
import { useProblemStore } from "@/store/problemStore";
import { useResourceStore } from "@/store/resourceStore";
import { computeDashboardStats, JOB_STATUS_COLORS } from "@job-tracker/core";
import { JobStatus, ProblemStatus } from "@job-tracker/types";
import { StatCard, Badge } from "@/components/ui";
import { JobStatusBadge } from "@/components/jobs/JobBadges";
import { DifficultyBadge } from "@/components/leetcode/ProblemBadges";
import {
  Briefcase,
  Code2,
  BookMarked,
  TrendingUp,
  Star,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@job-tracker/core";

export function DashboardPage() {
  const { jobs, init: initJobs } = useJobStore();
  const { problems, init: initProblems } = useProblemStore();
  const { resources, init: initResources } = useResourceStore();

  useEffect(() => {
    initJobs();
    initProblems();
    initResources();
  }, []);

  const stats = computeDashboardStats(jobs, problems, resources);
  const recentJobs = [...jobs].slice(0, 5);
  const favProblems = problems.filter((p) => p.isFavorite).slice(0, 4);
  const activeJobs = jobs.filter((j) =>
    [JobStatus.Interviewing, JobStatus.FinalRound, JobStatus.NegotiatingOffer].includes(j.status)
  );

  return (
    <div className="p-6 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Your job hunt overview at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<Briefcase size={18} />}
          color="bg-indigo-500"
        />
        <StatCard
          title="Active Interviews"
          value={stats.activeInterviews}
          icon={<TrendingUp size={18} />}
          color="bg-cyan-500"
        />
        <StatCard
          title="Offers"
          value={stats.offers}
          icon={<CheckCircle2 size={18} />}
          color="bg-green-500"
        />
        <StatCard
          title="Solved Problems"
          value={`${stats.solvedProblems} / ${stats.totalProblems}`}
          icon={<Code2 size={18} />}
          color="bg-violet-500"
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <SectionCard
          title="Recent Applications"
          linkHref="/jobs"
          linkLabel="View all"
          icon={<Briefcase size={16} />}
        >
          {recentJobs.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentJobs.map((job) => (
                <li key={job.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{job.companyName}</p>
                    <p className="text-xs text-slate-500 truncate">{job.roleOrPosition}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <JobStatusBadge status={job.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Active Interviews */}
        <SectionCard
          title="Active Interviews"
          linkHref="/jobs"
          linkLabel="View all"
          icon={<TrendingUp size={16} />}
        >
          {activeJobs.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No active interviews.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {activeJobs.map((job) => (
                <li key={job.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{job.companyName}</p>
                    <p className="text-xs text-slate-500">{formatDate(job.lastContact ?? job.dateApplied)}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Favorite Problems */}
        <SectionCard
          title="Favorite Problems"
          linkHref="/leetcode"
          linkLabel="View all"
          icon={<Code2 size={16} />}
        >
          {favProblems.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No favorite problems yet.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {favProblems.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                  </div>
                  <DifficultyBadge difficulty={p.difficulty} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Saved Resources */}
        <SectionCard
          title="Saved Resources"
          linkHref="/resources"
          linkLabel="View all"
          icon={<BookMarked size={16} />}
        >
          {resources.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No resources saved yet.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {resources.slice(0, 4).map((r) => (
                <li key={r.id} className="py-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    {r.title}
                  </a>
                  <p className="text-xs text-slate-500 truncate">{r.description}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  linkHref,
  linkLabel,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  linkHref: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div className="flex items-center gap-2 text-slate-700">
          {icon}
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <Link href={linkHref} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          {linkLabel} →
        </Link>
      </div>
      <div className="px-5 pb-2">{children}</div>
    </div>
  );
}
