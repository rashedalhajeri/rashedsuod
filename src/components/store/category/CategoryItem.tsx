
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
        className={`relative w-full h-full flex flex-col items-center transition-all duration-300 ${
          isActive
            ? 'bg-blue-50 border-2 border-blue-400 shadow-md'
            : 'bg-white border border-gray-100 hover:shadow-sm hover:border-blue-200'
        } rounded-lg p-2`}
      >
        {showImage && (
          <div className={`relative w-full aspect-square mb-1.5 flex items-center justify-center overflow-hidden rounded-md ${
            isActive ? 'bg-white' : 'bg-gray-50'
          }`}>
            <img 
              src={imagePath || "/placeholder.svg"}
              alt={category} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {isActive && (
              <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 rounded-md"></div>
            )}
          </div>
        )}
        <span className={`text-xs leading-tight text-center font-medium ${
          isActive
            ? 'text-blue-600'
            : 'text-gray-700'
        }`}>
          {category}
        </span>
      </button>
    </motion.div>
  );
};

export default CategoryItem;
