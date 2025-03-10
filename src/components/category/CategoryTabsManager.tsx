import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Categories related imports
import CategoriesHeader from "./CategoriesHeader";
import CategoriesContent from "./CategoriesContent";
import CategoryDialog from "./CategoryDialog";

// Sections related imports
import SectionsHeader from "../section/SectionsHeader";
import SectionsContent from "../section/SectionsContent";
import SectionForm from "../section/SectionForm";

// Types and hooks
import { Section } from "@/services/section-service";
import { Category } from "@/services/category-service";

interface CategoryTabsManagerProps {
  // Categories props
  categories: Category[];
  categoriesLoading: boolean;
  storeId: string | null;
  newCategory: string;
  setNewCategory: (name: string) => void;
  categoryImage: string | null;
  setCategoryImage: (image: string | null) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  showCategoryImages: boolean;
  handleAddCategory: () => Promise<void>;
  handleUpdateCategory: () => void;
  handleDeleteCategory: (id: string) => void;
  handleToggleShowCategoryImages: (show: boolean) => Promise<boolean>;
  
  // Sections props
  sections: Section[];
  sectionsLoading: boolean;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  newCategoryId: string | null;
  setNewCategoryId: (id: string | null) => void;
  newProductIds: string[] | null;
  setNewProductIds: (ids: string[] | null) => void;
  newDisplayStyle: 'grid' | 'list' | undefined;
  setNewDisplayStyle: (style: 'grid' | 'list') => void;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleAddSection: () => Promise<void>;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => void;
  handleReorderSections: (reorderedSections: Section[]) => void;

  // New props
  isSubmitting?: boolean;
  error?: string | null;
}

const CategoryTabsManager: React.FC<CategoryTabsManagerProps> = ({
  // Categories props
  categories,
  categoriesLoading,
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
  handleToggleShowCategoryImages,
  
  // Sections props
  sections,
  sectionsLoading,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  newCategoryId,
  setNewCategoryId,
  newProductIds,
  setNewProductIds,
  newDisplayStyle,
  setNewDisplayStyle,
  editingSection,
  setEditingSection,
  handleAddSection,
  handleUpdateSection,
  handleDeleteSection,
  handleReorderSections,

  // New props
  isSubmitting = false,
  error = null
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle category image toggle
  const toggleCategoryImages = async () => {
    try {
      await handleToggleShowCategoryImages(!showCategoryImages);
      // Close dialog after toggle
      setConfirmDialogOpen(false);
    } catch (error) {
      // Close dialog on error
      setConfirmDialogOpen(false);
    }
  };

  // Reset category dialog state
  const handleCloseCategoryDialog = () => {
    setIsAddCategoryDialogOpen(false);
    setNewCategory("");
    setCategoryImage(null);
  };

  // Reset section dialog state
  const handleCloseSectionDialog = () => {
    setIsAddSectionDialogOpen(false);
    setNewSection("");
    setNewSectionType("best_selling");
    setNewCategoryId(null);
    setNewProductIds(null);
    setNewDisplayStyle('grid');
  };

  // Type-safe wrapper for setEditingSection
  const handleSetEditingSection = (section: Section | null) => {
    setEditingSection(section);
  };

  return (
    <>
      <Tabs defaultValue="categories" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6 w-full max-w-md bg-background border">
          <TabsTrigger value="categories" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Tags className="h-4 w-4 mr-2" />
            الفئات
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
            <LayoutGrid className="h-4 w-4 mr-2" />
            الأقسام
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="outline-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CategoriesHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showCategoryImages={showCategoryImages}
              onAddCategory={() => setIsAddCategoryDialogOpen(true)}
              onToggleImages={() => setConfirmDialogOpen(true)}
            />
            
            <CategoriesContent 
              categories={categories}
              loading={categoriesLoading}
              searchQuery={searchQuery}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              handleUpdateCategory={handleUpdateCategory}
              handleDeleteCategory={handleDeleteCategory}
              setNewCategory={setNewCategory}
              openAddDialog={() => setIsAddCategoryDialogOpen(true)}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="sections" className="outline-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionsHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddSection={() => setIsAddSectionDialogOpen(true)}
            />
            
            <SectionsContent 
              sections={sections}
              loading={sectionsLoading}
              searchQuery={searchQuery}
              editingSection={editingSection}
              setEditingSection={handleSetEditingSection}
              handleUpdateSection={handleUpdateSection}
              handleDeleteSection={handleDeleteSection}
              setNewSection={setNewSection}
              setNewSectionType={setNewSectionType}
              openAddDialog={() => setIsAddSectionDialogOpen(true)}
              handleReorderSections={handleReorderSections}
            />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Category dialog */}
      <CategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onClose={handleCloseCategoryDialog}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        categoryImage={categoryImage}
        setCategoryImage={setCategoryImage}
        handleAddCategory={handleAddCategory}
        storeId={storeId || undefined}
        showCategoryImages={showCategoryImages}
      />

      {/* Section form dialog */}
      <SectionForm
        isOpen={isAddSectionDialogOpen}
        onClose={handleCloseSectionDialog}
        newSection={newSection}
        setNewSection={setNewSection}
        newSectionType={newSectionType}
        setNewSectionType={setNewSectionType}
        newCategoryId={newCategoryId}
        setNewCategoryId={setNewCategoryId}
        newProductIds={newProductIds}
        setNewProductIds={setNewProductIds}
        newDisplayStyle={newDisplayStyle}
        setNewDisplayStyle={setNewDisplayStyle}
        isSubmitting={isSubmitting}
        error={error}
        handleAddSection={handleAddSection}
      />

      {/* Confirm dialog for toggling images */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={showCategoryImages ? "إيقاف عرض صور الفئات" : "تفعيل عرض صور الفئات"}
        description={showCategoryImages 
          ? "هل أنت متأكد من إيقاف عرض صور الفئات؟ سيتم عرض الفئات بالاسم فقط في المتجر."
          : "هل أنت متأكد من تفعيل عرض صور الفئات؟ ستحتاج إلى إضافة صور للفئات لعرضها في المتجر."
        }
        confirmText={showCategoryImages ? "إيقاف" : "تفعيل"}
        cancelText="إلغاء"
        onConfirm={toggleCategoryImages}
        confirmButtonProps={{
          variant: showCategoryImages ? "destructive" : "default"
        }}
      />
    </>
  );
};

export default CategoryTabsManager;
