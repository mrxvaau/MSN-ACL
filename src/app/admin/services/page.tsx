"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { CrudFormDrawer, FieldConfig } from "@/components/admin/CrudFormDrawer";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
});

const formFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g. Corporate Consulting" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Brief description..." },
  { name: "iconUrl", label: "Icon Image", type: "image" },
  { name: "imageUrl", label: "Cover Image", type: "image" },
  { name: "isPublished", label: "Published", type: "boolean" },
];

export default function ServicesAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const isUpdate = !!editingItem;
      const url = isUpdate ? `/api/services/${editingItem.id}` : "/api/services";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast.success(`Service ${isUpdate ? "updated" : "created"} successfully`);
      setIsDrawerOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/services/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Service deleted");
      setIsDeleteDialogOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    // Optimistic local update
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPublished } : item)));
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Service ${isPublished ? "published" : "unpublished"}`);
    } catch (error) {
      toast.error("Failed to update status");
      fetchItems(); // Revert on failure
    }
  };

  const handleReorder = async (newItems: any[]) => {
    const res = await fetch("/api/services/reorder", {
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
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your corporate services here.</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Service
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
        title={editingItem ? "Edit Service" : "Add Service"}
        schema={serviceSchema}
        fields={formFields}
        defaultValues={
          editingItem || {
            title: "",
            description: "",
            iconUrl: "",
            imageUrl: "",
            isPublished: true,
          }
        }
        onSubmit={handleSave}
        isSubmitting={isSaving}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Service?"
        description={`Are you sure you want to delete "${itemToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
