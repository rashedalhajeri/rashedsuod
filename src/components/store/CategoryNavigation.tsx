
import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryItemSkeleton from "./category/CategoryItemSkeleton";
import CategoryItem from "./category/CategoryItem";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { supabase } from "@/integrations/supabase/client";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
  storeDomain?: string;
}

interface CategoryWithImage {
  name: string;
  image_url?: string | null;
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
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImage[]>([]);
  const [showCategoryImages, setShowCategoryImages] = useState<boolean>(true);
  const hasSections = sections.length > 0;

  // Fetch store data including categories with images
  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      if (!storeDomain) return;

      try {
        // First get the store ID based on domain
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('domain_name', storeDomain)
          .maybeSingle();
          
        if (storeError || !storeData) {
          console.error("Error fetching store:", storeError);
          return;
        }
        
        // Then get categories for that store
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('name, image_url')
          .eq('store_id', storeData.id)
          .order('sort_order', { ascending: true });
          
        if (catError) {
          console.error("Error fetching categories:", catError);
          return;
        }
        
        // Finally get store theme settings to check if category images are enabled
        const { data: themeSettings, error: themeError } = await supabase
          .from('store_theme_settings')
          .select('show_category_images')
          .eq('store_id', storeData.id)
          .maybeSingle();
          
        if (themeError) {
          console.error("Error fetching theme settings:", themeError);
          return;
        }

        setCategoriesWithImages(categories || []);
        setShowCategoryImages(themeSettings?.show_category_images ?? true);
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };

    fetchCategoriesWithImages();
  }, [storeDomain]);

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

  // Find image for a category
  const getCategoryImage = (categoryName: string): string | undefined => {
    if (categoryName === "الكل") {
      return "/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png";
    }
    
    const category = categoriesWithImages.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    return category?.image_url || undefined;
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
                imagePath={getCategoryImage(category)}
                showImage={showCategoryImages}
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
