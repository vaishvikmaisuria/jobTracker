import type {
	Problem,
	CreateProblemInput,
	UpdateProblemInput,
	ProblemFilters,
	SortConfig,
	ProblemSortField,
} from "@job-tracker/types";
import type { IProblemRepository } from "../interfaces/IProblemRepository";
import type { ISyncStorageAdapter } from "../interfaces/IStorageAdapter";
import { STORAGE_KEYS } from "../constants";
import { generateId, now } from "../utils";
import {
	browserStorageAdapter,
	readCollectionSync,
	writeCollectionSync,
} from "./storageHelpers";

const STORAGE_KEY = STORAGE_KEYS.problems;

export class LocalProblemRepository implements IProblemRepository {
	constructor(
		private readonly storage: ISyncStorageAdapter = browserStorageAdapter,
	) {}

	private loadProblems(): Problem[] {
		return readCollectionSync<Problem>(this.storage, STORAGE_KEY);
	}

	private saveProblems(problems: Problem[]): void {
		writeCollectionSync(this.storage, STORAGE_KEY, problems);
	}

	async getAll(): Promise<Problem[]> {
		return this.loadProblems();
	}

	async getById(id: string): Promise<Problem | null> {
		return this.loadProblems().find((p) => p.id === id) ?? null;
	}

	async create(input: CreateProblemInput): Promise<Problem> {
		const problems = this.loadProblems();
		const problem: Problem = {
			...input,
			id: generateId(),
			createdAt: now(),
			updatedAt: now(),
		};
		this.saveProblems([...problems, problem]);
		return problem;
	}

	async update(
		id: string,
		input: UpdateProblemInput,
	): Promise<Problem | null> {
		const problems = this.loadProblems();
		const index = problems.findIndex((p) => p.id === id);
		if (index === -1) return null;
		const updated: Problem = {
			...problems[index],
			...input,
			updatedAt: now(),
		};
		problems[index] = updated;
		this.saveProblems(problems);
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const problems = this.loadProblems();
		const next = problems.filter((p) => p.id !== id);
		if (next.length === problems.length) return false;
		this.saveProblems(next);
		return true;
	}

	async search(
		filters: ProblemFilters,
		sort?: SortConfig<ProblemSortField>,
	): Promise<Problem[]> {
		let problems = this.loadProblems();

		if (filters.search) {
			const q = filters.search.toLowerCase();
			problems = problems.filter((p) => p.name.toLowerCase().includes(q));
		}

		if (filters.difficulty?.length) {
			problems = problems.filter((p) =>
				filters.difficulty!.includes(p.difficulty),
			);
		}

		if (filters.status?.length) {
			problems = problems.filter((p) =>
				filters.status!.includes(p.status),
			);
		}

		if (filters.type?.length) {
			problems = problems.filter((p) => filters.type!.includes(p.type));
		}

		if (filters.isFavorite !== undefined) {
			problems = problems.filter(
				(p) => p.isFavorite === filters.isFavorite,
			);
		}

		if (sort) {
			problems.sort((a, b) => {
				const aVal = a[sort.field] ?? "";
				const bVal = b[sort.field] ?? "";
				const cmp = String(aVal).localeCompare(String(bVal));
				return sort.direction === "asc" ? cmp : -cmp;
			});
		}

		return problems;
	}
}
