const fs = require('fs');
const path = require('path');

const models = [
  {
    name: 'HeroSlide',
    route: 'hero-slides',
    prismaName: 'heroSlide',
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "imageUrl", label: "Background Image", type: "image" },
      { name: "ctaText", label: "CTA Text", type: "text" },
      { name: "ctaLink", label: "CTA Link", type: "text" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `title: z.string().min(1, "Title is required"), subtitle: z.string().optional(), imageUrl: z.string().optional(), ctaText: z.string().optional(), ctaLink: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ title: "", subtitle: "", imageUrl: "", ctaText: "", ctaLink: "", isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'Stat',
    route: 'stats',
    prismaName: 'stat',
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "value", label: "Value (Number)", type: "number" },
      { name: "suffix", label: "Suffix (e.g. +, %)", type: "text" },
    ],
    schema: `label: z.string().min(1), value: z.number(), suffix: z.string().optional()`,
    defaultValues: `{ label: "", value: 0, suffix: "" }`,
    hasPublish: false
  },
  {
    name: 'Project',
    route: 'projects',
    prismaName: 'project',
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "imageUrl", label: "Cover Image", type: "image" },
      { name: "gallery", label: "Gallery", type: "multi-image" },
      { name: "location", label: "Location", type: "text" },
      { name: "status", label: "Status", type: "select", options: [{label:'Completed',value:'completed'},{label:'Ongoing',value:'ongoing'},{label:'Abroad',value:'abroad'}] },
      { name: "isFlagship", label: "Flagship Project", type: "boolean" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `title: z.string().min(1), description: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional(), gallery: z.string().optional(), location: z.string().optional(), status: z.string().optional(), isFlagship: z.boolean().default(false), isPublished: z.boolean().default(true)`,
    defaultValues: `{ title: "", description: "", content: "", imageUrl: "", gallery: "[]", location: "", status: "completed", isFlagship: false, isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'Client',
    route: 'clients',
    prismaName: 'client',
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Website URL", type: "text" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `name: z.string().min(1), logoUrl: z.string().optional(), websiteUrl: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ name: "", logoUrl: "", websiteUrl: "", isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'FundingAgency',
    route: 'funding-agencies',
    prismaName: 'fundingAgency',
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `name: z.string().min(1), logoUrl: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ name: "", logoUrl: "", isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'NewsPost',
    route: 'news',
    prismaName: 'newsPost',
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "coverImage", label: "Cover Image", type: "image" },
      { name: "publishedAt", label: "Published Date", type: "date" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `title: z.string().min(1), slug: z.string().min(1), excerpt: z.string().optional(), content: z.string().optional(), coverImage: z.string().optional(), publishedAt: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ title: "", slug: "", excerpt: "", content: "", coverImage: "", publishedAt: new Date().toISOString().split('T')[0], isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'GlobalPresence',
    route: 'global-presence',
    prismaName: 'globalPresence',
    fields: [
      { name: "country", label: "Country", type: "text" },
      { name: "lat", label: "Latitude", type: "number" },
      { name: "lng", label: "Longitude", type: "number" },
      { name: "note", label: "Note", type: "textarea" },
    ],
    schema: `country: z.string().min(1), lat: z.number(), lng: z.number(), note: z.string().optional()`,
    defaultValues: `{ country: "", lat: 0, lng: 0, note: "" }`,
    hasPublish: false
  },
  {
    name: 'TeamMember',
    route: 'team',
    prismaName: 'teamMember',
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `name: z.string().min(1), designation: z.string().optional(), photoUrl: z.string().optional(), bio: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ name: "", designation: "", photoUrl: "", bio: "", isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'JobPosting',
    route: 'career',
    prismaName: 'jobPosting',
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "department", label: "Department", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "deadline", label: "Deadline", type: "date" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "applyEmail", label: "Apply Email", type: "text" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    schema: `title: z.string().min(1), department: z.string().optional(), location: z.string().optional(), deadline: z.string().optional(), description: z.string().optional(), applyEmail: z.string().optional(), isPublished: z.boolean().default(true)`,
    defaultValues: `{ title: "", department: "", location: "", deadline: "", description: "", applyEmail: "", isPublished: true }`,
    hasPublish: true
  },
  {
    name: 'Policy',
    route: 'policies',
    prismaName: 'policy',
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "fileUrl", label: "File (PDF)", type: "file", acceptPdf: true },
    ],
    schema: `title: z.string().min(1), fileUrl: z.string().optional()`,
    defaultValues: `{ title: "", fileUrl: "" }`,
    hasPublish: false
  },
  {
    name: 'SocialLink',
    route: 'social-links', // Wait, the plan says SocialLink is in settings usually, but we will make it its own route or keep order? Actually, there isn't an admin route listed for SocialLinks in step 3... wait, no, "SocialLinks" is mentioned in step 5. I will give it a route 'social-links'.
    prismaName: 'socialLink',
    fields: [
      { name: "platform", label: "Platform", type: "select", options: [{label:'Facebook',value:'facebook'},{label:'LinkedIn',value:'linkedin'},{label:'WhatsApp',value:'whatsapp'},{label:'Twitter',value:'twitter'},{label:'Messenger',value:'messenger'}] },
      { name: "url", label: "URL", type: "text" },
    ],
    schema: `platform: z.string().min(1), url: z.string().url().optional()`,
    defaultValues: `{ platform: "facebook", url: "" }`,
    hasPublish: false
  }
];

function generateApiRoute1(model) {
  return `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.${model.prismaName}.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    
    let order = 0;
    try {
      const lastItem = await prisma.${model.prismaName}.findFirst({ orderBy: { order: "desc" } });
      order = lastItem ? lastItem.order + 1 : 0;
    } catch(e) {} // Some models might not have order, but plan says "keep order". We assume they have 'order' field. 
    // Wait, SocialLink has 'order'.

    const newItem = await prisma.${model.prismaName}.create({
      data: { ...data, order },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
`;
}

function generateApiRoute2(model) {
  return `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const data = await req.json();

    const updatedItem = await prisma.${model.prismaName}.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await prisma.${model.prismaName}.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
`;
}

function generateApiRoute3(model) {
  return `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items } = await req.json();

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.${model.prismaName}.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
`;
}

function generatePage(model) {
  return `"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { CrudFormDrawer, FieldConfig } from "@/components/admin/CrudFormDrawer";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

const schema = z.object({
  ${model.schema}
});

const formFields: FieldConfig[] = ${JSON.stringify(model.fields, null, 2)};

export default function ${model.name}AdminPage() {
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
      const res = await fetch("/api/${model.route}");
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
      const url = isUpdate ? \`/api/${model.route}/\${editingItem.id}\` : "/api/${model.route}";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(\`Saved successfully\`);
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
      const res = await fetch(\`/api/${model.route}/\${itemToDelete.id}\`, { method: "DELETE" });
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
      const res = await fetch(\`/api/${model.route}/\${id}\`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(\`\${isPublished ? "Published" : "Unpublished"}\`);
    } catch (error) {
      toast.error("Failed to update status");
      fetchItems();
    }
  };

  const handleReorder = async (newItems: any[]) => {
    const res = await fetch("/api/${model.route}/reorder", {
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
          <h1 className="text-3xl font-bold tracking-tight">${model.name}s</h1>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add ${model.name}
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
          ${model.hasPublish ? `onTogglePublish={handleTogglePublish}` : ''}
        />
      )}

      <CrudFormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingItem ? "Edit" : "Add"}
        schema={schema}
        fields={formFields}
        defaultValues={editingItem || ${model.defaultValues}}
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
`;
}

models.forEach(model => {
  const apiDir = path.join(__dirname, 'src', 'app', 'api', model.route);
  const adminDir = path.join(__dirname, 'src', 'app', 'admin', model.route);

  fs.mkdirSync(path.join(apiDir, '[id]'), { recursive: true });
  fs.mkdirSync(path.join(apiDir, 'reorder'), { recursive: true });
  fs.mkdirSync(adminDir, { recursive: true });

  fs.writeFileSync(path.join(apiDir, 'route.ts'), generateApiRoute1(model));
  fs.writeFileSync(path.join(apiDir, '[id]', 'route.ts'), generateApiRoute2(model));
  fs.writeFileSync(path.join(apiDir, 'reorder', 'route.ts'), generateApiRoute3(model));
  fs.writeFileSync(path.join(adminDir, 'page.tsx'), generatePage(model));
});

console.log("Scaffold complete.");
