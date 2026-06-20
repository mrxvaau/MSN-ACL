"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DataTable } from "./DataTable";
import { toast } from "sonner";

interface ReorderableListProps {
  items: any[];
  onReorder: (newItems: any[]) => Promise<void>;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onTogglePublish?: (id: string, isPublished: boolean) => void;
}

export function ReorderableList({
  items: initialItems,
  onReorder,
  onEdit,
  onDelete,
  onTogglePublish,
}: ReorderableListProps) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));

      // Optimistic update
      setItems(newItems);

      try {
        await onReorder(newItems);
        // toast.success("Order saved");
      } catch (error) {
        toast.error("Failed to save new order");
        // Revert on failure
        setItems(items);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <DataTable
          items={items}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
      </SortableContext>
    </DndContext>
  );
}
