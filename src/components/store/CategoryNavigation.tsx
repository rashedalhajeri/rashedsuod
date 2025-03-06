
import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryNavigationProps {
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
  categories: string[];
  sections: string[];
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange,
  categories = [],
  sections = []
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  
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

  // Memoize the section button click handler
  const handleSectionClick = useCallback((section: string) => {
    return () => onSectionChange(section);
  }, [onSectionChange]);

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
        <h2 className="text-lg font-semibold mb-3 px-4">الفئات والأقسام</h2>
        
        <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-2 mx-4">
            <TabsTrigger value="categories" className="text-sm font-medium">الفئات</TabsTrigger>
            <TabsTrigger value="sections" className="text-sm font-medium">الأقسام</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="scroll-container hide-scrollbar px-4">
              {categories.length > 0 ? categories.map((category, index) => (
                <motion.div
                  key={`category-${category}`}
                  className="scroll-item"
                  initial="hidden"
                  animate="visible"
                  custom={index}
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
              )) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  لا توجد فئات متاحة
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="scroll-container hide-scrollbar px-4">
              {sections.length > 0 ? sections.map((section, index) => (
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
                    variant={activeSection === section ? "default" : "outline"} 
                    className={`rounded-full whitespace-nowrap ${
                      activeSection === section 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-none" 
                        : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                    } transition-all min-w-24 font-medium text-sm`}
                    onClick={handleSectionClick(section)}
                  >
                    {section}
                  </Button>
                </motion.div>
              )) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  لا توجد أقسام متاحة
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary rerenders
export default memo(CategoryNavigation);
