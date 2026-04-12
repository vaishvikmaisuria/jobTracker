import { create } from "zustand";
import {
	AsyncJobRepository,
	AsyncProblemRepository,
	AsyncResourceRepository,
	STORAGE_KEYS,
} from "@job-tracker/storage";
import {
	jobSchema,
	problemSchema,
	resourceSchema,
	seedJobs,
	seedProblems,
	seedResources,
} from "@job-tracker/core";
import { ProblemStatus } from "@job-tracker/types";
import type {
	Job,
	Problem,
	Resource,
	CreateJobInput,
	CreateProblemInput,
	CreateResourceInput,
} from "@job-tracker/types";
import { asyncStorageAdapter } from "../storage/asyncStorageAdapter";

const SEEDED_FLAGS = {
	jobs: "job_tracker_mobile_jobs_seeded",
	problems: "job_tracker_mobile_problems_seeded",
	resources: "job_tracker_mobile_resources_seeded",
} as const;

const jobRepo = new AsyncJobRepository(asyncStorageAdapter);
const problemRepo = new AsyncProblemRepository(asyncStorageAdapter);
const resourceRepo = new AsyncResourceRepository(asyncStorageAdapter);

async function seedCollection<T extends { id: string }>(
	seededFlag: string,
	collectionKey: string,
	seedData: T[],
): Promise<void> {
	const alreadySeeded = await asyncStorageAdapter.getItem(seededFlag);
	if (alreadySeeded) return;

	await asyncStorageAdapter.setItem(collectionKey, JSON.stringify(seedData));
	await asyncStorageAdapter.setItem(seededFlag, "1");
}

async function seedMobileDataIfNeeded(): Promise<void> {
	await Promise.all([
		seedCollection(SEEDED_FLAGS.jobs, STORAGE_KEYS.jobs, seedJobs),
		seedCollection(
			SEEDED_FLAGS.problems,
			STORAGE_KEYS.problems,
			seedProblems,
		),
		seedCollection(
			SEEDED_FLAGS.resources,
			STORAGE_KEYS.resources,
			seedResources,
		),
	]);
}

interface MobileTrackerStore {
	jobs: Job[];
	problems: Problem[];
	resources: Resource[];
	loading: boolean;
	bootstrapped: boolean;
	error: string | null;

	init(): Promise<void>;
	refresh(): Promise<void>;

	addJob(input: CreateJobInput): Promise<void>;
	addProblem(input: CreateProblemInput): Promise<void>;
	addResource(input: CreateResourceInput): Promise<void>;

	markProblemSolved(problemId: string): Promise<void>;
	toggleFavoriteProblem(problemId: string): Promise<void>;
}

export const useMobileTrackerStore = create<MobileTrackerStore>((set, get) => ({
	jobs: [],
	problems: [],
	resources: [],
	loading: false,
	bootstrapped: false,
	error: null,

	async init() {
		set({ loading: true, error: null });
		try {
			await seedMobileDataIfNeeded();
			await get().refresh();
			set({ bootstrapped: true });
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to initialize app",
			});
		} finally {
			set({ loading: false });
		}
	},

	async refresh() {
		const [jobs, problems, resources] = await Promise.all([
			jobRepo.getAll(),
			problemRepo.getAll(),
			resourceRepo.getAll(),
		]);

		set({
			jobs,
			problems,
			resources,
			error: null,
		});
	},

	async addJob(input) {
		set({ loading: true, error: null });
		try {
			const payload = jobSchema.parse(input);
			await jobRepo.create(payload);
			await get().refresh();
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Invalid job data",
			});
		} finally {
			set({ loading: false });
		}
	},

	async addProblem(input) {
		set({ loading: true, error: null });
		try {
			const payload = problemSchema.parse(input);
			await problemRepo.create(payload);
			await get().refresh();
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Invalid problem data",
			});
		} finally {
			set({ loading: false });
		}
	},

	async addResource(input) {
		set({ loading: true, error: null });
		try {
			const payload = resourceSchema.parse(input);
			await resourceRepo.create(payload);
			await get().refresh();
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Invalid resource data",
			});
		} finally {
			set({ loading: false });
		}
	},

	async markProblemSolved(problemId) {
		const current = get().problems.find((item) => item.id === problemId);
		if (!current) return;

		set({ loading: true, error: null });
		try {
			await problemRepo.update(problemId, {
				status: ProblemStatus.Solved,
				solvedAt: new Date().toISOString().slice(0, 10),
			});
			await get().refresh();
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Could not update problem",
			});
		} finally {
			set({ loading: false });
		}
	},

	async toggleFavoriteProblem(problemId) {
		const current = get().problems.find((item) => item.id === problemId);
		if (!current) return;

		set({ loading: true, error: null });
		try {
			await problemRepo.update(problemId, {
				isFavorite: !current.isFavorite,
			});
			await get().refresh();
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Could not update favorite",
			});
		} finally {
			set({ loading: false });
		}
	},
}));
