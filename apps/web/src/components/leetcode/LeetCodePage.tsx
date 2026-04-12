"use client";

import { useEffect, useState } from "react";
import { useProblemStore } from "@/store/problemStore";
import { DifficultyBadge, ProblemStatusBadge } from "./ProblemBadges";
import {
	ProblemDifficulty,
	ProblemStatus,
	ProblemType,
} from "@job-tracker/types";
import {
	SearchBar,
	Button,
	Select,
	EmptyState,
	StatCard,
} from "@/components/ui";
import { Plus, Code2, Star, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui";
import { ProblemForm } from "./ProblemForm";
import { ProblemDetail } from "./ProblemDetail";
import { FeatureGuide } from "@/components/layout/FeatureGuide";
import type { ProblemFormValues } from "@job-tracker/core";
import { cn } from "@/lib/cn";

const DIFFICULTY_FILTER = [
	{ value: "", label: "All Difficulties" },
	...Object.values(ProblemDifficulty).map((d) => ({ value: d, label: d })),
];

const STATUS_FILTER = [
	{ value: "", label: "All Statuses" },
	...Object.values(ProblemStatus).map((s) => ({ value: s, label: s })),
];

const TYPE_FILTER = [
	{ value: "", label: "All Types" },
	...Object.values(ProblemType).map((t) => ({ value: t, label: t })),
];

export function LeetCodePage() {
	const {
		problems,
		loading,
		filters,
		selectedProblem,
		init,
		setFilters,
		selectProblem,
		createProblem,
	} = useProblemStore();

	const [addOpen, setAddOpen] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		init();
	}, []);

	function handleSearch(value: string) {
		setSearch(value);
		setFilters({ ...filters, search: value });
	}

	function handleDifficultyFilter(value: string) {
		setFilters({
			...filters,
			difficulty: value ? [value as ProblemDifficulty] : undefined,
		});
	}

	function handleStatusFilter(value: string) {
		setFilters({
			...filters,
			status: value ? [value as ProblemStatus] : undefined,
		});
	}

	async function handleCreate(values: ProblemFormValues) {
		await createProblem({ ...values, topicTags: values.topicTags ?? [] });
		setAddOpen(false);
	}

	const solved = problems.filter(
		(p) => p.status === ProblemStatus.Solved,
	).length;
	const favorites = problems.filter((p) => p.isFavorite).length;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold text-slate-900">
							LeetCode Tracker
						</h1>
						<FeatureGuide variant="leetcode" />
					</div>
					<p className="text-sm text-slate-500 mt-0.5">
						{problems.length} problems
					</p>
				</div>
				<Button onClick={() => setAddOpen(true)}>
					<Plus size={16} /> Add Problem
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatCard
					title="Total"
					value={problems.length}
					icon={<Code2 size={18} />}
					color="bg-indigo-500"
				/>
				<StatCard
					title="Solved"
					value={solved}
					icon={<CheckCircle2 size={18} />}
					color="bg-green-500"
				/>
				<StatCard
					title="Favorites"
					value={favorites}
					icon={<Star size={18} />}
					color="bg-yellow-500"
				/>
				<StatCard
					title="Completion"
					value={
						problems.length > 0
							? `${Math.round((solved / problems.length) * 100)}%`
							: "0%"
					}
					color="bg-purple-500"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<SearchBar
					value={search}
					onChange={handleSearch}
					placeholder="Search problems..."
					className="w-56"
				/>
				<Select
					options={DIFFICULTY_FILTER}
					onChange={(e) => handleDifficultyFilter(e.target.value)}
					className="w-40"
				/>
				<Select
					options={STATUS_FILTER}
					onChange={(e) => handleStatusFilter(e.target.value)}
					className="w-40"
				/>
			</div>

			{/* Table + Detail */}
			<div className="flex gap-6 min-h-[400px]">
				<div className="flex-1 overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
					{loading ? (
						<div className="py-16 flex items-center justify-center text-slate-400 text-sm">
							Loading…
						</div>
					) : problems.length === 0 ? (
						<EmptyState
							icon={<Code2 size={22} />}
							title="No problems yet"
							description="Add problems to track your LeetCode practice."
							action={
								<Button onClick={() => setAddOpen(true)}>
									<Plus size={14} /> Add First Problem
								</Button>
							}
						/>
					) : (
						<table className="w-full text-sm">
							<thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Problem
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
										Type
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Difficulty
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
										Status
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
										Revisions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{problems.map((problem) => (
									<tr
										key={problem.id}
										onClick={() =>
											selectProblem(
												selectedProblem?.id ===
													problem.id
													? null
													: problem,
											)
										}
										className={cn(
											"cursor-pointer hover:bg-slate-50 transition-colors",
											selectedProblem?.id ===
												problem.id && "bg-indigo-50/50",
										)}
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1.5">
												{problem.isFavorite && (
													<Star
														size={12}
														className="text-yellow-400 fill-yellow-400 flex-shrink-0"
													/>
												)}
												<span className="font-medium text-slate-900">
													{problem.name}
												</span>
											</div>
										</td>
										<td className="px-4 py-3 text-slate-500 hidden sm:table-cell">
											{problem.type}
										</td>
										<td className="px-4 py-3">
											<DifficultyBadge
												difficulty={problem.difficulty}
											/>
										</td>
										<td className="px-4 py-3 hidden md:table-cell">
											<ProblemStatusBadge
												status={problem.status}
											/>
										</td>
										<td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
											{problem.revisionCount}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				{/* Detail panel */}
				{selectedProblem && (
					<div className="w-96 shrink-0 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-y-auto">
						<div className="flex justify-end p-3 border-b border-slate-50">
							<button
								onClick={() => selectProblem(null)}
								className="text-xs text-slate-400 hover:text-slate-600"
							>
								✕ Close
							</button>
						</div>
						<ProblemDetail problem={selectedProblem} />
					</div>
				)}
			</div>

			{/* Add modal */}
			<Modal
				open={addOpen}
				onClose={() => setAddOpen(false)}
				title="Add Problem"
				size="lg"
			>
				<ProblemForm
					onSubmit={handleCreate}
					onCancel={() => setAddOpen(false)}
					submitLabel="Add Problem"
				/>
			</Modal>
		</div>
	);
}
