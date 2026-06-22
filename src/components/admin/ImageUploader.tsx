"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  acceptPdf?: boolean;
}

export function ImageUploader({ value, onChange, className, acceptPdf = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    
    if (!isImage && (!acceptPdf || !isPdf)) {
      toast.error(acceptPdf ? "Please upload an image or PDF file" : "Please upload an image file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const isValuePdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div className={className}>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/30">
          {isValuePdf ? (
            <div className="w-full h-48 flex flex-col items-center justify-center bg-muted">
              <FileText className="w-12 h-12 text-primary mb-2" />
              <span className="text-sm font-medium truncate max-w-[80%] px-2">Document Attached</span>
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1">View PDF</a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer min-h-[12rem]"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click or drag file to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                {acceptPdf ? "SVG, PNG, JPG, GIF or PDF" : "SVG, PNG, JPG or GIF"}
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={acceptPdf ? "image/*,application/pdf" : "image/*"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
