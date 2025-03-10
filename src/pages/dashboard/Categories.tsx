
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/use-categories";
import { useSections } from "@/hooks/use-sections";
import CategoryTabsManager from "@/components/category/CategoryTabsManager";
import { Section } from "@/services/section-service";

const CategoriesAndSections: React.FC = () => {
  // Categories state
  const {
    categories,
    loading: categoriesLoading,
    storeId,
    newCategory,
    setNewCategory,
    categoryImage,
    setCategoryImage,
    editingCategory,
    setEditingCategory,
    showCategoryImages,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleToggleShowCategoryImages
  } = useCategories();
  
  // Sections state
  const {
    sections,
    loading: sectionsLoading,
    newSection,
    setNewSection,
    newSectionType,
    setNewSectionType,
    newDisplayStyle,
    setNewDisplayStyle,
    editingSection,
    setEditingSection,
    isSubmitting,
    error,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleReorderSections
  } = useSections();

  // Type-safe wrapper for setEditingSection
  const handleSetEditingSection = (section: Section | null) => {
    setEditingSection(section);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            الفئات والأقسام
          </span>
        </motion.h1>
        
        <CategoryTabsManager
          // Categories props
          categories={categories}
          categoriesLoading={categoriesLoading}
          storeId={storeId}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categoryImage={categoryImage}
          setCategoryImage={setCategoryImage}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          showCategoryImages={showCategoryImages}
          handleAddCategory={handleAddCategory}
          handleUpdateCategory={handleUpdateCategory}
          handleDeleteCategory={handleDeleteCategory}
          handleToggleShowCategoryImages={handleToggleShowCategoryImages}
          
          // Sections props
          sections={sections}
          sectionsLoading={sectionsLoading}
          newSection={newSection}
          setNewSection={setNewSection}
          newSectionType={newSectionType}
          setNewSectionType={setNewSectionType}
          newDisplayStyle={newDisplayStyle}
          setNewDisplayStyle={(style: 'grid' | 'list') => setNewDisplayStyle(style)}
          editingSection={editingSection}
          setEditingSection={handleSetEditingSection}
          handleAddSection={handleAddSection}
          handleUpdateSection={handleUpdateSection}
          handleDeleteSection={handleDeleteSection}
          handleReorderSections={handleReorderSections}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </DashboardLayout>
  );
};

export default CategoriesAndSections;
