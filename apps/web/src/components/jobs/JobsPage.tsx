"use client";

import { useEffect, useState } from "react";
import { useJobStore } from "@/store/jobStore";
import { JobStatusBadge } from "./JobBadges";
import { formatDate } from "@job-tracker/core";
import { JobStatus, JobPriority } from "@job-tracker/types";
import { SearchBar, Button, Select, EmptyState } from "@/components/ui";
import { Plus, Briefcase, Bell, ArrowUpDown } from "lucide-react";
import { Modal } from "@/components/ui";
import { JobForm } from "./JobForm";
import { JobDetail } from "./JobDetail";
import { FeatureGuide } from "@/components/layout/FeatureGuide";
import type { JobFormValues } from "@job-tracker/core";
import { cn } from "@/lib/cn";

const STATUS_FILTER_OPTIONS = [
	{ value: "", label: "All Statuses" },
	...Object.values(JobStatus).map((s) => ({ value: s, label: s })),
];

export function JobsPage() {
	const {
		jobs,
		loading,
		filters,
		sort,
		selectedJob,
		init,
		setFilters,
		setSort,
		selectJob,
		createJob,
	} = useJobStore();

	const [addOpen, setAddOpen] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		init();
	}, []);

	function handleSearch(value: string) {
		setSearch(value);
		setFilters({ ...filters, search: value });
	}

	function handleStatusFilter(value: string) {
		setFilters({
			...filters,
			status: value ? [value as JobStatus] : undefined,
		});
	}

	function toggleSort(field: "dateApplied" | "companyName") {
		setSort({
			field,
			direction:
				sort.field === field && sort.direction === "desc"
					? "asc"
					: "desc",
		});
	}

	async function handleCreate(values: JobFormValues) {
		await createJob({ ...values, tags: values.tags ?? [] });
		setAddOpen(false);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold text-slate-900">
							Job Applications
						</h1>
						<FeatureGuide variant="jobs" />
					</div>
					<p className="text-sm text-slate-500 mt-0.5">
						{jobs.length} application{jobs.length !== 1 ? "s" : ""}
					</p>
				</div>
				<Button onClick={() => setAddOpen(true)}>
					<Plus size={16} /> Add Job
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<SearchBar
					value={search}
					onChange={handleSearch}
					placeholder="Search company, role..."
					className="w-64"
				/>
				<Select
					options={STATUS_FILTER_OPTIONS}
					onChange={(e) => handleStatusFilter(e.target.value)}
					className="w-48"
				/>
				<button
					onClick={() => toggleSort("dateApplied")}
					className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
				>
					<ArrowUpDown size={14} /> Date
				</button>
				<button
					onClick={() => toggleSort("companyName")}
					className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
				>
					<ArrowUpDown size={14} /> Company
				</button>
			</div>

			{/* Table + Detail pane */}
			<div className="flex gap-6 min-h-[500px]">
				{/* Table */}
				<div
					className={cn(
						"flex-1 overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm",
						selectedJob && "lg:max-w-none",
					)}
				>
					{loading ? (
						<div className="py-16 flex items-center justify-center text-slate-400 text-sm">
							Loading…
						</div>
					) : jobs.length === 0 ? (
						<EmptyState
							icon={<Briefcase size={22} />}
							title="No applications yet"
							description="Start tracking your job applications to stay organized."
							action={
								<Button onClick={() => setAddOpen(true)}>
									<Plus size={14} /> Add Your First Job
								</Button>
							}
						/>
					) : (
						<table className="w-full text-sm">
							<thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Company
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
										Role
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
										Applied
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
										Location
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{jobs.map((job) => (
									<tr
										key={job.id}
										onClick={() =>
											selectJob(
												selectedJob?.id === job.id
													? null
													: job,
											)
										}
										className={cn(
											"cursor-pointer hover:bg-slate-50 transition-colors",
											selectedJob?.id === job.id &&
												"bg-indigo-50/50",
										)}
									>
										<td className="px-4 py-3">
											<div className="font-medium text-slate-900">
												{job.companyName}
											</div>
											{job.requiresFollowUp && (
												<span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
													<Bell size={10} /> Follow-up
													needed
												</span>
											)}
										</td>
										<td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
											{job.roleOrPosition}
										</td>
										<td className="px-4 py-3">
											<JobStatusBadge
												status={job.status}
											/>
										</td>
										<td className="px-4 py-3 text-slate-500 hidden md:table-cell">
											{formatDate(job.dateApplied)}
										</td>
										<td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
											{job.location}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				{/* Detail panel */}
				{selectedJob && (
					<div className="w-96 shrink-0 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-y-auto">
						<div className="flex justify-end p-3 border-b border-slate-50">
							<button
								onClick={() => selectJob(null)}
								className="text-xs text-slate-400 hover:text-slate-600"
							>
								✕ Close
							</button>
						</div>
						<JobDetail job={selectedJob} />
					</div>
				)}
			</div>

			{/* Add modal */}
			<Modal
				open={addOpen}
				onClose={() => setAddOpen(false)}
				title="Add Job Application"
				size="lg"
			>
				<JobForm
					onSubmit={handleCreate}
					onCancel={() => setAddOpen(false)}
					submitLabel="Add Job"
				/>
			</Modal>
		</div>
	);
}
