import type {
	Resource,
	CreateResourceInput,
	UpdateResourceInput,
	ResourceFilters,
} from "@job-tracker/types";
import type { IResourceRepository } from "../interfaces/IResourceRepository";
import type { IAsyncStorageAdapter } from "../interfaces/IStorageAdapter";
import { STORAGE_KEYS } from "../constants";
import { generateId, now } from "../utils";
import { readCollectionAsync, writeCollectionAsync } from "./storageHelpers";

const STORAGE_KEY = STORAGE_KEYS.resources;

export class AsyncResourceRepository implements IResourceRepository {
	constructor(private readonly storage: IAsyncStorageAdapter) {}

	private loadResources(): Promise<Resource[]> {
		return readCollectionAsync<Resource>(this.storage, STORAGE_KEY);
	}

	private saveResources(resources: Resource[]): Promise<void> {
		return writeCollectionAsync(this.storage, STORAGE_KEY, resources);
	}

	async getAll(): Promise<Resource[]> {
		return this.loadResources();
	}

	async getById(id: string): Promise<Resource | null> {
		return (await this.loadResources()).find((r) => r.id === id) ?? null;
	}

	async create(input: CreateResourceInput): Promise<Resource> {
		const resources = await this.loadResources();
		const resource: Resource = {
			...input,
			id: generateId(),
			createdAt: now(),
			updatedAt: now(),
		};
		await this.saveResources([...resources, resource]);
		return resource;
	}

	async update(
		id: string,
		input: UpdateResourceInput,
	): Promise<Resource | null> {
		const resources = await this.loadResources();
		const index = resources.findIndex((r) => r.id === id);
		if (index === -1) return null;
		const updated: Resource = {
			...resources[index],
			...input,
			updatedAt: now(),
		};
		resources[index] = updated;
		await this.saveResources(resources);
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const resources = await this.loadResources();
		const next = resources.filter((r) => r.id !== id);
		if (next.length === resources.length) return false;
		await this.saveResources(next);
		return true;
	}

	async search(filters: ResourceFilters): Promise<Resource[]> {
		let resources = await this.loadResources();

		if (filters.search) {
			const q = filters.search.toLowerCase();
			resources = resources.filter(
				(r) =>
					r.title.toLowerCase().includes(q) ||
					(r.description ?? "").toLowerCase().includes(q),
			);
		}

		if (filters.category?.length) {
			resources = resources.filter((r) =>
				filters.category!.includes(r.category),
			);
		}

		if (filters.type?.length) {
			resources = resources.filter((r) => filters.type!.includes(r.type));
		}

		if (filters.tags?.length) {
			resources = resources.filter((r) =>
				filters.tags!.some((t) => r.tags.includes(t)),
			);
		}

		return resources;
	}
}
