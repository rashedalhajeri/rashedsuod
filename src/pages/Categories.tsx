
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, FolderTree, ArrowUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuery } from "@tanstack/react-query";
import { useStoreData, useCategories } from "@/hooks/use-store-data"; 
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import { Category, CategoryFormData } from "@/types/category";
import LoadingState from "@/components/ui/loading-state";

const Categories: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterView, setFilterView] = useState<"all" | "active" | "inactive">("all");
  const [filterParent, setFilterParent] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"name" | "created_at" | "display_order">("display_order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Get store data
  const { data: storeData, isLoading: storeLoading, isError: storeError } = useStoreData();
  
  // Get categories using the storeId
  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    isError: categoriesError,
    refetch: refetchCategories 
  } = useCategories(storeData?.id);
  
  // Helper function to get selected category
  const getSelectedCategory = () => {
    if (!selectedCategoryId || !categories) return null;
    return categories.find(cat => cat.id === selectedCategoryId) || null;
  };
  
  // Handle add category
  const handleAddCategory = async (formData: CategoryFormData): Promise<void> => {
    // This will be connected to the backend in a real implementation
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "تم إنشاء التصنيف",
          description: `تم إنشاء التصنيف "${formData.name}" بنجاح`,
        });
        setIsCreateDialogOpen(false);
        refetchCategories();
        resolve();
      }, 500);
    });
  };
  
  // Handle update category
  const handleUpdateCategory = async (formData: CategoryFormData): Promise<void> => {
    const category = getSelectedCategory();
    if (!category) return Promise.reject(new Error("لم يتم العثور على التصنيف"));
    
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "تم تحديث التصنيف",
          description: `تم تحديث التصنيف "${formData.name}" بنجاح`,
        });
        setIsEditSheetOpen(false);
        refetchCategories();
        resolve();
      }, 500);
    });
  };
  
  // Handle delete category
  const handleDeleteCategory = async (categoryId: string) => {
    // This will be connected to the backend in a real implementation
    // Simulate API call
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
    setSelectedCategoryId(null);
    refetchCategories();
  };
  
  // Toggle category active status
  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    // This will be connected to the backend in a real implementation
    // Simulate API call
    toast({
      title: isActive ? "تم تفعيل التصنيف" : "تم تعطيل التصنيف",
      description: isActive 
        ? "تم تفعيل التصنيف بنجاح" 
        : "تم تعطيل التصنيف بنجاح",
    });
    refetchCategories();
  };
  
  // Filter and sort categories
  const getFilteredCategories = () => {
    if (!categories) return [];
    
    return categories
      .filter(category => {
        const matchesSearch = searchQuery 
          ? category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        const matchesStatus = filterView === "all" 
          ? true 
          : filterView === "active" 
            ? category.is_active 
            : !category.is_active;
        
        const matchesParent = filterParent === null 
          ? true 
          : filterParent === "root" 
            ? !category.parent_id 
            : category.parent_id === filterParent;
            
        return matchesSearch && matchesStatus && matchesParent;
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortField === "created_at") {
          return sortDirection === "asc" 
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          return sortDirection === "asc" 
            ? a.display_order - b.display_order 
            : b.display_order - a.display_order;
        }
      });
  };
  
  // Get parent categories for filter
  const getParentCategories = () => {
    if (!categories) return [];
    return categories.filter(cat => !cat.parent_id);
  };
  
  // Handle change sort
  const handleSortChange = (field: "name" | "created_at" | "display_order") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Loading state
  if (storeLoading || categoriesLoading) {
    return <LoadingState message="جاري تحميل التصنيفات..." />;
  }
  
  // Error state
  if (storeError || categoriesError) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            حدث خطأ أثناء تحميل البيانات
          </h2>
          <p className="text-gray-600 mb-4">
            يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم الفني.
          </p>
          <Button onClick={() => refetchCategories()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }
  
  const filteredCategories = getFilteredCategories();
  const selectedCategory = getSelectedCategory();
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التصنيفات</h1>
          <p className="text-muted-foreground">
            إدارة تصنيفات منتجات متجرك
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تصنيف
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إضافة تصنيف جديد</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              categories={categories || []} 
              onSubmit={handleAddCategory}
              submitText="إضافة التصنيف"
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Categories List Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>قائمة التصنيفات</CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن تصنيف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">الحالة</h4>
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filterView === "all"}
                          onChange={() => setFilterView("all")}
                          className="h-4 w-4"
                        />
                        الكل
                      </Label>
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filterView === "active"}
                          onChange={() => setFilterView("active")}
                          className="h-4 w-4"
                        />
                        نشط
                      </Label>
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filterView === "inactive"}
                          onChange={() => setFilterView("inactive")}
                          className="h-4 w-4"
                        />
                        غير نشط
                      </Label>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">التصنيف الرئيسي</h4>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filterParent === null}
                          onChange={() => setFilterParent(null)}
                          className="h-4 w-4"
                        />
                        الكل
                      </Label>
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filterParent === "root"}
                          onChange={() => setFilterParent("root")}
                          className="h-4 w-4"
                        />
                        تصنيفات رئيسية فقط
                      </Label>
                      {getParentCategories().map((category) => (
                        <Label key={category.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={filterParent === category.id}
                            onChange={() => setFilterParent(category.id)}
                            className="h-4 w-4"
                          />
                          {category.name}
                        </Label>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSortChange("name")}>
                    <div className="flex items-center justify-between w-full">
                      اسم التصنيف
                      {sortField === "name" && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("display_order")}>
                    <div className="flex items-center justify-between w-full">
                      ترتيب العرض
                      {sortField === "display_order" && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("created_at")}>
                    <div className="flex items-center justify-between w-full">
                      تاريخ الإنشاء
                      {sortField === "created_at" && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                    <div className="flex items-center justify-between w-full">
                      {sortDirection === "asc" ? "تصاعدي" : "تنازلي"}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Display empty state if no categories */}
          {!filteredCategories.length ? (
            <CategoryEmptyState onCreateCategory={() => setIsCreateDialogOpen(true)} />
          ) : (
            <CategoryList 
              categories={filteredCategories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onDelete={handleDeleteCategory}
              onStatusToggle={toggleCategoryStatus}
              onEdit={() => setIsEditSheetOpen(true)}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Edit Sheet (Responsive for mobile) */}
      <Sheet open={isEditSheetOpen && !!selectedCategory} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side={isMobile ? "bottom" : "left"} className={isMobile ? "h-[85%]" : ""}>
          <SheetHeader className="text-right">
            <SheetTitle>تعديل التصنيف</SheetTitle>
          </SheetHeader>
          {selectedCategory && (
            <ScrollArea className="mt-4 h-[calc(100%-4rem)]">
              <CategoryForm 
                categories={categories || []} 
                onSubmit={handleUpdateCategory}
                submitText="حفظ التغييرات"
                initialData={selectedCategory}
                showDelete
                onDelete={() => {
                  handleDeleteCategory(selectedCategory.id);
                  setIsEditSheetOpen(false);
                }}
              />
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Categories;
