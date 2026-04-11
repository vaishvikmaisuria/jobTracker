import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  JobFilters,
  SortConfig,
  JobSortField,
} from "@job-tracker/types";

// ─── Repository Interfaces ────────────────────────────────────────────────────
// Decouple business logic from persistence.
// Swap LocalJobRepository → MongoJobRepository without touching UI code.

export interface IJobRepository {
  getAll(): Promise<Job[]>;
  getById(id: string): Promise<Job | null>;
  create(input: CreateJobInput): Promise<Job>;
  update(id: string, input: UpdateJobInput): Promise<Job | null>;
  delete(id: string): Promise<boolean>;
  search(filters: JobFilters, sort?: SortConfig<JobSortField>): Promise<Job[]>;
}

// TODO: MongoJobRepository – implement IJobRepository against MongoDB Atlas
// TODO: RedisJobRepository  – caching layer wrapping IJobRepository
