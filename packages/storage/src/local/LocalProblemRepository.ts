import type {
  Problem,
  CreateProblemInput,
  UpdateProblemInput,
  ProblemFilters,
  SortConfig,
  ProblemSortField,
} from "@job-tracker/types";
import type { IProblemRepository } from "../interfaces/IProblemRepository";
import { generateId, now } from "../utils";

const STORAGE_KEY = "job_tracker_problems";

function loadProblems(): Problem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Problem[]) : [];
  } catch {
    return [];
  }
}

function saveProblems(problems: Problem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

export class LocalProblemRepository implements IProblemRepository {
  async getAll(): Promise<Problem[]> {
    return loadProblems();
  }

  async getById(id: string): Promise<Problem | null> {
    return loadProblems().find((p) => p.id === id) ?? null;
  }

  async create(input: CreateProblemInput): Promise<Problem> {
    const problems = loadProblems();
    const problem: Problem = {
      ...input,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    saveProblems([...problems, problem]);
    return problem;
  }

  async update(id: string, input: UpdateProblemInput): Promise<Problem | null> {
    const problems = loadProblems();
    const index = problems.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Problem = { ...problems[index], ...input, updatedAt: now() };
    problems[index] = updated;
    saveProblems(problems);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const problems = loadProblems();
    const next = problems.filter((p) => p.id !== id);
    if (next.length === problems.length) return false;
    saveProblems(next);
    return true;
  }

  async search(
    filters: ProblemFilters,
    sort?: SortConfig<ProblemSortField>
  ): Promise<Problem[]> {
    let problems = loadProblems();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      problems = problems.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    if (filters.difficulty?.length) {
      problems = problems.filter((p) =>
        filters.difficulty!.includes(p.difficulty)
      );
    }

    if (filters.status?.length) {
      problems = problems.filter((p) =>
        filters.status!.includes(p.status)
      );
    }

    if (filters.type?.length) {
      problems = problems.filter((p) => filters.type!.includes(p.type));
    }

    if (filters.isFavorite !== undefined) {
      problems = problems.filter((p) => p.isFavorite === filters.isFavorite);
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
