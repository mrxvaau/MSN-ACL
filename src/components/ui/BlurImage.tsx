"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps extends ImageProps {
  fallbackSrc?: string;
}

export function BlurImage({
  src,
  alt,
  className,
  fallbackSrc = "https://placehold.co/600x400/png?text=Image+Not+Found",
  ...props
}: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imgSrc = error ? fallbackSrc : src;

  return (
    <Image
      src={imgSrc}
      alt={alt || "Image"}
      className={cn(
        "duration-700 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "scale-100 blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      onError={() => {
        setError(true);
        setLoading(false);
      }}
      {...props}
    />
  );
}
