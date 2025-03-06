
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface ProductSkeletonProps {
  index?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col"
    >
      <div className="relative rounded-xl overflow-hidden shadow-sm w-full aspect-square">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <Skeleton className="h-4 w-3/4 rounded mb-1" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
    </motion.div>
  );
};

export default ProductSkeleton;
