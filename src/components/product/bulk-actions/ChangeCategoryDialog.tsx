
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ChangeCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: string[];
  storeId?: string;
  onSuccess: () => void;
}

const ChangeCategoryDialog: React.FC<ChangeCategoryDialogProps> = ({
  open,
  onOpenChange,
  selectedProducts,
  storeId,
  onSuccess
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open && storeId) {
      fetchCategories(storeId);
    }
  }, [open, storeId]);

  const fetchCategories = async (storeId: string) => {
    try {
      setIsFetchingCategories(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('store_id', storeId)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast("خطأ في تحميل الفئات", {
        description: "حدث خطأ أثناء تحميل الفئات، يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCategory) {
      toast("الرجاء اختيار فئة", {
        description: "يجب اختيار فئة لتغيير المنتجات المحددة."
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast("لا توجد منتجات محددة", {
        description: "الرجاء تحديد منتجات لتغيير فئتها."
      });
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: selectedCategory === "none" ? null : selectedCategory 
        })
        .in('id', selectedProducts);

      if (error) throw error;

      toast("تم تغيير الفئة بنجاح", {
        description: `تم تحديث فئة ${selectedProducts.length} منتج.`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast("خطأ في تحديث الفئة", {
        description: "حدث خطأ أثناء تحديث فئة المنتجات، يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="تغيير فئة المنتجات"
      description={
        <>
          <p className="mb-4">
            سيتم تغيير فئة {selectedProducts.length} منتج محدد إلى الفئة المختارة.
          </p>
          
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              اختر الفئة الجديدة:
            </label>
            
            {isFetchingCategories ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="mr-2 text-sm text-gray-500">جاري تحميل الفئات...</span>
              </div>
            ) : (
              <Select 
                value={selectedCategory || ""} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون فئة</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </>
      }
      confirmText={isLoading ? "جاري التحديث..." : "تغيير الفئة"}
      cancelText="إلغاء"
      onConfirm={handleConfirm}
      confirmButtonProps={{ 
        disabled: isLoading || !selectedCategory,
        className: "bg-blue-600 hover:bg-blue-700"
      }}
    />
  );
};

export default ChangeCategoryDialog;
