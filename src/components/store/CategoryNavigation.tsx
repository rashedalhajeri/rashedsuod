
import React, { useState, useEffect, useCallback, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreFilter } from "@/context/StoreFilterContext";

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

  // الاستماع إلى التمرير لجعل شريط التنقل ثابتًا عند التمرير
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

  return (
    <div className={`bg-white py-4 z-10 transition-all duration-300 ${
      stickyNav ? 'sticky top-0 shadow-md' : ''
    }`}>
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4">الفئات والأقسام</h2>
        
        <Tabs 
          defaultValue="categories"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "categories" | "sections")}
          className="w-full"
        >
          <TabsList className="mb-4 bg-gray-100">
            <TabsTrigger value="categories">الفئات</TabsTrigger>
            <TabsTrigger value="sections">الأقسام</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      activeCategory === category
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))
              ) : (
                <div className="text-gray-500">لا توجد فئات</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => onSectionChange(section)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      activeSection === section
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {section}
                  </button>
                ))
              ) : (
                <div className="text-gray-500">لا توجد أقسام</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;
