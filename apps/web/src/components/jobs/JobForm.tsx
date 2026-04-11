"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormValues } from "@job-tracker/core";
import { JobStatus, JobPriority } from "@job-tracker/types";
import type { Job } from "@job-tracker/types";
import { Input, TextArea, Select, Button } from "@/components/ui";

interface JobFormProps {
  defaultValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const STATUS_OPTIONS = Object.values(JobStatus).map((s) => ({ value: s, label: s }));
const PRIORITY_OPTIONS = Object.values(JobPriority).map((p) => ({ value: p, label: p }));

export function JobForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save" }: JobFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: JobStatus.Applied,
      priority: JobPriority.Medium,
      tags: [],
      requiresFollowUp: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Company Name *"
          placeholder="Google"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <Input
          label="Role / Position *"
          placeholder="Software Engineer II"
          error={errors.roleOrPosition?.message}
          {...register("roleOrPosition")}
        />
        <Input
          label="Location *"
          placeholder="San Francisco, CA"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="Date Applied *"
          type="date"
          error={errors.dateApplied?.message}
          {...register("dateApplied")}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status *"
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              label="Priority"
              options={PRIORITY_OPTIONS}
              {...field}
            />
          )}
        />
        <Input
          label="Salary Range"
          placeholder="$150k – $180k"
          {...register("salaryRange")}
        />
        <Input
          label="Job Posting URL"
          placeholder="https://..."
          error={errors.jobPostingUrl?.message}
          {...register("jobPostingUrl")}
        />
        <Input
          label="Main Contact"
          placeholder="Jane Smith"
          {...register("mainContact")}
        />
        <Input
          label="Contact Email"
          type="email"
          placeholder="jane@company.com"
          error={errors.contactEmail?.message}
          {...register("contactEmail")}
        />
        <Input
          label="Last Contact Date"
          type="date"
          {...register("lastContact")}
        />
        <Input
          label="Likelihood of Hiring (%)"
          type="number"
          min={0}
          max={100}
          placeholder="50"
          {...register("likelihoodOfHiring", { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Cover Letter / Resume Link"
        placeholder="https://drive.google.com/..."
        error={errors.coverLetterOrResumeLink?.message}
        {...register("coverLetterOrResumeLink")}
      />

      <TextArea
        label="Notes"
        placeholder="Add any notes about this application..."
        rows={3}
        {...register("notes")}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requiresFollowUp"
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          {...register("requiresFollowUp")}
        />
        <label htmlFor="requiresFollowUp" className="text-sm text-slate-700">
          Requires Follow-Up
        </label>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
