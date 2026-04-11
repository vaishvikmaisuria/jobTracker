// ─── Job Application Types ────────────────────────────────────────────────────

export enum JobStatus {
  Applied = "Applied",
  RecruiterReachout = "Recruiter Reachout",
  OAScheduled = "OA Scheduled",
  OACompleted = "OA Completed",
  Interviewing = "Interviewing",
  FinalRound = "Final Round",
  NegotiatingOffer = "Negotiating Offer",
  OfferReceived = "Offer Received",
  Rejected = "Rejected",
  Ghosted = "Ghosted",
  OnHold = "On Hold",
  RequiresFollowUp = "Requires Follow-Up",
}

export enum JobPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface Job {
  id: string;
  companyName: string;
  location: string;
  status: JobStatus;
  roleOrPosition: string;
  mainContact?: string;
  contactEmail?: string;
  contactPhone?: string;
  dateApplied: string; // ISO date string
  lastContact?: string; // ISO date string
  likelihoodOfHiring?: number; // 0-100
  tags: string[];
  coverLetterOrResumeLink?: string;
  notes?: string;
  salaryRange?: string;
  jobPostingUrl?: string;
  priority: JobPriority;
  requiresFollowUp: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateJobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;
export type UpdateJobInput = Partial<CreateJobInput>;

// ─── LeetCode Tracker Types ───────────────────────────────────────────────────

export enum ProblemDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum ProblemStatus {
  NotStarted = "Not Started",
  Attempted = "Attempted",
  Solved = "Solved",
  NeedsRevision = "Needs Revision",
}

export enum ProblemType {
  Array = "Array",
  String = "String",
  LinkedList = "Linked List",
  Tree = "Tree",
  Graph = "Graph",
  DynamicProgramming = "Dynamic Programming",
  Backtracking = "Backtracking",
  BinarySearch = "Binary Search",
  TwoPointers = "Two Pointers",
  SlidingWindow = "Sliding Window",
  Stack = "Stack",
  Queue = "Queue",
  Heap = "Heap",
  HashTable = "Hash Table",
  Math = "Math",
  BitManipulation = "Bit Manipulation",
  Greedy = "Greedy",
  Other = "Other",
}

export interface Problem {
  id: string;
  name: string;
  url?: string;
  type: ProblemType;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  topicTags: string[];
  attemptedAt?: string; // ISO date string
  solvedAt?: string; // ISO date string
  notes?: string;
  revisionCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProblemInput = Omit<Problem, "id" | "createdAt" | "updatedAt">;
export type UpdateProblemInput = Partial<CreateProblemInput>;

// ─── Useful Links Types ───────────────────────────────────────────────────────

export enum ResourceCategory {
  LeetCode = "LeetCode",
  Recruitment = "Recruitment",
  Behavioral = "Behavioral",
  Resume = "Resume",
  SystemDesign = "System Design",
  JobBoards = "Job Boards",
  Networking = "Networking",
  Other = "Other",
}

export enum ResourceType {
  Website = "Website",
  Article = "Article",
  Video = "Video",
  Doc = "Doc",
  Template = "Template",
  Other = "Other",
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: ResourceCategory;
  type: ResourceType;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateResourceInput = Omit<Resource, "id" | "createdAt" | "updatedAt">;
export type UpdateResourceInput = Partial<CreateResourceInput>;

// ─── Dashboard / Stats Types ──────────────────────────────────────────────────

export interface DashboardStats {
  totalApplications: number;
  activeInterviews: number;
  offers: number;
  rejections: number;
  solvedProblems: number;
  totalProblems: number;
  savedLinks: number;
}

// ─── Filter / Sort Types ──────────────────────────────────────────────────────

export interface JobFilters {
  search?: string;
  status?: JobStatus[];
  tags?: string[];
  priority?: JobPriority[];
}

export type JobSortField = "dateApplied" | "lastContact" | "companyName" | "status";
export type SortDirection = "asc" | "desc";

export interface SortConfig<T extends string> {
  field: T;
  direction: SortDirection;
}

export interface ProblemFilters {
  search?: string;
  type?: ProblemType[];
  difficulty?: ProblemDifficulty[];
  status?: ProblemStatus[];
  isFavorite?: boolean;
}

export type ProblemSortField = "name" | "difficulty" | "status" | "solvedAt";

export interface ResourceFilters {
  search?: string;
  category?: ResourceCategory[];
  type?: ResourceType[];
  tags?: string[];
}
