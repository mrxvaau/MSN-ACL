"use client";

import { useState } from "react";
import { CrudFormDrawer } from "@/components/admin/CrudFormDrawer";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PageHeader } from "@prisma/client";
import { useRouter } from "next/navigation";
import * as z from "zod";

const pageHeaderSchema = z.object({
  pageKey: z.string(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
});

export default function PageHeadersClient({ initialData }: { initialData: PageHeader[] }) {
  const router = useRouter();
  const [data, setData] = useState<PageHeader[]>(initialData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PageHeader | null>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item as PageHeader);
    setIsDrawerOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (!editingItem) return;
    
    // Update
    const res = await fetch(`/api/page-headers/${editingItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedItem = await res.json();
      setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setIsDrawerOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Page Key</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Subtitle</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{item.pageKey}</td>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4 truncate max-w-xs">{item.subtitle}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary hover:underline font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrudFormDrawer
        open={isDrawerOpen}
        onOpenChange={(val) => setIsDrawerOpen(val)}
        title="Edit Page Header"
        onSubmit={handleSave}
        schema={pageHeaderSchema}
        defaultValues={editingItem || {}}
        fields={[
          {
            name: "pageKey",
            label: "Page Key (Do not modify)",
            type: "text",
          },
          {
            name: "title",
            label: "Title",
            type: "text",
          },
          {
            name: "subtitle",
            label: "Subtitle",
            type: "textarea",
          },
          {
            name: "backgroundImage",
            label: "Background Image",
            type: "image",
          },
        ]}
      />
    </>
  );
}
