
import React from "react";
import { motion } from "framer-motion";

interface CategoryItemProps {
  category: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
  imagePath?: string;
  showImage: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isActive, 
  index, 
  onClick,
  imagePath,
  showImage
}) => {
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
        {showImage && (
          <div className="w-full aspect-square mb-1 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
            <img 
              src={imagePath || "/placeholder.svg"}
              alt={category} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        )}
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
