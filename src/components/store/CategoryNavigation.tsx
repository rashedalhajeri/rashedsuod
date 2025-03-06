
import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sections: string[];
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  onCategoryChange,
  categories = [],
  sections = ["جميع المنتجات"]
}) => {
  const [isFixed, setIsFixed] = useState(false);
  
  // Memoize the scroll handler to avoid recreating it on each render
  const handleScroll = useCallback(() => {
    const shouldFix = window.scrollY > 100;
    if (isFixed !== shouldFix) {
      setIsFixed(shouldFix);
    }
  }, [isFixed]);

  useEffect(() => {
    // Add passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Memoize the category button click handler
  const handleCategoryClick = useCallback((category: string) => {
    return () => onCategoryChange(category);
  }, [onCategoryChange]);

  // Animation variants for better performance
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3, 
        delay: i * 0.03, // Reduced delay for faster appearance
        ease: "easeOut" 
      }
    })
  };

  return (
    <div 
      className={`categories-bar ${isFixed ? "fixed-bar" : ""} bg-white py-3 border-b shadow-sm w-full z-50`}
    >
      <div className="container mx-auto">
        <div className="scroll-container hide-scrollbar px-4">
          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={`section-${section}`}
              className="scroll-item"
              initial="hidden"
              animate="visible"
              custom={index}
              variants={itemVariants}
              layout
            >
              <Button 
                variant={activeCategory === section ? "default" : "outline"} 
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === section 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-none" 
                    : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                } transition-all min-w-24 font-medium text-sm`}
                onClick={handleCategoryClick(section)}
              >
                {section}
              </Button>
            </motion.div>
          ))}

          {/* Divider - Only show if we have categories */}
          {categories.length > 0 && (
            <div className="mx-2 border-r border-gray-300 h-6"></div>
          )}
          
          {/* Categories */}
          {categories.length > 0 && categories.map((category, index) => (
            <motion.div
              key={`category-${category}`}
              className="scroll-item"
              initial="hidden"
              animate="visible"
              custom={index + sections.length}
              variants={itemVariants}
              layout
            >
              <Button 
                variant={activeCategory === category ? "default" : "outline"} 
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === category 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-none" 
                    : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                } transition-all min-w-24 font-medium text-sm`}
                onClick={handleCategoryClick(category)}
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

// Memoize the entire component to prevent unnecessary rerenders
export default memo(CategoryNavigation);
