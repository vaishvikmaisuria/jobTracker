"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormValues } from "@job-tracker/core";
import { JobStatus, JobPriority } from "@job-tracker/types";
import type { Job } from "@job-tracker/types";
import { Input, TextArea, Select, Button } from "@/components/ui";
import { Plus } from "lucide-react";

interface JobFormProps {
	defaultValues?: Partial<JobFormValues>;
	onSubmit: (values: JobFormValues) => Promise<void>;
	onCancel: () => void;
	submitLabel?: string;
}

const STATUS_OPTIONS = Object.values(JobStatus).map((s) => ({
	value: s,
	label: s,
}));
const PRIORITY_OPTIONS = Object.values(JobPriority).map((p) => ({
	value: p,
	label: p,
}));

const TAG_DELIMITER = "::";

const TAG_COLOR_OPTIONS = [
	{
		value: "slate",
		label: "Slate",
		swatch: "bg-slate-500",
		chip: "bg-slate-100 text-slate-700 border-slate-200",
	},
	{
		value: "indigo",
		label: "Indigo",
		swatch: "bg-indigo-500",
		chip: "bg-indigo-100 text-indigo-700 border-indigo-200",
	},
	{
		value: "sky",
		label: "Sky",
		swatch: "bg-sky-500",
		chip: "bg-sky-100 text-sky-700 border-sky-200",
	},
	{
		value: "emerald",
		label: "Emerald",
		swatch: "bg-emerald-500",
		chip: "bg-emerald-100 text-emerald-700 border-emerald-200",
	},
	{
		value: "amber",
		label: "Amber",
		swatch: "bg-amber-500",
		chip: "bg-amber-100 text-amber-700 border-amber-200",
	},
	{
		value: "rose",
		label: "Rose",
		swatch: "bg-rose-500",
		chip: "bg-rose-100 text-rose-700 border-rose-200",
	},
] as const;

type TagColor = (typeof TAG_COLOR_OPTIONS)[number]["value"];

type FormTag = {
	label: string;
	color: TagColor;
};

function isTagColor(value: string): value is TagColor {
	return TAG_COLOR_OPTIONS.some((option) => option.value === value);
}

function decodeTag(raw: string): FormTag {
	const [maybeColor, ...rest] = raw.split(TAG_DELIMITER);
	if (rest.length > 0 && isTagColor(maybeColor)) {
		return { color: maybeColor, label: rest.join(TAG_DELIMITER) };
	}

	// Backward compatible for older plain-string tags.
	return { color: "slate", label: raw };
}

function encodeTag(tag: FormTag): string {
	return `${tag.color}${TAG_DELIMITER}${tag.label}`;
}

export function JobForm({
	defaultValues,
	onSubmit,
	onCancel,
	submitLabel = "Save",
}: JobFormProps) {
	const initialTags = useMemo(
		() => (defaultValues?.tags ?? []).map(decodeTag),
		[defaultValues?.tags],
	);
	const [tags, setTags] = useState<FormTag[]>(initialTags);
	const [tagInput, setTagInput] = useState("");
	const [selectedTagColor, setSelectedTagColor] =
		useState<TagColor>("indigo");

	const {
		register,
		handleSubmit,
		setValue,
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

	const syncTagsToForm = (nextTags: FormTag[]) => {
		setTags(nextTags);
		setValue(
			"tags",
			nextTags.map((tag) => encodeTag(tag)),
			{ shouldValidate: true, shouldDirty: true },
		);
	};

	const addTag = () => {
		const label = tagInput.trim();
		if (!label) return;

		const exists = tags.some(
			(tag) => tag.label.toLowerCase() === label.toLowerCase(),
		);
		if (exists) {
			setTagInput("");
			return;
		}

		syncTagsToForm([...tags, { label, color: selectedTagColor }]);
		setTagInput("");
	};

	const removeTag = (label: string) => {
		syncTagsToForm(tags.filter((tag) => tag.label !== label));
	};

	const colorClassByValue = Object.fromEntries(
		TAG_COLOR_OPTIONS.map((option) => [option.value, option.chip]),
	) as Record<TagColor, string>;

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

			<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 space-y-3">
				<div className="flex items-center justify-between">
					<p className="text-sm font-semibold text-slate-800">Tags</p>
					<p className="text-xs text-slate-500">
						Press Enter or click Add
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="flex items-center gap-2 overflow-x-auto pb-1">
						{TAG_COLOR_OPTIONS.map((option) => {
							const selected = selectedTagColor === option.value;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() =>
										setSelectedTagColor(option.value)
									}
									className={`h-7 w-7 rounded-full border-2 transition-all ${option.swatch} ${
										selected
											? "border-slate-900 scale-110"
											: "border-white shadow-sm"
									}`}
									aria-label={`Select ${option.label} tag color`}
									title={option.label}
								/>
							);
						})}
					</div>

					<div className="flex-1 flex items-center gap-2">
						<input
							value={tagInput}
							onChange={(event) =>
								setTagInput(event.target.value)
							}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									addTag();
								}
							}}
							placeholder="e.g. FAANG, Referral, Remote"
							className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
						/>
						<Button
							type="button"
							variant="secondary"
							onClick={addTag}
						>
							<Plus size={14} /> Add
						</Button>
					</div>
				</div>

				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-1">
						{tags.map((tag) => (
							<span
								key={tag.label}
								className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${colorClassByValue[tag.color]}`}
							>
								{tag.label}
								<button
									type="button"
									onClick={() => removeTag(tag.label)}
									className="ml-1 text-current/70 hover:text-current"
									aria-label={`Remove ${tag.label} tag`}
								>
									×
								</button>
							</span>
						))}
					</div>
				)}
				{errors.tags?.message && (
					<p className="text-xs text-red-500">
						{errors.tags.message}
					</p>
				)}
			</div>

			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					id="requiresFollowUp"
					className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
					{...register("requiresFollowUp")}
				/>
				<label
					htmlFor="requiresFollowUp"
					className="text-sm text-slate-700"
				>
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
