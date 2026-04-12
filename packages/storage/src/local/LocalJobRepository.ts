import type {
	Job,
	CreateJobInput,
	UpdateJobInput,
	JobFilters,
	SortConfig,
	JobSortField,
} from "@job-tracker/types";
import type { IJobRepository } from "../interfaces/IJobRepository";
import type { ISyncStorageAdapter } from "../interfaces/IStorageAdapter";
import { STORAGE_KEYS } from "../constants";
import { generateId, now } from "../utils";
import {
	browserStorageAdapter,
	readCollectionSync,
	writeCollectionSync,
} from "./storageHelpers";

const STORAGE_KEY = STORAGE_KEYS.jobs;

export class LocalJobRepository implements IJobRepository {
	constructor(
		private readonly storage: ISyncStorageAdapter = browserStorageAdapter,
	) {}

	private loadJobs(): Job[] {
		return readCollectionSync<Job>(this.storage, STORAGE_KEY);
	}

	private saveJobs(jobs: Job[]): void {
		writeCollectionSync(this.storage, STORAGE_KEY, jobs);
	}

	async getAll(): Promise<Job[]> {
		return this.loadJobs();
	}

	async getById(id: string): Promise<Job | null> {
		const jobs = this.loadJobs();
		return jobs.find((j) => j.id === id) ?? null;
	}

	async create(input: CreateJobInput): Promise<Job> {
		const jobs = this.loadJobs();
		const job: Job = {
			...input,
			id: generateId(),
			createdAt: now(),
			updatedAt: now(),
		};
		this.saveJobs([...jobs, job]);
		return job;
	}

	async update(id: string, input: UpdateJobInput): Promise<Job | null> {
		const jobs = this.loadJobs();
		const index = jobs.findIndex((j) => j.id === id);
		if (index === -1) return null;
		const updated: Job = { ...jobs[index], ...input, updatedAt: now() };
		jobs[index] = updated;
		this.saveJobs(jobs);
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const jobs = this.loadJobs();
		const next = jobs.filter((j) => j.id !== id);
		if (next.length === jobs.length) return false;
		this.saveJobs(next);
		return true;
	}

	async search(
		filters: JobFilters,
		sort?: SortConfig<JobSortField>,
	): Promise<Job[]> {
		let jobs = this.loadJobs();

		if (filters.search) {
			const q = filters.search.toLowerCase();
			jobs = jobs.filter(
				(j) =>
					j.companyName.toLowerCase().includes(q) ||
					j.roleOrPosition.toLowerCase().includes(q) ||
					j.location.toLowerCase().includes(q),
			);
		}

		if (filters.status?.length) {
			jobs = jobs.filter((j) => filters.status!.includes(j.status));
		}

		if (filters.tags?.length) {
			jobs = jobs.filter((j) =>
				filters.tags!.some((t) => j.tags.includes(t)),
			);
		}

		if (filters.priority?.length) {
			jobs = jobs.filter((j) => filters.priority!.includes(j.priority));
		}

		if (sort) {
			jobs.sort((a, b) => {
				const aVal = a[sort.field] ?? "";
				const bVal = b[sort.field] ?? "";
				const cmp = String(aVal).localeCompare(String(bVal));
				return sort.direction === "asc" ? cmp : -cmp;
			});
		}

		return jobs;
	}
}
