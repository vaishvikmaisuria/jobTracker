"use client";

import { useState } from "react";
import type { Problem } from "@job-tracker/types";
import { ProblemStatus } from "@job-tracker/types";
import { formatDate } from "@job-tracker/core";
import { useProblemStore } from "@/store/problemStore";
import { DifficultyBadge, ProblemStatusBadge } from "./ProblemBadges";
import { Button, ConfirmDialog, Modal } from "@/components/ui";
import { ProblemForm } from "./ProblemForm";
import type { ProblemFormValues } from "@job-tracker/core";
import { Edit2, Trash2, ExternalLink, Star, CheckCircle2, RefreshCcw } from "lucide-react";

interface ProblemDetailProps {
  problem: Problem;
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const { updateProblem, deleteProblem, markSolved, selectProblem } = useProblemStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleEdit(values: ProblemFormValues) {
    await updateProblem(problem.id, values);
    setEditOpen(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteProblem(problem.id);
    setDeleting(false);
    setDeleteOpen(false);
    selectProblem(null);
  }

  const isSolved = problem.status === ProblemStatus.Solved;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 truncate">{problem.name}</h2>
            {problem.isFavorite && <Star size={15} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{problem.type}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Edit2 size={13} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <ProblemStatusBadge status={problem.status} />
      </div>

      {/* Tags */}
      {problem.topicTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {problem.topicTags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 text-slate-600 text-xs px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {!isSolved && (
          <Button size="sm" onClick={() => markSolved(problem.id)}>
            <CheckCircle2 size={13} /> Mark Solved
          </Button>
        )}
        {problem.url && (
          <a href={problem.url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              <ExternalLink size={13} /> Open on LeetCode
            </Button>
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoRow label="Attempted" value={formatDate(problem.attemptedAt)} />
        <InfoRow label="Solved" value={formatDate(problem.solvedAt)} />
        <InfoRow label="Revisions" value={String(problem.revisionCount)} />
      </div>

      {/* Notes */}
      {problem.notes && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">Notes</p>
          <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 whitespace-pre-wrap">{problem.notes}</p>
        </div>
      )}

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Problem" size="lg">
        <ProblemForm
          defaultValues={{ ...problem, url: problem.url ?? "" }}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
          submitLabel="Update Problem"
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Problem"
        description={`Delete "${problem.name}"? This cannot be undone.`}
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
