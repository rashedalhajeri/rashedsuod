
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sections: string[]; // أضفنا الأقسام كمصفوفة منفصلة
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  onCategoryChange,
  categories = [],
  sections = ["جميع المنتجات"]
}) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`categories-bar ${isFixed ? "fixed-bar" : ""} bg-white py-4 border-b shadow-sm w-full z-50`}
    >
      <div className="container mx-auto">
        <div className="scroll-container hide-scrollbar px-4">
          {/* عرض الأقسام الثابتة أولاً */}
          {sections.map((section, index) => (
            <motion.div
              key={`section-${section}`}
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
                variant={activeCategory === section ? "default" : "outline"} 
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === section 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-none" 
                    : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                } transition-all min-w-24 font-medium text-sm`}
                onClick={() => onCategoryChange(section)}
              >
                {section}
              </Button>
            </motion.div>
          ))}

          {/* ثم عرض الفئات من قاعدة البيانات */}
          {categories.length > 0 && (
            <>
              {/* فاصل بين الأقسام والفئات */}
              <div className="mx-2 border-r border-gray-300 h-6"></div>
              
              {/* الفئات */}
              {categories.map((category, index) => (
                <motion.div
                  key={`category-${category}`}
                  className="scroll-item"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: (index + sections.length) * 0.05,
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
