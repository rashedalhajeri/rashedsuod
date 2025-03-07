
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryItemSkeleton from "./category/CategoryItemSkeleton";
import CategoryItem from "./category/CategoryItem";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
  storeDomain?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = memo(({
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange,
  sections,
  storeDomain
}) => {
  const navigate = useNavigate();
  const { displayCategories, isLoading, hasCategories } = useCategoryNavigation(storeDomain);
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Handle category click with navigation to category page
  const handleCategoryClick = (category: string) => {
    if (!storeDomain) return;
    
    // Always navigate to category page, even for "All"
    if (category === "الكل") {
      navigate(`/store/${storeDomain}/category/الكل`);
    } else {
      // For other categories, navigate to category page
      const categorySlug = encodeURIComponent(category.toLowerCase());
      navigate(`/store/${storeDomain}/category/${categorySlug}`);
    }
    
    // Call the provided category change handler
    onCategoryChange(category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-2 z-10 transition-all duration-300"
      dir="rtl"
    >
      <div className="grid grid-cols-5 gap-1.5 mx-auto">
        {isLoading ? (
          // Placeholder for loading state using CategorySkeleton
          [...Array(5)].map((_, index) => (
            <CategoryItemSkeleton key={`category-skeleton-${index}`} index={index} />
          ))
        ) : (
          displayCategories.map((category, index) => {
            const isActive = (category === "الكل" && activeCategory === "الكل") || 
                          (category.toLowerCase() === activeCategory.toLowerCase());
            
            return (
              <CategoryItem
                key={`category-${index}`}
                category={category}
                isActive={isActive}
                index={index}
                onClick={() => handleCategoryClick(category)}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;
