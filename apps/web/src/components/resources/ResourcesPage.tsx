"use client";

import { useEffect, useState } from "react";
import { useResourceStore } from "@/store/resourceStore";
import { ResourceCategory, ResourceType } from "@job-tracker/types";
import type { Resource } from "@job-tracker/types";
import { SearchBar, Button, Select, EmptyState, Badge, ConfirmDialog, Modal } from "@/components/ui";
import { Plus, BookMarked, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { ResourceForm } from "./ResourceForm";
import type { ResourceFormValues } from "@job-tracker/core";

const CATEGORY_FILTER = [
  { value: "", label: "All Categories" },
  ...Object.values(ResourceCategory).map((c) => ({ value: c, label: c })),
];

const TYPE_FILTER = [
  { value: "", label: "All Types" },
  ...Object.values(ResourceType).map((t) => ({ value: t, label: t })),
];

const TYPE_COLORS: Record<ResourceType, string> = {
  [ResourceType.Website]:  "bg-blue-100 text-blue-700",
  [ResourceType.Article]:  "bg-green-100 text-green-700",
  [ResourceType.Video]:    "bg-red-100 text-red-700",
  [ResourceType.Doc]:      "bg-purple-100 text-purple-700",
  [ResourceType.Template]: "bg-orange-100 text-orange-700",
  [ResourceType.Other]:    "bg-gray-100 text-gray-700",
};

export function ResourcesPage() {
  const {
    resources,
    loading,
    filters,
    init,
    setFilters,
    createResource,
    updateResource,
    deleteResource,
  } = useResourceStore();

  const [addOpen, setAddOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteResource_, setDeleteResource] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    init();
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setFilters({ ...filters, search: value });
  }

  async function handleCreate(values: ResourceFormValues) {
    await createResource({ ...values, tags: values.tags ?? [] });
    setAddOpen(false);
  }

  async function handleEdit(values: ResourceFormValues) {
    if (!editResource) return;
    await updateResource(editResource.id, { ...values, tags: values.tags ?? [] });
    setEditResource(null);
  }

  async function handleDelete() {
    if (!deleteResource_) return;
    setDeleting(true);
    await deleteResource(deleteResource_.id);
    setDeleting(false);
    setDeleteResource(null);
  }

  // Group resources by category
  const grouped = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Useful Links</h1>
          <p className="text-sm text-slate-500 mt-0.5">{resources.length} resources</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add Link
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchBar value={search} onChange={handleSearch} placeholder="Search resources..." className="w-56" />
        <Select options={CATEGORY_FILTER} onChange={(e) => setFilters({ ...filters, category: e.target.value ? [e.target.value as ResourceCategory] : undefined })} className="w-44" />
        <Select options={TYPE_FILTER} onChange={(e) => setFilters({ ...filters, type: e.target.value ? [e.target.value as ResourceType] : undefined })} className="w-36" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={<BookMarked size={22} />}
          title="No resources yet"
          description="Save useful links, articles, and resources."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus size={14} /> Add First Link
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-slate-700 mb-3 px-1">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={() => setEditResource(resource)}
                    onDelete={() => setDeleteResource(resource)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Resource" size="md">
        <ResourceForm onSubmit={handleCreate} onCancel={() => setAddOpen(false)} submitLabel="Add Link" />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editResource} onClose={() => setEditResource(null)} title="Edit Resource" size="md">
        {editResource && (
          <ResourceForm
            defaultValues={{ ...editResource, description: editResource.description ?? "", notes: editResource.notes ?? "" }}
            onSubmit={handleEdit}
            onCancel={() => setEditResource(null)}
            submitLabel="Update"
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteResource_}
        onClose={() => setDeleteResource(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        description={`Delete "${deleteResource_?.title}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

function ResourceCard({
  resource,
  onEdit,
  onDelete,
}: {
  resource: Resource;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Type badge */}
      <div className="flex items-center justify-between">
        <Badge className={TYPE_COLORS[resource.type]}>{resource.type}</Badge>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-sm flex items-center gap-1.5 group"
        >
          {resource.title}
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        {resource.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{resource.description}</p>
        )}
      </div>

      {/* Notes */}
      {resource.notes && (
        <p className="text-xs text-slate-400 italic">{resource.notes}</p>
      )}
    </div>
  );
}
