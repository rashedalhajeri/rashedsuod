
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CategorySearchBox from "@/components/category/CategorySearchBox";
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";
import SectionList from "@/components/section/SectionList";
import SectionForm from "@/components/section/SectionForm";
import { useCategories } from "@/hooks/use-categories";
import { useSections } from "@/hooks/use-sections";

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
    editingSection,
    setEditingSection,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection
  } = useSections();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">الفئات والأقسام</h1>
        </div>
        
        <Tabs defaultValue="categories" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="categories" className="flex-1 md:flex-none">الفئات</TabsTrigger>
            <TabsTrigger value="sections" className="flex-1 md:flex-none">الأقسام</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <CategorySearchBox 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      <Tags className="h-4 w-4 inline-block ml-2" />
                      قائمة الفئات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
            </div>
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <CategorySearchBox 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      <Tags className="h-4 w-4 inline-block ml-2" />
                      قائمة الأقسام
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <SectionForm
                  newSection={newSection}
                  setNewSection={setNewSection}
                  newSectionType={newSectionType}
                  setNewSectionType={setNewSectionType}
                  handleAddSection={handleAddSection}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesAndSections;
