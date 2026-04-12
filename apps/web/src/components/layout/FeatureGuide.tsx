"use client";

import { useMemo, useState } from "react";
import { CircleHelp, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, Button } from "@/components/ui";

type GuideVariant = "dashboard" | "jobs" | "leetcode" | "resources";

type GuideStep = {
	title: string;
	description: string;
};

const GUIDE_STEPS: Record<GuideVariant, GuideStep[]> = {
	dashboard: [
		{
			title: "Start with your overview",
			description:
				"Use the stat cards to quickly understand your total applications, active interviews, offers, and solved problems.",
		},
		{
			title: "Jump to what needs attention",
			description:
				"Review Recent Applications and Active Interviews panels to decide where to follow up first.",
		},
		{
			title: "Use Portability Vault",
			description:
				"Back up all data with Download Backup, then restore it with Restore Data on any browser session. Duplicate IDs are skipped automatically.",
		},
	],
	jobs: [
		{
			title: "Create your first application",
			description:
				"Click Add Job, complete company, role, location, date, and status, then save.",
		},
		{
			title: "Filter and sort",
			description:
				"Use search, status filters, and sort controls to quickly find specific applications.",
		},
		{
			title: "Track context with tags",
			description:
				"In Add/Edit form, create colored tag chips like Referral, FAANG, or Remote to visually group applications.",
		},
		{
			title: "Manage details",
			description:
				"Select any row to open detail view, then edit notes, links, follow-up status, and contact information.",
		},
	],
	leetcode: [
		{
			title: "Log practice items",
			description:
				"Click Add Problem and fill difficulty, type, status, and notes to maintain a complete practice history.",
		},
		{
			title: "Measure consistency",
			description:
				"Use Total, Solved, Favorites, and Completion cards to monitor practice momentum.",
		},
		{
			title: "Find weak areas",
			description:
				"Use filters by difficulty and status, then focus on Attempted and Needs Revision items.",
		},
	],
	resources: [
		{
			title: "Save high-value links",
			description:
				"Click Add Link and store useful resources for interviews, resume prep, and system design.",
		},
		{
			title: "Organize by category",
			description:
				"Use category and type filters to focus on the exact material you need for your next prep session.",
		},
		{
			title: "Keep notes actionable",
			description:
				"Add short notes like key takeaways or when to revisit each resource.",
		},
	],
};

const GUIDE_LABELS: Record<GuideVariant, string> = {
	dashboard: "Dashboard",
	jobs: "Jobs",
	leetcode: "LeetCode",
	resources: "Useful Links",
};

interface FeatureGuideProps {
	variant: GuideVariant;
}

export function FeatureGuide({ variant }: FeatureGuideProps) {
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);

	const steps = useMemo(() => GUIDE_STEPS[variant], [variant]);
	const currentStep = steps[activeIndex];
	const isFirst = activeIndex === 0;
	const isLast = activeIndex === steps.length - 1;

	const handleOpen = () => {
		setActiveIndex(0);
		setOpen(true);
	};

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
				className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
				aria-label={`Open ${GUIDE_LABELS[variant]} guide`}
			>
				<CircleHelp size={14} />
				Guide
			</button>

			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title={`${GUIDE_LABELS[variant]} Walkthrough`}
				size="md"
			>
				<div className="p-6 space-y-5">
					<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5">
						<p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
							Step {activeIndex + 1} of {steps.length}
						</p>
						<h3 className="mt-1 text-lg font-semibold text-slate-900">
							{currentStep.title}
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-slate-600">
							{currentStep.description}
						</p>
					</div>

					<div className="flex items-center justify-center gap-2">
						{steps.map((_, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setActiveIndex(index)}
								className={`h-2.5 rounded-full transition-all ${
									index === activeIndex
										? "w-8 bg-indigo-600"
										: "w-2.5 bg-slate-300 hover:bg-slate-400"
								}`}
								aria-label={`Go to step ${index + 1}`}
							/>
						))}
					</div>

					<div className="flex items-center justify-between">
						<Button
							type="button"
							variant="secondary"
							onClick={() =>
								setActiveIndex((prev) => Math.max(0, prev - 1))
							}
							disabled={isFirst}
						>
							<ChevronLeft size={16} /> Previous
						</Button>

						{isLast ? (
							<Button
								type="button"
								onClick={() => setOpen(false)}
							>
								Done
							</Button>
						) : (
							<Button
								type="button"
								onClick={() =>
									setActiveIndex((prev) =>
										Math.min(steps.length - 1, prev + 1),
									)
								}
							>
								Next <ChevronRight size={16} />
							</Button>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
}
