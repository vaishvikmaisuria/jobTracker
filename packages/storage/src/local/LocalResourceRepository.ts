import type {
  Resource,
  CreateResourceInput,
  UpdateResourceInput,
  ResourceFilters,
} from "@job-tracker/types";
import type { IResourceRepository } from "../interfaces/IResourceRepository";
import { generateId, now } from "../utils";

const STORAGE_KEY = "job_tracker_resources";

function loadResources(): Resource[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Resource[]) : [];
  } catch {
    return [];
  }
}

function saveResources(resources: Resource[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

export class LocalResourceRepository implements IResourceRepository {
  async getAll(): Promise<Resource[]> {
    return loadResources();
  }

  async getById(id: string): Promise<Resource | null> {
    return loadResources().find((r) => r.id === id) ?? null;
  }

  async create(input: CreateResourceInput): Promise<Resource> {
    const resources = loadResources();
    const resource: Resource = {
      ...input,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    saveResources([...resources, resource]);
    return resource;
  }

  async update(id: string, input: UpdateResourceInput): Promise<Resource | null> {
    const resources = loadResources();
    const index = resources.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const updated: Resource = { ...resources[index], ...input, updatedAt: now() };
    resources[index] = updated;
    saveResources(resources);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const resources = loadResources();
    const next = resources.filter((r) => r.id !== id);
    if (next.length === resources.length) return false;
    saveResources(next);
    return true;
  }

  async search(filters: ResourceFilters): Promise<Resource[]> {
    let resources = loadResources();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q)
      );
    }

    if (filters.category?.length) {
      resources = resources.filter((r) =>
        filters.category!.includes(r.category)
      );
    }

    if (filters.type?.length) {
      resources = resources.filter((r) => filters.type!.includes(r.type));
    }

    if (filters.tags?.length) {
      resources = resources.filter((r) =>
        filters.tags!.some((t) => r.tags.includes(t))
      );
    }

    return resources;
  }
}
