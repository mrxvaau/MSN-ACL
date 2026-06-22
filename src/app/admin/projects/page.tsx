"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { CrudFormDrawer, FieldConfig } from "@/components/admin/CrudFormDrawer";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

const schema = z.object({
  title: z.string().min(1), description: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), gallery: z.string().optional(), location: z.string().optional(), status: z.string().optional(), isFlagship: z.boolean().default(false), isPublished: z.boolean().default(true)
});

const formFields: FieldConfig[] = [
  {
    "name": "title",
    "label": "Title",
    "type": "text"
  },
  {
    "name": "description",
    "label": "Description",
    "type": "textarea"
  },
  {
    "name": "content",
    "label": "Content",
    "type": "richtext"
  },
  {
    "name": "imageUrl",
    "label": "Cover Image",
    "type": "image"
  },
  {
    "name": "gallery",
    "label": "Gallery",
    "type": "multi-image"
  },
  {
    "name": "location",
    "label": "Location",
    "type": "text"
  },
  {
    "name": "status",
    "label": "Status",
    "type": "select",
    "options": [
      {
        "label": "Completed",
        "value": "completed"
      },
      {
        "label": "Ongoing",
        "value": "ongoing"
      },
      {
        "label": "Abroad",
        "value": "abroad"
      }
    ]
  },
  {
    "name": "isFlagship",
    "label": "Flagship Project",
    "type": "boolean"
  },
  {
    "name": "isPublished",
    "label": "Published",
    "type": "boolean"
  }
];

export default function ProjectAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: any) => {
    // Convert date format if needed
    let editData = { ...item };
    if (editData.publishedAt) editData.publishedAt = editData.publishedAt.split('T')[0];
    if (editData.deadline) editData.deadline = editData.deadline.split('T')[0];

    setEditingItem(editData);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      // Fix date values specifically
      const payload = { ...data };
      if (payload.publishedAt) payload.publishedAt = new Date(payload.publishedAt).toISOString();
      if (payload.deadline) payload.deadline = new Date(payload.deadline).toISOString();

      const isUpdate = !!editingItem;
      const url = isUpdate ? `/api/projects/${editingItem.id}` : "/api/projects";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(`Saved successfully`);
      setIsDrawerOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${itemToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      setIsDeleteDialogOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPublished } : item)));
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${isPublished ? "Published" : "Unpublished"}`);
    } catch (error) {
      toast.error("Failed to update status");
      fetchItems();
    }
  };

  const handleReorder = async (newItems: any[]) => {
    const res = await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: newItems.map((item) => ({ id: item.id, order: item.order })),
      }),
    });
    if (!res.ok) throw new Error();
    toast.success("Order saved");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onTogglePublish={handleTogglePublish}
        />
      )}

      <CrudFormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingItem ? "Edit" : "Add"}
        schema={schema}
        fields={formFields}
        defaultValues={editingItem || { title: "", description: "", content: "", imageUrl: "", gallery: "[]", location: "", status: "completed", isFlagship: false, isPublished: true }}
        onSubmit={handleSave}
        isSubmitting={isSaving}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
