
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, Loader2 } from "lucide-react";

interface CategorySelectorProps {
  categoryId: string | null;
  storeId?: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryId,
  storeId,
  onCategoryChange
}) => {
  // استخدام useQuery لجلب الفئات من قاعدة البيانات
  const { 
    data: categories = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['categories', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Error fetching categories:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!storeId,
  });

  // إعادة محاولة جلب الفئات عند تغير storeId
  useEffect(() => {
    if (storeId) {
      refetch();
    }
  }, [storeId, refetch]);

  if (error) {
    console.error("Error loading categories:", error);
  }

  return (
    <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-medium">فئة المنتج</h3>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">اختر الفئة المناسبة للمنتج</Label>
        <Select 
          value={categoryId || "none"} 
          onValueChange={onCategoryChange}
          disabled={isLoading}
        >
          <SelectTrigger id="category" className="border-gray-200">
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون فئة</SelectItem>
            {categories.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>جاري تحميل الفئات...</span>
          </div>
        )}
        
        {error && (
          <p className="text-xs text-red-500">حدث خطأ أثناء تحميل الفئات</p>
        )}
        
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-xs text-gray-500">لا توجد فئات متاحة. يمكنك إضافة فئات جديدة من قسم الفئات</p>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
