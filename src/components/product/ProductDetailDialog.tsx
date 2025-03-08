
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Power, PowerOff, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";
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
        <DialogContent className="sm:max-w-md" dir="rtl">
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2">جاري تحميل بيانات المنتج...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (error || !product) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-red-500">خطأ في تحميل المنتج</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p>حدث خطأ أثناء تحميل بيانات المنتج. الرجاء المحاولة مرة أخرى.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>تفاصيل المنتج</DialogTitle>
              {product.is_active ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">نشط</Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">غير نشط</Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* صورة المنتج والمعلومات الأساسية */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
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
                    <span className="text-gray-400 text-xs">لا توجد صورة</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <div className="flex items-center mt-1">
                  {product.discount_price ? (
                    <>
                      <span className="text-red-600 font-bold">{formatCurrency(product.discount_price)}</span>
                      <span className="text-gray-400 text-sm line-through mr-2">{formatCurrency(product.price)}</span>
                    </>
                  ) : (
                    <span className="font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* المعلومات الإضافية */}
            <div className="text-sm space-y-2">
              {product.description && (
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">التصنيف:</span>
                  <span className="font-medium mr-1">{product.category?.name || "غير مصنف"}</span>
                </div>
                
                <div>
                  <span className="text-gray-500">المخزون:</span>
                  <span className="font-medium mr-1">
                    {product.track_inventory 
                      ? `${product.stock_quantity || 0} قطعة` 
                      : "غير محدود"}
                  </span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* أزرار الإجراءات */}
            <div className="space-y-2">
              <Button
                onClick={handleEditProduct}
                className="w-full"
                variant="outline"
              >
                <Edit className="h-4 w-4 ml-2" />
                تعديل المنتج
              </Button>
              
              <Button
                onClick={handleToggleActive}
                className="w-full"
                variant="outline"
                disabled={toggleActiveMutation.isPending}
              >
                {toggleActiveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : product.is_active ? (
                  <PowerOff className="h-4 w-4 ml-2" />
                ) : (
                  <Power className="h-4 w-4 ml-2" />
                )}
                {product.is_active ? "تعطيل المنتج" : "تفعيل المنتج"}
              </Button>
              
              <Button
                onClick={handleDeleteProduct}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
                variant="outline"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4 ml-2" />
                )}
                حذف المنتج
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
