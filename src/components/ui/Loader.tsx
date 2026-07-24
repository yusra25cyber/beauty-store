import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({ size = "md", className }: LoaderProps) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border border-light-gray border-t-deep-navy`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-light-gray rounded ${className || ""}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="space-y-1.5">
        <Skeleton className="h-2.5 w-1/3" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
