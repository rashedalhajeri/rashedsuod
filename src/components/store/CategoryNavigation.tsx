
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  onCategoryChange,
  categories = ["جميع المنتجات", "الأكثر مبيعاً", "العروض", "الجديد", "الأكسسوارات"]
}) => {
  return (
    <div className="bg-white py-4 border-b sticky top-16 left-0 right-0 z-40 shadow-sm">
      <div className="container mx-auto">
        <div className="scroll-container hide-scrollbar px-4">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              className="scroll-item"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut" 
              }}
            >
              <Button 
                variant={activeCategory === category ? "default" : "outline"} 
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === category 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-none" 
                    : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                } transition-all min-w-24 font-medium text-sm`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
