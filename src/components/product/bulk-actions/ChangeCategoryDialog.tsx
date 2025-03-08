
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { databaseClient } from "@/integrations/database/client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open && storeId) {
      fetchCategories();
    }
  }, [open, storeId]);
  
  const fetchCategories = async () => {
    if (!storeId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("store_id", storeId)
        .order("name");
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("خطأ في تحميل الفئات");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryChange = async () => {
    if (!storeId || selectedProducts.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { success, error } = await databaseClient.products.bulkUpdateCategory(
        selectedProducts,
        selectedCategory
      );
      
      if (!success) {
        throw error || new Error("فشل تحديث الفئة");
      }
      
      toast.success(`تم تحديث الفئة لـ ${selectedProducts.length} منتج`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("خطأ في تحديث الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تغيير الفئة للمنتجات</DialogTitle>
          <DialogDescription>
            اختر الفئة التي تريد نقل {selectedProducts.length} منتج إليها
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">الفئة</Label>
            <Select 
              value={selectedCategory || "none"} 
              onValueChange={setSelectedCategory}
              disabled={isLoading}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="اختر فئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون فئة</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleCategoryChange}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التحديث...
              </>
            ) : (
              "تغيير الفئة"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeCategoryDialog;
