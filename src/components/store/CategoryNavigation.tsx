
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
  categories,
  sections,
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange,
  storeDomain
}) => {
  const navigate = useNavigate();
  
  // Filter out empty arrays
  const hasCategories = categories.length > 0;
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Prepare categories with "All" option at the beginning
  const categoriesWithAll = ["الكل", ...categories];
  
  // Category images with the uploaded image and placeholders
  const categoryImages = [
    "/public/lovable-uploads/76b54a01-0b01-4389-87c4-99406ba4e5ca.png", // الكل
    "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png", // Clinics
    "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg", // Electronics
  ];

  // Handle category click
  const handleCategoryClick = (category: string, index: number) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      navigate(`/store/${storeDomain}`);
    } else {
      navigate(`/store/${storeDomain}/category/${encodeURIComponent(category.toLowerCase())}`);
    }
  };

  return (
    <div className="bg-white py-4 z-10 transition-all duration-300 mb-4" dir="rtl">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-3 gap-4">
          {categoriesWithAll.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={index}
              className="flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => handleCategoryClick(category, index)}
                className={`w-full h-full flex flex-col items-center p-3 ${
                  (category === "الكل" && !activeCategory) || activeCategory === category
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img 
                    src={index < categoryImages.length ? categoryImages[index] : "/placeholder.svg"} 
                    alt={category} 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
                <span className="text-sm whitespace-nowrap">
                  {category === "الكل" ? "الكل" : 
                   index === 1 ? "العيادات" : 
                   index === 2 ? "الإلكترونيات" : category}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;
