"use client";

import { useRef, useState } from "react";
import { Download, Upload, Info } from "lucide-react";
import { exportToJSON, importFromJSON } from "@/lib/dataExport";
import type { Job, Problem, Resource } from "@job-tracker/types";

interface DataSyncProps {
	jobs: Job[];
	problems: Problem[];
	resources: Resource[];
	onImport: (
		jobs: Job[],
		problems: Problem[],
		resources: Resource[],
	) => Promise<void>;
}

export function DataSync({
	jobs,
	problems,
	resources,
	onImport,
}: DataSyncProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [showInfo, setShowInfo] = useState(false);

	const handleDownload = () => {
		exportToJSON(jobs, problems, resources);
		setMessage({ type: "success", text: "Data downloaded successfully!" });
		setTimeout(() => setMessage(null), 3000);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsLoading(true);
		setMessage(null);

		try {
			const result = await importFromJSON(
				file,
				jobs,
				problems,
				resources,
			);

			if (result.error) {
				setMessage({ type: "error", text: result.error });
				setIsLoading(false);
				return;
			}

			const totalImported =
				result.jobs.length +
				result.problems.length +
				result.resources.length;
			const totalDuplicates =
				result.duplicateCounts.jobs +
				result.duplicateCounts.problems +
				result.duplicateCounts.resources;

			if (totalImported === 0) {
				setMessage({
					type: "success",
					text: `Import complete. ${totalDuplicates} duplicate items were skipped.`,
				});
				setIsLoading(false);
				return;
			}

			// Import the data
			await onImport(result.jobs, result.problems, result.resources);

			const summaryParts = [];
			if (result.jobs.length > 0)
				summaryParts.push(`${result.jobs.length} job(s)`);
			if (result.problems.length > 0)
				summaryParts.push(`${result.problems.length} problem(s)`);
			if (result.resources.length > 0)
				summaryParts.push(`${result.resources.length} resource(s)`);

			let successText = `Successfully imported ${summaryParts.join(", ")}.`;
			if (totalDuplicates > 0) {
				successText += ` (${totalDuplicates} duplicate(s) skipped)`;
			}

			setMessage({ type: "success", text: successText });
		} catch (error) {
			setMessage({
				type: "error",
				text: error instanceof Error ? error.message : "Import failed",
			});
		} finally {
			setIsLoading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white p-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-slate-900">
						Data Synchronization
					</h3>
					<div className="relative">
						<button
							onClick={() => setShowInfo(!showInfo)}
							className="text-slate-400 hover:text-slate-600 transition-colors"
							aria-label="Information"
						>
							<Info size={16} />
						</button>
						{showInfo && (
							<div className="absolute top-6 left-0 z-10 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-lg">
								<p className="font-medium mb-1">
									Portability Vault
								</p>
								<p>
									Seamlessly export and import your
									professional portfolio without account
									authentication. This secure snapshot
									preserves all your career data—automatically
									detecting and excluding duplicates during
									restoration for data integrity.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-3">
				<button
					onClick={handleDownload}
					disabled={isLoading}
					className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
				>
					<Download size={16} />
					Download Backup
				</button>

				<button
					onClick={handleUploadClick}
					disabled={isLoading}
					className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
				>
					<Upload size={16} />
					{isLoading ? "Importing..." : "Restore Data"}
				</button>

				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					onChange={handleFileChange}
					className="hidden"
					aria-label="Import data file"
				/>
			</div>

			{message && (
				<div
					className={`mt-3 p-3 rounded-lg text-sm ${
						message.type === "success"
							? "bg-green-50 text-green-700 border border-green-200"
							: "bg-red-50 text-red-700 border border-red-200"
					}`}
				>
					{message.text}
				</div>
			)}
		</div>
	);
}
