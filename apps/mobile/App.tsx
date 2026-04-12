import { useEffect, useMemo, useState } from "react";
import {
	FlatList,
	Linking,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { computeDashboardStats, formatDateShort } from "@job-tracker/core";
import type { Job, Problem, Resource } from "@job-tracker/types";
import { useMobileTrackerStore } from "./src/store/useMobileTrackerStore";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "jobs" | "problems" | "resources";

function StatCard({ title, value }: { title: string; value: string | number }) {
	return (
		<View style={styles.statCard}>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</View>
	);
}

function JobsTab({ jobs }: { jobs: Job[] }) {
	return (
		<FlatList
			data={jobs}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			ListEmptyComponent={
				<Text style={styles.emptyText}>No jobs yet</Text>
			}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.cardTitle}>{item.companyName}</Text>
					<Text style={styles.cardMeta}>{item.roleOrPosition}</Text>
					<Text style={styles.cardMeta}>{item.status}</Text>
					<Text style={styles.cardMeta}>
						Applied {formatDateShort(item.dateApplied)}
					</Text>
				</View>
			)}
		/>
	);
}

function ProblemsTab({
	problems,
	onMarkSolved,
	onToggleFavorite,
}: {
	problems: Problem[];
	onMarkSolved(problemId: string): Promise<void>;
	onToggleFavorite(problemId: string): Promise<void>;
}) {
	return (
		<FlatList
			data={problems}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			ListEmptyComponent={
				<Text style={styles.emptyText}>No problems yet</Text>
			}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.cardTitle}>{item.name}</Text>
					<Text style={styles.cardMeta}>{item.difficulty}</Text>
					<Text style={styles.cardMeta}>{item.status}</Text>
					<View style={styles.inlineActions}>
						<Pressable
							style={styles.secondaryButton}
							onPress={() => onMarkSolved(item.id)}
						>
							<Text style={styles.secondaryButtonText}>
								Mark Solved
							</Text>
						</Pressable>
						<Pressable
							style={styles.secondaryButton}
							onPress={() => onToggleFavorite(item.id)}
						>
							<Text style={styles.secondaryButtonText}>
								{item.isFavorite ? "Unfavorite" : "Favorite"}
							</Text>
						</Pressable>
					</View>
				</View>
			)}
		/>
	);
}

function ResourcesTab({ resources }: { resources: Resource[] }) {
	return (
		<FlatList
			data={resources}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			ListEmptyComponent={
				<Text style={styles.emptyText}>No resources yet</Text>
			}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.cardTitle}>{item.title}</Text>
					<Text style={styles.cardMeta}>{item.category}</Text>
					<Text style={styles.cardMeta}>{item.type}</Text>
					<Pressable
						style={styles.secondaryButton}
						onPress={() => Linking.openURL(item.url)}
					>
						<Text style={styles.secondaryButtonText}>
							Open Link
						</Text>
					</Pressable>
				</View>
			)}
		/>
	);
}

export default function App() {
	const [tab, setTab] = useState<Tab>("dashboard");

	const {
		jobs,
		problems,
		resources,
		loading,
		error,
		bootstrapped,
		init,
		markProblemSolved,
		toggleFavoriteProblem,
	} = useMobileTrackerStore();

	useEffect(() => {
		if (!bootstrapped) {
			init();
		}
	}, [bootstrapped, init]);

	const stats = useMemo(
		() => computeDashboardStats(jobs, problems, resources),
		[jobs, problems, resources],
	);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" />
			<ExpoStatusBar style="dark" />

			<View style={styles.header}>
				<Text style={styles.title}>Job Tracker Mobile</Text>
				<Text style={styles.subtitle}>
					Shared domain + storage, mobile-native UI
				</Text>
			</View>

			<View style={styles.tabs}>
				{(["dashboard", "jobs", "problems", "resources"] as Tab[]).map(
					(item) => (
						<Pressable
							key={item}
							style={[
								styles.tab,
								tab === item ? styles.tabActive : null,
							]}
							onPress={() => setTab(item)}
						>
							<Text
								style={[
									styles.tabText,
									tab === item ? styles.tabTextActive : null,
								]}
							>
								{item[0].toUpperCase() + item.slice(1)}
							</Text>
						</Pressable>
					),
				)}
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			{tab === "dashboard" ? (
				<ScrollView contentContainerStyle={styles.dashboardContainer}>
					<View style={styles.statsGrid}>
						<StatCard
							title="Applications"
							value={stats.totalApplications}
						/>
						<StatCard
							title="Interviews"
							value={stats.activeInterviews}
						/>
						<StatCard title="Offers" value={stats.offers} />
						<StatCard title="Rejections" value={stats.rejections} />
						<StatCard title="Solved" value={stats.solvedProblems} />
						<StatCard title="Resources" value={stats.savedLinks} />
					</View>
					<Text style={styles.mutedText}>
						{loading ? "Refreshing data..." : "Synced"}
					</Text>
				</ScrollView>
			) : null}

			{tab === "jobs" ? <JobsTab jobs={jobs} /> : null}
			{tab === "problems" ? (
				<ProblemsTab
					problems={problems}
					onMarkSolved={markProblemSolved}
					onToggleFavorite={toggleFavoriteProblem}
				/>
			) : null}
			{tab === "resources" ? (
				<ResourcesTab resources={resources} />
			) : null}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.text,
	},
	subtitle: {
		marginTop: 3,
		fontSize: 13,
		color: colors.muted,
	},
	tabs: {
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 14,
		paddingBottom: 8,
	},
	tab: {
		flex: 1,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		paddingVertical: 8,
		alignItems: "center",
	},
	tabActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	tabText: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.text,
	},
	tabTextActive: {
		color: "#FFFFFF",
	},
	dashboardContainer: {
		paddingHorizontal: 14,
		paddingBottom: 20,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 10,
	},
	statCard: {
		width: "48.5%",
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		backgroundColor: colors.surface,
		padding: 12,
	},
	statValue: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.text,
	},
	statTitle: {
		marginTop: 3,
		fontSize: 12,
		color: colors.muted,
	},
	listContainer: {
		paddingHorizontal: 14,
		paddingBottom: 24,
		gap: 10,
	},
	card: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		backgroundColor: colors.surface,
		padding: 12,
		gap: 4,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.text,
	},
	cardMeta: {
		fontSize: 13,
		color: colors.muted,
	},
	inlineActions: {
		marginTop: 8,
		flexDirection: "row",
		gap: 8,
	},
	secondaryButton: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.primary,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	secondaryButtonText: {
		color: colors.primary,
		fontSize: 12,
		fontWeight: "600",
	},
	mutedText: {
		marginTop: 10,
		color: colors.muted,
		fontSize: 12,
	},
	errorText: {
		color: colors.danger,
		fontSize: 12,
		marginBottom: 6,
		paddingHorizontal: 14,
	},
	emptyText: {
		fontSize: 14,
		color: colors.muted,
		textAlign: "center",
		marginTop: 20,
	},
});
