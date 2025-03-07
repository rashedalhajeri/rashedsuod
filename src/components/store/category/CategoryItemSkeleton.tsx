
import React from "react";
import { motion } from "framer-motion";

interface CategoryItemSkeletonProps {
  index: number;
}

const CategoryItemSkeleton: React.FC<CategoryItemSkeletonProps> = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex-shrink-0"
    >
      <div className="w-full flex flex-col items-center bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
        <div className="w-full aspect-square mb-1 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-2 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default CategoryItemSkeleton;
