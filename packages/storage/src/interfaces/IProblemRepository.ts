import type {
  Problem,
  CreateProblemInput,
  UpdateProblemInput,
  ProblemFilters,
  SortConfig,
  ProblemSortField,
} from "@job-tracker/types";

export interface IProblemRepository {
  getAll(): Promise<Problem[]>;
  getById(id: string): Promise<Problem | null>;
  create(input: CreateProblemInput): Promise<Problem>;
  update(id: string, input: UpdateProblemInput): Promise<Problem | null>;
  delete(id: string): Promise<boolean>;
  search(filters: ProblemFilters, sort?: SortConfig<ProblemSortField>): Promise<Problem[]>;
}

// TODO: MongoProblemRepository – MongoDB implementation
// TODO: RedisProblemRepository – cache layer
