
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductImageSkeleton = () => {
  return (
    <div className="relative overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="absolute top-4 right-4">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <div className="absolute bottom-4 left-4">
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default ProductImageSkeleton;
