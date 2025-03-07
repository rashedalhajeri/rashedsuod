
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags, Plus, LayoutGrid, Search } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CategorySearchBox from "@/components/category/CategorySearchBox";
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";
import SectionList from "@/components/section/SectionList";
import SectionForm from "@/components/section/SectionForm";
import { useCategories } from "@/hooks/use-categories";
import { useSections } from "@/hooks/use-sections";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CategoriesAndSections: React.FC = () => {
  // Categories state
  const {
    categories,
    loading: categoriesLoading,
    newCategory,
    setNewCategory,
    editingCategory,
    setEditingCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useCategories();
  
  // Sections state
  const {
    sections,
    loading: sectionsLoading,
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
    handleDeleteSection
  } = useSections();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);

  const openAddSectionDialog = () => {
    setIsAddSectionDialogOpen(true);
  };

  const closeAddSectionDialog = () => {
    setIsAddSectionDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              الفئات والأقسام
            </span>
          </motion.h1>
        </div>
        
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2">
                <div className="mb-4">
                  <CategorySearchBox 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
                
                <Card className="border-gray-200 bg-white">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Tags className="h-4 w-4 text-primary" />
                      قائمة الفئات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-6">
                    <CategoryList
                      categories={categories}
                      loading={categoriesLoading}
                      searchQuery={searchQuery}
                      editingCategory={editingCategory}
                      setEditingCategory={setEditingCategory}
                      handleUpdateCategory={handleUpdateCategory}
                      handleDeleteCategory={handleDeleteCategory}
                      setNewCategory={setNewCategory}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <CategoryForm
                  newCategory={newCategory}
                  setNewCategory={setNewCategory}
                  handleAddCategory={handleAddCategory}
                />
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="sections" className="outline-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-3">
                <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                  <div className="w-full md:w-1/2">
                    <CategorySearchBox 
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </div>
                  <Button
                    onClick={openAddSectionDialog}
                    className="md:w-auto w-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة قسم جديد</span>
                  </Button>
                </div>
                
                <Card className="border-gray-200 bg-white">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      قائمة الأقسام
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-6">
                    <SectionList
                      sections={sections}
                      loading={sectionsLoading}
                      searchQuery={searchQuery}
                      editingSection={editingSection}
                      setEditingSection={setEditingSection}
                      handleUpdateSection={handleUpdateSection}
                      handleDeleteSection={handleDeleteSection}
                      setNewSection={setNewSection}
                      setNewSectionType={setNewSectionType}
                      openAddDialog={openAddSectionDialog}
                    />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            <SectionForm
              isOpen={isAddSectionDialogOpen}
              onClose={closeAddSectionDialog}
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
              handleAddSection={handleAddSection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesAndSections;
