"use client";

import { Badge } from "@/components/ui";
import { JOB_STATUS_COLORS, JOB_PRIORITY_COLORS } from "@job-tracker/core";
import type { JobStatus, JobPriority } from "@job-tracker/types";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const colors = JOB_STATUS_COLORS[status];
  return (
    <Badge className={`${colors.bg} ${colors.text}`} dot dotColor={colors.dot}>
      {status}
    </Badge>
  );
}

export function JobPriorityBadge({ priority }: { priority: JobPriority }) {
  const colors = JOB_PRIORITY_COLORS[priority];
  return (
    <Badge className={`${colors.bg} ${colors.text}`}>
      {priority}
    </Badge>
  );
}
