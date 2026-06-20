"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { RichTextEditor } from "./RichTextEditor";

export type FieldType = "text" | "textarea" | "richtext" | "image" | "multi-image" | "file" | "number" | "boolean" | "date" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  acceptPdf?: boolean;
}

interface CrudFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  schema: z.ZodSchema<any>;
  fields: FieldConfig[];
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function CrudFormDrawer({
  open,
  onOpenChange,
  title,
  schema,
  fields,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: CrudFormDrawerProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues || {});
    }
  }, [open, defaultValues, reset]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Fill out the fields below to save.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-20">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>

              {field.type === "text" && (
                <Input
                  id={field.name}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                />
              )}

              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  {...register(field.name, { valueAsNumber: true })}
                  placeholder={field.placeholder}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  rows={4}
                />
              )}

              {field.type === "boolean" && (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex items-center h-10">
                      <Switch checked={!!value} onCheckedChange={onChange} />
                    </div>
                  )}
                />
              )}

              {field.type === "image" && (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ImageUploader value={value} onChange={onChange} />
                  )}
                />
              )}

              {field.type === "file" && (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ImageUploader value={value} onChange={onChange} acceptPdf={field.acceptPdf} />
                  )}
                />
              )}

              {field.type === "multi-image" && (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    const images = (value ? JSON.parse(value as string) : []) as string[];
                    return (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {images.map((img, i) => (
                            <div key={i} className="relative group">
                              <img src={img} className="w-full h-24 object-cover rounded-md" alt="" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={() => {
                                  const newImgs = images.filter((_, idx) => idx !== i);
                                  onChange(JSON.stringify(newImgs));
                                }}
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                        <ImageUploader
                          onChange={(url) => {
                            const newImgs = [...images, url];
                            onChange(JSON.stringify(newImgs));
                          }}
                        />
                      </div>
                    );
                  }}
                />
              )}

              {field.type === "date" && (
                <Input
                  id={field.name}
                  type="date"
                  {...register(field.name)}
                />
              )}

              {field.type === "select" && (
                <select
                  id={field.name}
                  {...register(field.name)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {field.type === "richtext" && (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RichTextEditor value={value || ""} onChange={onChange} />
                  )}
                />
              )}

              {errors[field.name] && (
                <p className="text-sm text-destructive mt-1">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="pt-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
