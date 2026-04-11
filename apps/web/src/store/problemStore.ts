import { create } from "zustand";
import type { Problem, CreateProblemInput, UpdateProblemInput, ProblemFilters, SortConfig, ProblemSortField } from "@job-tracker/types";
import { LocalProblemRepository } from "@job-tracker/storage";
import { seedProblems } from "@job-tracker/core";

const SEEDED_KEY = "job_tracker_problems_seeded";
const repo = new LocalProblemRepository();

interface ProblemStore {
  problems: Problem[];
  loading: boolean;
  filters: ProblemFilters;
  sort: SortConfig<ProblemSortField>;
  selectedProblem: Problem | null;

  init(): Promise<void>;
  setFilters(filters: ProblemFilters): void;
  setSort(sort: SortConfig<ProblemSortField>): void;
  selectProblem(problem: Problem | null): void;

  createProblem(input: CreateProblemInput): Promise<Problem>;
  updateProblem(id: string, input: UpdateProblemInput): Promise<void>;
  deleteProblem(id: string): Promise<void>;
  markSolved(id: string): Promise<void>;

  refresh(): Promise<void>;
}

export const useProblemStore = create<ProblemStore>((set, get) => ({
  problems: [],
  loading: false,
  filters: {},
  sort: { field: "name", direction: "asc" },
  selectedProblem: null,

  async init() {
    if (typeof window !== "undefined" && !localStorage.getItem(SEEDED_KEY)) {
      for (const problem of seedProblems) {
        const all = JSON.parse(localStorage.getItem("job_tracker_problems") ?? "[]");
        if (!all.find((p: Problem) => p.id === problem.id)) {
          all.push(problem);
          localStorage.setItem("job_tracker_problems", JSON.stringify(all));
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

  selectProblem(problem) {
    set({ selectedProblem: problem });
  },

  async createProblem(input) {
    const problem = await repo.create(input);
    await get().refresh();
    return problem;
  },

  async updateProblem(id, input) {
    await repo.update(id, input);
    const { selectedProblem } = get();
    await get().refresh();
    if (selectedProblem?.id === id) {
      const updated = await repo.getById(id);
      set({ selectedProblem: updated });
    }
  },

  async deleteProblem(id) {
    await repo.delete(id);
    const { selectedProblem } = get();
    if (selectedProblem?.id === id) set({ selectedProblem: null });
    await get().refresh();
  },

  async markSolved(id) {
    const { ProblemStatus } = await import("@job-tracker/types");
    await repo.update(id, {
      status: ProblemStatus.Solved,
      solvedAt: new Date().toISOString().slice(0, 10),
    });
    await get().refresh();
  },

  async refresh() {
    set({ loading: true });
    const problems = await repo.search(get().filters, get().sort);
    set({ problems, loading: false });
  },
}));
