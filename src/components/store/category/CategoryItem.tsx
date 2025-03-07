
import React from "react";
import { motion } from "framer-motion";
import { getCategoryImage } from "@/utils/category-image-utils";

interface CategoryItemProps {
  category: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isActive, 
  index, 
  onClick 
}) => {
  // Use the helper function to get appropriate image
  const imagePath = getCategoryImage(category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex-shrink-0"
    >
      <button
        onClick={onClick}
        className={`w-full h-full flex flex-col items-center transition-all duration-300 bg-white rounded-lg p-1.5 shadow-sm ${
          isActive
            ? 'border-2 border-blue-400'
            : 'border border-gray-100'
        }`}
      >
        <div className="w-full aspect-square mb-1 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          <img 
            src={imagePath}
            alt={category} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <span className={`text-xs truncate w-full text-center ${
          isActive
            ? 'text-blue-600'
            : 'text-gray-800'
        }`}>
          {category}
        </span>
      </button>
    </motion.div>
  );
};

export default CategoryItem;
