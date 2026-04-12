import type { Job, Problem, Resource } from "@job-tracker/types";

export interface ExportedData {
	version: string;
	exportedAt: string;
	jobs: Job[];
	problems: Problem[];
	resources: Resource[];
}

/**
 * Export all data to a JSON file
 */
export function exportToJSON(
	jobs: Job[],
	problems: Problem[],
	resources: Resource[],
): void {
	const data: ExportedData = {
		version: "1.0.0",
		exportedAt: new Date().toISOString(),
		jobs,
		problems,
		resources,
	};

	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `job-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file
 * Returns deduplicated data (skips items with duplicate IDs)
 */
export async function importFromJSON(
	file: File,
	existingJobs: Job[],
	existingProblems: Problem[],
	existingResources: Resource[],
): Promise<{
	jobs: Job[];
	problems: Problem[];
	resources: Resource[];
	duplicateCounts: {
		jobs: number;
		problems: number;
		resources: number;
	};
	error?: string;
}> {
	try {
		const text = await file.text();
		const data = JSON.parse(text) as ExportedData;

		if (!data.jobs || !data.problems || !data.resources) {
			return {
				jobs: [],
				problems: [],
				resources: [],
				duplicateCounts: { jobs: 0, problems: 0, resources: 0 },
				error: "Invalid file format. Missing jobs, problems, or resources.",
			};
		}

		const existingJobIds = new Set(existingJobs.map((j) => j.id));
		const existingProblemIds = new Set(existingProblems.map((p) => p.id));
		const existingResourceIds = new Set(existingResources.map((r) => r.id));

		const newJobs = data.jobs.filter((j) => !existingJobIds.has(j.id));
		const newProblems = data.problems.filter(
			(p) => !existingProblemIds.has(p.id),
		);
		const newResources = data.resources.filter(
			(r) => !existingResourceIds.has(r.id),
		);

		const duplicateCounts = {
			jobs: data.jobs.length - newJobs.length,
			problems: data.problems.length - newProblems.length,
			resources: data.resources.length - newResources.length,
		};

		return {
			jobs: newJobs,
			problems: newProblems,
			resources: newResources,
			duplicateCounts,
		};
	} catch (error) {
		return {
			jobs: [],
			problems: [],
			resources: [],
			duplicateCounts: { jobs: 0, problems: 0, resources: 0 },
			error:
				error instanceof Error ? error.message : "Failed to parse file",
		};
	}
}
