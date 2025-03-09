
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Power, PowerOff, Loader2, Package } from "lucide-react";
import { Product, RawProductData } from "@/utils/products/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { ProductPrice } from "./item/ProductPrice";

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
      
      // Map the raw data to the Product type using the existing mapper function
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
    // يمكن إضافة تنقل إلى صفحة التعديل هنا
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
        <DialogContent className="sm:max-w-xs" dir="rtl">
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (error || !product) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xs" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-red-500">حدث خطأ</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p>حدث خطأ أثناء تحميل بيانات المنتج.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xs p-4" dir="rtl">
          <div className="flex flex-col items-center space-y-3">
            {/* صورة المنتج */}
            <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                  <Package className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </div>
            
            {/* اسم المنتج */}
            <h2 className="text-lg font-bold text-center">{product.name}</h2>
            
            {/* سعر المنتج */}
            <ProductPrice 
              price={product.price} 
              discountPrice={product.discount_price} 
              size="md"
              className="mb-1"
            />
            
            {/* أزرار الإجراءات */}
            <div className="w-full grid gap-2 grid-cols-1 mt-2">
              <Button
                onClick={handleEditProduct}
                className="w-full flex justify-center items-center"
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 ml-2" />
                <span>تعديل</span>
              </Button>
              
              <Button
                onClick={handleToggleActive}
                className={`w-full flex justify-center items-center ${product.is_active 
                  ? "text-amber-600 border-amber-200 bg-amber-50 hover:text-amber-700 hover:bg-amber-100" 
                  : "text-green-600 border-green-200 bg-green-50 hover:text-green-700 hover:bg-green-100"}`}
                variant="outline"
                size="sm"
                disabled={toggleActiveMutation.isPending}
              >
                {toggleActiveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : product.is_active ? (
                  <PowerOff className="h-4 w-4 ml-2" />
                ) : (
                  <Power className="h-4 w-4 ml-2" />
                )}
                <span>{product.is_active ? "تعطيل" : "تفعيل"}</span>
              </Button>
              
              <Button
                onClick={handleDeleteProduct}
                className="w-full flex justify-center items-center bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
                variant="outline"
                size="sm"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4 ml-2" />
                )}
                <span>حذف</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* حوار تأكيد الحذف */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse sm:justify-start">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف المنتج"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetailDialog;
