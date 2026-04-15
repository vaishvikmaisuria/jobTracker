"use client";
import React, { useMemo } from "react";
import { sankey, SankeyLink, SankeyNode } from "d3-sankey";
import * as d3 from "d3";
import { useJobStore } from "@/store/jobStore";

// Sankey node and link types
interface SankeyNodeExtra extends SankeyNode<{ name: string }, {}> {
	name: string;
	color?: string;
}
interface SankeyLinkExtra extends SankeyLink<SankeyNodeExtra, {}> {
	value: number;
}

const MODERN_COLORS = [
	"#6366f1", // indigo
	"#06b6d4", // cyan
	"#22d3ee", // teal
	"#f59e42", // orange
	"#f43f5e", // rose
	"#84cc16", // lime
	"#a21caf", // purple
	"#fbbf24", // yellow
	"#0ea5e9", // blue
	"#10b981", // emerald
];

function getYear(dateStr: string) {
	return new Date(dateStr).getFullYear();
}

function buildSankeyData(jobs: any[]): {
	nodes: SankeyNodeExtra[];
	links: SankeyLinkExtra[];
} {
	// Example flow: Source → 1st Interview → 2nd Interview → ... → Offer/Rejected/No Reply
	// Group jobs by source, then by status progression
	const sources = [
		"LinkedIn",
		"Glassdoor",
		"RocketCrew",
		"Company website",
		"Other",
	];
	const statusStages = [
		"No reply",
		"Rejected",
		"1st interview",
		"2nd interview",
		"3rd interview",
		"Offer received",
		"Accepted",
		"Declined",
	];

	// Build nodes
	const nodeNames = ["Jobs applied to", ...sources, ...statusStages];
	const nodes: SankeyNodeExtra[] = nodeNames.map((name, i) => ({
		name,
		color: MODERN_COLORS[i % MODERN_COLORS.length],
	}));

	// Helper to get node index
	const nodeIdx = (name: string) => nodeNames.indexOf(name);

	// Aggregate data
	let sourceCounts: Record<string, number> = {};
	let statusCounts: Record<string, number> = {};
	let links: SankeyLinkExtra[] = [];

	// Count jobs by source
	for (const job of jobs) {
		const src = sources.includes(job.source) ? job.source : "Other";
		sourceCounts[src] = (sourceCounts[src] || 0) + 1;
	}
	// Links: Jobs applied to → Source
	for (const src of sources) {
		if (sourceCounts[src]) {
			links.push({
				source: nodeIdx("Jobs applied to"),
				target: nodeIdx(src),
				value: sourceCounts[src],
			} as SankeyLinkExtra);
		}
	}

	// Status mapping (simplified for demo)
	for (const job of jobs) {
		const src = sources.includes(job.source) ? job.source : "Other";
		let status = "No reply";
		if (job.status === "Rejected") status = "Rejected";
		else if (job.status === "Offer Received") status = "Offer received";
		else if (job.status === "Accepted") status = "Accepted";
		else if (job.status === "Declined") status = "Declined";
		else if (job.status === "Interviewing" || job.status === "Final Round")
			status = "1st interview";
		// Add more mapping as needed
		statusCounts[status] = (statusCounts[status] || 0) + 1;
		links.push({
			source: nodeIdx(src),
			target: nodeIdx(status),
			value: 1,
		} as SankeyLinkExtra);
	}

	return { nodes, links };
}

function SankeyChart({ jobs }: { jobs: any[] }) {
	const width = 900;
	const height = 500;
	const { nodes, links } = useMemo(() => buildSankeyData(jobs), [jobs]);

	// Build Sankey layout
	const sankeyGen = sankey<SankeyNodeExtra, SankeyLinkExtra>()
		.nodeWidth(24)
		.nodePadding(24)
		.extent([
			[1, 1],
			[width - 1, height - 6],
		]);
	const { nodes: layoutNodes, links: layoutLinks } = sankeyGen({
		nodes: nodes.map((n) => ({ ...n })),
		links: links as SankeyLinkExtra[],
	});

	// Helper for horizontal path
	function sankeyLinkPath(link: any) {
		// Draw a cubic Bezier from source to target
		const x0 = link.source.x1;
		const x1 = link.target.x0;
		const y0 = link.y0;
		const y1 = link.y1;
		const curvature = 0.5;
		const xi = d3.interpolateNumber(x0, x1);
		const x2 = xi(curvature);
		const x3 = xi(1 - curvature);
		return `M${x0},${y0} C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
	}

	return (
		<svg
			width={width}
			height={height}
			style={{
				background: "#fff",
				borderRadius: 16,
				boxShadow: "0 2px 16px #0001",
			}}
		>
			{/* Links */}
			<g fill="none" strokeOpacity={0.4}>
				{layoutLinks.map((link: any, i: number) => (
					<path
						key={i}
						d={sankeyLinkPath(link) || undefined}
						stroke={nodes[link.source.index!].color}
						strokeWidth={Math.max(1, link.width || 1)}
					/>
				))}
			</g>
			{/* Nodes */}
			<g>
				{layoutNodes.map((node: any, i: number) => (
					<g key={i}>
						<rect
							x={node.x0}
							y={node.y0}
							height={node.y1 - node.y0}
							width={node.x1 - node.x0}
							fill={node.color}
							rx={6}
							opacity={0.9}
						/>
						<text
							x={node.x0 < width / 2 ? node.x1 + 8 : node.x0 - 8}
							y={(node.y1 + node.y0) / 2}
							dy="0.35em"
							textAnchor={node.x0 < width / 2 ? "start" : "end"}
							fontSize={16}
							fontWeight={700}
							fill="#222"
							style={{ pointerEvents: "none" }}
						>
							{node.name}
						</text>
					</g>
				))}
			</g>
		</svg>
	);
}

export default function SankeyChartPage() {
	const jobs = useJobStore((state) =>
		state.jobs.filter(
			(j) => getYear(j.dateApplied) === new Date().getFullYear(),
		),
	);
	const loading = useJobStore((state) => state.loading);

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-indigo-700">
				Job Application Flow (Sankey Chart)
			</h1>
			<div className="mb-6 text-slate-600">
				This chart visualizes your job application journey for{" "}
				{new Date().getFullYear()}.
			</div>
			{loading && <div>Loading...</div>}
			{!loading && jobs.length === 0 && (
				<div className="text-slate-400">No job data for this year.</div>
			)}
			{!loading && jobs.length > 0 && (
				<div className="overflow-x-auto">
					<SankeyChart jobs={jobs} />
				</div>
			)}
		</div>
	);
}
