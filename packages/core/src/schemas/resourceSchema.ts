import { z } from "zod";
import { ResourceCategory, ResourceType } from "@job-tracker/types";

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL"),
  category: z.nativeEnum(ResourceCategory),
  type: z.nativeEnum(ResourceType),
  tags: z.array(z.string()),
  notes: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
