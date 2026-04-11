"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, type ResourceFormValues } from "@job-tracker/core";
import { ResourceCategory, ResourceType } from "@job-tracker/types";
import { Input, TextArea, Select, Button } from "@/components/ui";

interface ResourceFormProps {
  defaultValues?: Partial<ResourceFormValues>;
  onSubmit: (values: ResourceFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const CATEGORY_OPTIONS = Object.values(ResourceCategory).map((c) => ({ value: c, label: c }));
const TYPE_OPTIONS = Object.values(ResourceType).map((t) => ({ value: t, label: t }));

export function ResourceForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save" }: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      category: ResourceCategory.Other,
      type: ResourceType.Website,
      tags: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input
        label="Title *"
        placeholder="NeetCode 150"
        error={errors.title?.message}
        {...register("title")}
      />
      <Input
        label="URL *"
        placeholder="https://..."
        error={errors.url?.message}
        {...register("url")}
      />
      <Input
        label="Description"
        placeholder="Short description of the resource"
        {...register("description")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select label="Category *" options={CATEGORY_OPTIONS} {...field} />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select label="Type *" options={TYPE_OPTIONS} {...field} />
          )}
        />
      </div>
      <TextArea
        label="Notes"
        placeholder="Any notes about this resource..."
        rows={2}
        {...register("notes")}
      />
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
