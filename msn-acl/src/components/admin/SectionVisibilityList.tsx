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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SectionVisibility {
  id: string;
  key: string;
  label: string;
  isVisible: boolean;
  order: number;
}

function SortableItem({
  item,
  onToggle,
}: {
  item: SectionVisibility;
  onToggle: (key: string, isVisible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg shadow-sm mb-2 group"
    >
      <div className="flex items-center gap-4">
        <button
          className="cursor-grab p-1 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="font-medium">{item.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${item.isVisible ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
          {item.isVisible ? "Visible" : "Hidden"}
        </span>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant={item.isVisible ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggle(item.key, !item.isVisible)}
            className="w-24"
          >
            {item.isVisible ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SectionVisibilityList({
  initialItems,
}: {
  initialItems: SectionVisibility[];
}) {
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

  const handleToggle = async (key: string, isVisible: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, isVisible } : item))
    );

    try {
      const res = await fetch(`/api/section-visibility/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      toast.success("Visibility updated");
    } catch (error) {
      toast.error("Error updating visibility");
      // Revert on error
      setItems(initialItems);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));

      setItems(newItems);

      try {
        const payload = newItems.map((item) => ({ id: item.id, order: item.order }));
        const res = await fetch("/api/section-visibility/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
        });
        if (!res.ok) throw new Error("Failed to reorder sections");
        toast.success("Order saved");
      } catch (error) {
        toast.error("Failed to save new order");
        setItems(items); // Revert
      }
    }
  };

  return (
    <DndContext
      id="section-visibility-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="space-y-1">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onToggle={handleToggle} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
