import { create } from "zustand";
import type { Job, CreateJobInput, UpdateJobInput, JobFilters, SortConfig, JobSortField } from "@job-tracker/types";
import { LocalJobRepository } from "@job-tracker/storage";
import { seedJobs } from "@job-tracker/core";

const SEEDED_KEY = "job_tracker_jobs_seeded";
const repo = new LocalJobRepository();

interface JobStore {
  jobs: Job[];
  loading: boolean;
  filters: JobFilters;
  sort: SortConfig<JobSortField>;
  selectedJob: Job | null;

  init(): Promise<void>;
  setFilters(filters: JobFilters): void;
  setSort(sort: SortConfig<JobSortField>): void;
  selectJob(job: Job | null): void;

  createJob(input: CreateJobInput): Promise<Job>;
  updateJob(id: string, input: UpdateJobInput): Promise<void>;
  deleteJob(id: string): Promise<void>;

  refresh(): Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  loading: false,
  filters: {},
  sort: { field: "dateApplied", direction: "desc" },
  selectedJob: null,

  async init() {
    // Seed on first launch
    if (typeof window !== "undefined" && !localStorage.getItem(SEEDED_KEY)) {
      for (const job of seedJobs) {
        const existing = await repo.getById(job.id);
        if (!existing) {
          // Store seed directly (bypass repo.create to preserve seed IDs)
          const all = JSON.parse(localStorage.getItem("job_tracker_jobs") ?? "[]");
          all.push(job);
          localStorage.setItem("job_tracker_jobs", JSON.stringify(all));
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

  setSort(sort) {
    set({ sort });
    get().refresh();
  },

  selectJob(job) {
    set({ selectedJob: job });
  },

  async createJob(input) {
    const job = await repo.create(input);
    await get().refresh();
    return job;
  },

  async updateJob(id, input) {
    await repo.update(id, input);
    const { selectedJob } = get();
    await get().refresh();
    // Re-select updated job
    if (selectedJob?.id === id) {
      const updated = await repo.getById(id);
      set({ selectedJob: updated });
    }
  },

  async deleteJob(id) {
    await repo.delete(id);
    const { selectedJob } = get();
    if (selectedJob?.id === id) set({ selectedJob: null });
    await get().refresh();
  },

  async refresh() {
    set({ loading: true });
    const jobs = await repo.search(get().filters, get().sort);
    set({ jobs, loading: false });
  },
}));
