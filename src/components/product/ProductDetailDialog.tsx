
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Power, PowerOff, Loader2 } from "lucide-react";
import { Product, RawProductData } from "@/utils/products/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapRawProductToProduct } from "@/utils/products/mappers";

interface ProductDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
  storeData: any;
  onSuccess?: () => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  productId,
  storeData,
  onSuccess,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", productId)
        .single();
      
      if (error) throw error;
      
      return mapRawProductToProduct(data as RawProductData);
    },
    enabled: isOpen && !!productId,
  });
  
  // Toggle product active status
  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!productId) return;
      
      const { data, error } = await supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", productId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(product?.is_active ? "تم تعطيل المنتج" : "تم تفعيل المنتج");
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error("حدث خطأ: " + error.message);
    },
  });
  
  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!productId) return;
      
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("تم حذف المنتج بنجاح");
      setShowDeleteAlert(false);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء حذف المنتج: " + error.message);
    },
  });
  
  const handleEditProduct = () => {
    onOpenChange(false);
    // router.push(`/dashboard/products/edit/${productId}`);
  };
  
  const handleToggleActive = () => {
    if (product) {
      toggleActiveMutation.mutate(!product.is_active);
    }
  };
  
  const handleDeleteProduct = () => {
    setShowDeleteAlert(true);
  };
  
  const confirmDelete = () => {
    deleteMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[300px] p-0" dir="rtl">
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (error || !product) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[300px] p-0" dir="rtl">
          <div className="text-center p-4">
            <p className="text-red-500 text-sm">حدث خطأ أثناء تحميل بيانات المنتج.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden" dir="rtl">
          {/* اسم المنتج */}
          <div className="p-4 text-center border-b border-gray-100 bg-gray-50">
            <h3 className="text-base font-medium">{product.name}</h3>
          </div>
          
          {/* أزرار الإجراءات */}
          <div className="grid grid-cols-3 border-t border-gray-100">
            <Button
              onClick={handleEditProduct}
              variant="ghost"
              className="h-16 rounded-none border-r border-gray-100 flex flex-col items-center justify-center"
            >
              <Edit className="h-5 w-5 mb-1" />
              <span className="text-xs">تعديل</span>
            </Button>
            
            <Button
              onClick={handleToggleActive}
              variant="ghost"
              className={`h-16 rounded-none border-r border-gray-100 flex flex-col items-center justify-center ${
                product.is_active 
                  ? "text-amber-600" 
                  : "text-green-600"
              }`}
              disabled={toggleActiveMutation.isPending}
            >
              {toggleActiveMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
              ) : product.is_active ? (
                <PowerOff className="h-5 w-5 mb-1" />
              ) : (
                <Power className="h-5 w-5 mb-1" />
              )}
              <span className="text-xs">{product.is_active ? "تعطيل" : "تفعيل"}</span>
            </Button>
            
            <Button
              onClick={handleDeleteProduct}
              variant="ghost"
              className="h-16 rounded-none text-red-600 flex flex-col items-center justify-center"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
              ) : (
                <Trash className="h-5 w-5 mb-1" />
              )}
              <span className="text-xs">حذف</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* حوار تأكيد الحذف */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent dir="rtl" className="max-w-[250px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              هل أنت متأكد من حذف هذا المنتج؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse sm:justify-start gap-2">
            <AlertDialogCancel className="mt-0 text-sm h-8">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-sm h-8"
            >
              {deleteMutation.isPending ? "جاري..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetailDialog;
