
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductInfoSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4 rounded" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-24 rounded" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
};

export default ProductInfoSkeleton;
