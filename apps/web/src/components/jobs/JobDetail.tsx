"use client";

import { useState } from "react";
import type { Job } from "@job-tracker/types";
import { formatDate } from "@job-tracker/core";
import { useJobStore } from "@/store/jobStore";
import { JobStatusBadge, JobPriorityBadge } from "./JobBadges";
import { Button, ConfirmDialog, Modal } from "@/components/ui";
import { JobForm } from "./JobForm";
import type { JobFormValues } from "@job-tracker/core";
import { Edit2, Trash2, ExternalLink, Bell } from "lucide-react";

const TAG_DELIMITER = "::";

const TAG_COLOR_CLASS: Record<string, string> = {
	slate: "bg-slate-100 text-slate-700 border-slate-200",
	indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
	sky: "bg-sky-100 text-sky-700 border-sky-200",
	emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
	amber: "bg-amber-100 text-amber-700 border-amber-200",
	rose: "bg-rose-100 text-rose-700 border-rose-200",
};

function decodeTag(raw: string): { label: string; colorClass: string } {
	const [maybeColor, ...rest] = raw.split(TAG_DELIMITER);
	if (rest.length > 0 && TAG_COLOR_CLASS[maybeColor]) {
		return {
			label: rest.join(TAG_DELIMITER),
			colorClass: TAG_COLOR_CLASS[maybeColor],
		};
	}

	return {
		label: raw,
		colorClass: TAG_COLOR_CLASS.slate,
	};
}

interface JobDetailProps {
	job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
	const { updateJob, deleteJob, selectJob } = useJobStore();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	async function handleEdit(values: JobFormValues) {
		await updateJob(job.id, values);
		setEditOpen(false);
	}

	async function handleDelete() {
		setDeleting(true);
		await deleteJob(job.id);
		setDeleting(false);
		setDeleteOpen(false);
		selectJob(null);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-slate-900">
						{job.companyName}
					</h2>
					<p className="text-slate-600 text-sm mt-0.5">
						{job.roleOrPosition}
					</p>
					<p className="text-slate-400 text-xs mt-0.5">
						{job.location}
					</p>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0">
					<Button
						variant="secondary"
						size="sm"
						onClick={() => setEditOpen(true)}
					>
						<Edit2 size={14} /> Edit
					</Button>
					<Button
						variant="danger"
						size="sm"
						onClick={() => setDeleteOpen(true)}
					>
						<Trash2 size={14} />
					</Button>
				</div>
			</div>

			{/* Status row */}
			<div className="flex flex-wrap gap-2">
				<JobStatusBadge status={job.status} />
				<JobPriorityBadge priority={job.priority} />
				{job.requiresFollowUp && (
					<span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700">
						<Bell size={11} /> Follow-Up
					</span>
				)}
			</div>

			{/* Tags */}
			{job.tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{job.tags.map((rawTag) => {
						const tag = decodeTag(rawTag);
						return (
							<span
								key={rawTag}
								className={`rounded-full border text-xs px-2.5 py-0.5 ${tag.colorClass}`}
							>
								{tag.label}
							</span>
						);
					})}
				</div>
			)}

			{/* Info grid */}
			<div className="grid grid-cols-2 gap-3 text-sm">
				<InfoRow label="Applied" value={formatDate(job.dateApplied)} />
				<InfoRow
					label="Last Contact"
					value={formatDate(job.lastContact)}
				/>
				{job.salaryRange && (
					<InfoRow label="Salary Range" value={job.salaryRange} />
				)}
				{job.likelihoodOfHiring !== undefined && (
					<InfoRow
						label="Likelihood"
						value={`${job.likelihoodOfHiring}%`}
					/>
				)}
				{job.mainContact && (
					<InfoRow label="Contact" value={job.mainContact} />
				)}
				{job.contactEmail && (
					<InfoRow label="Email" value={job.contactEmail} />
				)}
			</div>

			{/* Links */}
			{(job.jobPostingUrl || job.coverLetterOrResumeLink) && (
				<div className="flex flex-wrap gap-2">
					{job.jobPostingUrl && (
						<a
							href={job.jobPostingUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700"
						>
							<ExternalLink size={12} /> Job Posting
						</a>
					)}
					{job.coverLetterOrResumeLink && (
						<a
							href={job.coverLetterOrResumeLink}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700"
						>
							<ExternalLink size={12} /> Resume/Cover Letter
						</a>
					)}
				</div>
			)}

			{/* Notes */}
			{job.notes && (
				<div>
					<p className="text-xs font-medium text-slate-500 mb-1.5">
						Notes
					</p>
					<p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 whitespace-pre-wrap">
						{job.notes}
					</p>
				</div>
			)}

			{/* Modals */}
			<Modal
				open={editOpen}
				onClose={() => setEditOpen(false)}
				title="Edit Job"
				size="lg"
			>
				<JobForm
					defaultValues={{
						...job,
						contactEmail: job.contactEmail ?? "",
						jobPostingUrl: job.jobPostingUrl ?? "",
						coverLetterOrResumeLink:
							job.coverLetterOrResumeLink ?? "",
					}}
					onSubmit={handleEdit}
					onCancel={() => setEditOpen(false)}
					submitLabel="Update Job"
				/>
			</Modal>

			<ConfirmDialog
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete Application"
				description={`Delete the application for ${job.companyName}? This cannot be undone.`}
				loading={deleting}
			/>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs text-slate-400">{label}</p>
			<p className="text-slate-700 font-medium">{value}</p>
		</div>
	);
}
