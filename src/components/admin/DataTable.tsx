"use client";

import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";

interface DataItem {
  id: string;
  title: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isPublished?: boolean;
}

interface DataTableProps {
  items: DataItem[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onTogglePublish?: (id: string, isPublished: boolean) => void;
}

export function SortableRow({ 
  item, 
  onEdit, 
  onDelete, 
  onTogglePublish 
}: { 
  item: DataItem; 
  onEdit: () => void; 
  onDelete: () => void; 
  onTogglePublish?: (id: string, val: boolean) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-colors",
        isDragging && "opacity-50 bg-muted shadow-lg z-50 relative"
      )}
    >
      <TableCell className="w-12">
        <button
          className="cursor-grab hover:text-primary transition-colors touch-none text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </TableCell>
      <TableCell className="w-20">
        {(item.imageUrl || item.iconUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl || item.iconUrl || ""}
            alt={item.title}
            className="w-12 h-12 rounded-md object-cover border border-border"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border">
            No img
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{item.title}</TableCell>
      <TableCell className="w-32">
        {onTogglePublish && typeof item.isPublished === "boolean" && (
          <Switch
            checked={item.isPublished}
            onCheckedChange={(val) => onTogglePublish(item.id, val)}
          />
        )}
      </TableCell>
      <TableCell className="w-32 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DataTable({ items, onEdit, onDelete, onTogglePublish }: DataTableProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-white dark:bg-zinc-900">
        No items found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50 dark:bg-zinc-900/50">
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Published</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <SortableRow
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
