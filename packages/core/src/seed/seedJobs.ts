import type { Job } from "@job-tracker/types";
import { JobStatus, JobPriority } from "@job-tracker/types";

export const seedJobs: Job[] = [
	{
		id: "seed-job-1",
		companyName: "Google",
		location: "Mountain View, CA",
		status: JobStatus.Interviewing,
		roleOrPosition: "Software Engineer II",
		mainContact: "Jane Smith",
		contactEmail: "jane.smith@google.com",
		dateApplied: "2024-03-01",
		lastContact: "2024-03-15",
		likelihoodOfHiring: 70,
		tags: ["FAANG", "SWE", "Big Tech"],
		notes: "Two technical rounds completed. System design next.",
		salaryRange: "$180k – $220k",
		jobPostingUrl: "https://careers.google.com",
		priority: JobPriority.High,
		requiresFollowUp: false,
		createdAt: "2024-03-01T10:00:00.000Z",
		updatedAt: "2024-03-15T14:00:00.000Z",
	},
];
