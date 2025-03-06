
import React, { useState, useEffect, useCallback, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = memo(({
  categories,
  sections,
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange
}) => {
  const [stickyNav, setStickyNav] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "sections">("categories");

  // Listen to scroll to make navigation bar sticky on scroll
  const handleScroll = useCallback(() => {
    const categorySection = document.querySelector('.categories-content');
    if (categorySection) {
      const position = categorySection.getBoundingClientRect();
      setStickyNav(position.top <= 0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Filter out empty arrays
  const hasCategories = categories.length > 0;
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Default to whichever tab has content
  useEffect(() => {
    if (!hasCategories && hasSections) {
      setActiveTab("sections");
    }
  }, [hasCategories, hasSections]);

  // Prepare categories with "All" option at the beginning for RTL display
  const categoriesWithAll = ["الكل", ...categories];

  return (
    <div className={`bg-white py-4 z-10 transition-all duration-300 ${
      stickyNav ? 'sticky top-0 shadow-md' : ''
    }`}>
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4 text-right pr-2">تصفح المتجر</h2>
        
        <Tabs 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "categories" | "sections")}
          className="w-full"
          dir="rtl"
        >
          {/* Only show tabs if both categories and sections exist */}
          {hasCategories && hasSections && (
            <TabsList className="mb-4 bg-gray-100 rounded-full p-1 border mx-auto w-fit">
              <TabsTrigger className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6" value="categories">الفئات</TabsTrigger>
              <TabsTrigger className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6" value="sections">الأقسام</TabsTrigger>
            </TabsList>
          )}
          
          {hasCategories && (
            <TabsContent value="categories" className="mt-0">
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-row-reverse">
                {categoriesWithAll.map((category, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={index}
                    onClick={() => onCategoryChange(category === "الكل" ? "" : category)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                      (category === "الكل" && !activeCategory) || activeCategory === category
                        ? 'bg-primary text-white shadow-md font-medium'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </TabsContent>
          )}
          
          {hasSections && (
            <TabsContent value="sections" className="mt-0">
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-row-reverse">
                {sections.map((section, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={index}
                    onClick={() => onSectionChange(section)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                      activeSection === section
                        ? 'bg-primary text-white shadow-md font-medium'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {section}
                  </motion.button>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;
