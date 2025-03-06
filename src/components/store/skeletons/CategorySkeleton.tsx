
import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySkeletonProps {
  index?: number;
}

const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex-shrink-0"
    >
      <div className="flex flex-col items-center bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
        <Skeleton className="w-full aspect-square mb-1 rounded-lg" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    </motion.div>
  );
};

export default CategorySkeleton;
