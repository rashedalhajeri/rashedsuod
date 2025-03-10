
import React from "react";
import { motion } from "framer-motion";
import ProductGridSkeleton from "@/components/store/skeletons/ProductGridSkeleton";

const StoreSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="grid grid-cols-5 gap-1.5 mx-auto mb-6">
        {[...Array(5)].map((_, index) => (
          <div key={`cat-skeleton-${index}`} className="flex-shrink-0">
            <div className="w-full flex flex-col items-center bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
              <div className="w-full aspect-square mb-1 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-2 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center py-3 px-5 bg-white border-b border-gray-100 rounded-t-lg shadow-sm">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </motion.div>
  );
};

export default StoreSkeleton;
