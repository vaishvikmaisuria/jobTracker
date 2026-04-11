import { create } from "zustand";
import type { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilters } from "@job-tracker/types";
import { LocalResourceRepository } from "@job-tracker/storage";
import { seedResources } from "@job-tracker/core";

const SEEDED_KEY = "job_tracker_resources_seeded";
const repo = new LocalResourceRepository();

interface ResourceStore {
  resources: Resource[];
  loading: boolean;
  filters: ResourceFilters;
  selectedResource: Resource | null;

  init(): Promise<void>;
  setFilters(filters: ResourceFilters): void;
  selectResource(resource: Resource | null): void;

  createResource(input: CreateResourceInput): Promise<Resource>;
  updateResource(id: string, input: UpdateResourceInput): Promise<void>;
  deleteResource(id: string): Promise<void>;

  refresh(): Promise<void>;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: [],
  loading: false,
  filters: {},
  selectedResource: null,

  async init() {
    if (typeof window !== "undefined" && !localStorage.getItem(SEEDED_KEY)) {
      for (const resource of seedResources) {
        const all = JSON.parse(localStorage.getItem("job_tracker_resources") ?? "[]");
        if (!all.find((r: Resource) => r.id === resource.id)) {
          all.push(resource);
          localStorage.setItem("job_tracker_resources", JSON.stringify(all));
        }
      }
      localStorage.setItem(SEEDED_KEY, "1");
    }
    await get().refresh();
  },

  setFilters(filters) {
    set({ filters });
    get().refresh();
  },

  selectResource(resource) {
    set({ selectedResource: resource });
  },

  async createResource(input) {
    const resource = await repo.create(input);
    await get().refresh();
    return resource;
  },

  async updateResource(id, input) {
    await repo.update(id, input);
    const { selectedResource } = get();
    await get().refresh();
    if (selectedResource?.id === id) {
      const updated = await repo.getById(id);
      set({ selectedResource: updated });
    }
  },

  async deleteResource(id) {
    await repo.delete(id);
    const { selectedResource } = get();
    if (selectedResource?.id === id) set({ selectedResource: null });
    await get().refresh();
  },

  async refresh() {
    set({ loading: true });
    const resources = await repo.search(get().filters);
    set({ resources, loading: false });
  },
}));
