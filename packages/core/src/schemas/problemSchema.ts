import { z } from "zod";
import {
  ProblemDifficulty,
  ProblemStatus,
  ProblemType,
} from "@job-tracker/types";

export const problemSchema = z.object({
  name: z.string().min(1, "Problem name is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  type: z.nativeEnum(ProblemType),
  difficulty: z.nativeEnum(ProblemDifficulty),
  status: z.nativeEnum(ProblemStatus),
  topicTags: z.array(z.string()),
  attemptedAt: z.string().optional(),
  solvedAt: z.string().optional(),
  notes: z.string().optional(),
  revisionCount: z.number().min(0).default(0),
  isFavorite: z.boolean().default(false),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
