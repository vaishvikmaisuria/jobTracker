import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  JobFilters,
  SortConfig,
  JobSortField,
} from "@job-tracker/types";
import type { IJobRepository } from "../interfaces/IJobRepository";
import { generateId, now } from "../utils";

const STORAGE_KEY = "job_tracker_jobs";

function loadJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Job[]) : [];
  } catch {
    return [];
  }
}

function saveJobs(jobs: Job[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export class LocalJobRepository implements IJobRepository {
  async getAll(): Promise<Job[]> {
    return loadJobs();
  }

  async getById(id: string): Promise<Job | null> {
    const jobs = loadJobs();
    return jobs.find((j) => j.id === id) ?? null;
  }

  async create(input: CreateJobInput): Promise<Job> {
    const jobs = loadJobs();
    const job: Job = {
      ...input,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    saveJobs([...jobs, job]);
    return job;
  }

  async update(id: string, input: UpdateJobInput): Promise<Job | null> {
    const jobs = loadJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    const updated: Job = { ...jobs[index], ...input, updatedAt: now() };
    jobs[index] = updated;
    saveJobs(jobs);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const jobs = loadJobs();
    const next = jobs.filter((j) => j.id !== id);
    if (next.length === jobs.length) return false;
    saveJobs(next);
    return true;
  }

  async search(
    filters: JobFilters,
    sort?: SortConfig<JobSortField>
  ): Promise<Job[]> {
    let jobs = loadJobs();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.companyName.toLowerCase().includes(q) ||
          j.roleOrPosition.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }

    if (filters.status?.length) {
      jobs = jobs.filter((j) => filters.status!.includes(j.status));
    }

    if (filters.tags?.length) {
      jobs = jobs.filter((j) =>
        filters.tags!.some((t) => j.tags.includes(t))
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
