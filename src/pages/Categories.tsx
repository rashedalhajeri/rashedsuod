
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, FileDown, FileUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryList from "@/components/category/CategoryList";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import CategoryForm from "@/components/category/CategoryForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Category } from "@/types/category";

// النمط الافتراضي للتصنيف الجديد
const defaultCategory: Category = {
  id: "",
  name: "",
  description: "",
  slug: "",
  image: null,
  parent_id: null,
  display_order: 0,
  product_count: 0,
  is_active: true,
  created_at: new Date().toISOString(),
};

// بيانات وهمية للتصنيفات
const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "الإلكترونيات",
    description: "أجهزة إلكترونية وملحقاتها",
    slug: "electronics",
    parent_id: null,
    product_count: 42,
    display_order: 1,
    is_active: true,
    created_at: "2023-01-15T10:30:00Z",
  },
  {
    id: "cat-2",
    name: "الملابس",
    description: "ملابس رجالية ونسائية",
    slug: "clothing",
    parent_id: null,
    product_count: 64,
    display_order: 2,
    is_active: true,
    created_at: "2023-01-17T09:15:00Z",
  },
  {
    id: "cat-3",
    name: "الأجهزة المنزلية",
    description: "أجهزة للمنزل والمطبخ",
    slug: "home-appliances",
    parent_id: null,
    product_count: 28,
    display_order: 3,
    is_active: true,
    created_at: "2023-01-20T14:45:00Z",
  },
  {
    id: "cat-4",
    name: "الهواتف الذكية",
    description: "هواتف ذكية وملحقاتها",
    slug: "smartphones",
    parent_id: "cat-1",
    product_count: 16,
    display_order: 1,
    is_active: true,
    created_at: "2023-01-22T11:20:00Z",
  },
  {
    id: "cat-5",
    name: "أجهزة الكمبيوتر",
    description: "أجهزة الكمبيوتر المحمولة والمكتبية",
    slug: "computers",
    parent_id: "cat-1",
    product_count: 12,
    display_order: 2,
    is_active: true,
    created_at: "2023-01-25T16:30:00Z",
  }
];

const Categories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  // تصفية التصنيفات بناءً على البحث
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // إضافة تصنيف جديد
  const handleAddCategory = (category: Category) => {
    const newCategory = {
      ...category,
      id: `cat-${categories.length + 1}`,
      created_at: new Date().toISOString(),
      product_count: 0,
    };
    
    setCategories([...categories, newCategory]);
    setIsDialogOpen(false);
    toast.success("تم إضافة التصنيف بنجاح");
  };

  // تعديل تصنيف
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  // حذف تصنيف
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("تم حذف التصنيف بنجاح");
  };

  // تحديث تصنيف
  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setIsDialogOpen(false);
    setEditingCategory(null);
    toast.success("تم تحديث التصنيف بنجاح");
  };

  // مشاهدة منتجات تصنيف معين
  const handleViewProducts = (categoryId: string) => {
    toast.info(`عرض منتجات التصنيف: ${categories.find(c => c.id === categoryId)?.name}`);
    // في التطبيق الحقيقي يمكن التوجه لصفحة المنتجات مع فلتر التصنيف
    // navigate(`/dashboard/products?category=${categoryId}`);
  };

  // مسح نموذج التحرير
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التصنيفات</h2>
          <p className="text-muted-foreground">
            إدارة تصنيفات متجرك وترتيبها
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("تصدير التصنيفات قريبًا")}>
            <FileDown className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button variant="outline" onClick={() => toast.info("استيراد التصنيفات قريبًا")}>
            <FileUp className="h-4 w-4 ml-2" />
            استيراد
          </Button>
          <Button onClick={() => {
            setEditingCategory(defaultCategory);
            setIsDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة تصنيف
          </Button>
        </div>
      </div>

      {/* بطاقة التصنيفات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>قائمة التصنيفات</CardTitle>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن تصنيف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-9"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredCategories.length === 0 ? (
              <CategoryEmptyState onAdd={() => {
                setEditingCategory(defaultCategory);
                setIsDialogOpen(true);
              }} />
            ) : (
              <CategoryList
                categories={filteredCategories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onViewProducts={handleViewProducts}
                currencyCode="ر.س"
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* نافذة إضافة/تعديل التصنيف */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>
            {editingCategory?.id && editingCategory.id !== "" ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </DialogTitle>
          <CategoryForm
            initialData={editingCategory || defaultCategory}
            categories={categories.filter(cat => !cat.parent_id && (editingCategory?.id !== cat.id))}
            onSubmit={editingCategory?.id && editingCategory.id !== "" ? handleUpdateCategory : handleAddCategory}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
