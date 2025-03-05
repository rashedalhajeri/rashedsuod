
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[200px] w-full rounded-md" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Skeleton;
