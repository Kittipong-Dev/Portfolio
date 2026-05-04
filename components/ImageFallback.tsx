"use client";

import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImageFallbackProps = {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  imageClassName?: string;
};

export function ImageFallback({
  src,
  alt,
  label = "Image coming soon",
  className = "",
  imageClassName = ""
}: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const showPlaceholder = !src || hasError;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth === 0) {
      setHasError(true);
    }
  }, [src]);

  return (
    <div
      className={`relative flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${className}`}
    >
      {showPlaceholder ? (
        <div className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">
          <ImageIcon className="h-8 w-8 text-accent/60" aria-hidden="true" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  );
}
