
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
    <div className="bg-white py-4 border-b fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="scroll-container hide-scrollbar">
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
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm" 
                    : "bg-white hover:bg-primary/10 hover:text-primary border-gray-200"
                } transition-all min-w-24 font-medium`}
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
