import { z } from "zod";
import {
  JobStatus,
  JobPriority,
} from "@job-tracker/types";

export const jobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.nativeEnum(JobStatus),
  roleOrPosition: z.string().min(1, "Role/Position is required"),
  mainContact: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  dateApplied: z.string().min(1, "Date applied is required"),
  lastContact: z.string().optional(),
  likelihoodOfHiring: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()),
  coverLetterOrResumeLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
  salaryRange: z.string().optional(),
  jobPostingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  priority: z.nativeEnum(JobPriority),
  requiresFollowUp: z.boolean(),
});

export type JobFormValues = z.infer<typeof jobSchema>;
