"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { problemSchema, type ProblemFormValues } from "@job-tracker/core";
import { ProblemDifficulty, ProblemStatus, ProblemType } from "@job-tracker/types";
import { Input, TextArea, Select, Button } from "@/components/ui";

interface ProblemFormProps {
  defaultValues?: Partial<ProblemFormValues>;
  onSubmit: (values: ProblemFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const DIFFICULTY_OPTIONS = Object.values(ProblemDifficulty).map((d) => ({ value: d, label: d }));
const STATUS_OPTIONS = Object.values(ProblemStatus).map((s) => ({ value: s, label: s }));
const TYPE_OPTIONS = Object.values(ProblemType).map((t) => ({ value: t, label: t }));

export function ProblemForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save" }: ProblemFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: ProblemDifficulty.Medium,
      status: ProblemStatus.NotStarted,
      type: ProblemType.Array,
      topicTags: [],
      revisionCount: 0,
      isFavorite: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Problem Name *"
          placeholder="Two Sum"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="LeetCode URL"
          placeholder="https://leetcode.com/..."
          error={errors.url?.message}
          {...register("url")}
        />
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <Select label="Difficulty *" options={DIFFICULTY_OPTIONS} {...field} />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select label="Status *" options={STATUS_OPTIONS} {...field} />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select label="Type *" options={TYPE_OPTIONS} {...field} />
          )}
        />
        <Input
          label="Revision Count"
          type="number"
          min={0}
          {...register("revisionCount", { valueAsNumber: true })}
        />
        <Input
          label="Attempted At"
          type="date"
          {...register("attemptedAt")}
        />
        <Input
          label="Solved At"
          type="date"
          {...register("solvedAt")}
        />
      </div>

      <TextArea
        label="Notes"
        placeholder="Solution approach, key insights..."
        rows={3}
        {...register("notes")}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFavorite"
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          {...register("isFavorite")}
        />
        <label htmlFor="isFavorite" className="text-sm text-slate-700">
          Mark as Favorite ★
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
