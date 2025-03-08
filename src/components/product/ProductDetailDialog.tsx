
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Power, PowerOff, X, Loader2, Info, Package, Calendar, Tag } from "lucide-react";
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
        <DialogContent className="sm:max-w-md md:max-w-lg" dir="rtl">
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">تفاصيل المنتج</DialogTitle>
              {product.is_active ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 py-1 px-3">نشط</Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 py-1 px-3">غير نشط</Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* صورة المنتج والمعلومات الأساسية */}
            <div className="flex gap-5">
              <div className="h-28 w-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
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
                    <Package className="h-10 w-10 text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {product.discount_price ? (
                    <>
                      <span className="text-red-600 text-lg font-bold">{formatCurrency(product.discount_price)}</span>
                      <span className="text-gray-400 text-sm line-through">{formatCurrency(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                
                {product.category && (
                  <div className="mt-2 flex items-center">
                    <Tag className="h-4 w-4 text-gray-500 ml-1" />
                    <span className="text-sm text-gray-600">{product.category.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* المعلومات الإضافية */}
            {product.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gray-700 mb-1">
                  <Info className="h-4 w-4" />
                  <h4 className="font-medium">الوصف</h4>
                </div>
                <p className="text-gray-600 text-sm pr-5">{product.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-gray-700 mb-1">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">المخزون</span>
                </div>
                <span className="text-gray-700">
                  {product.track_inventory 
                    ? `${product.stock_quantity || 0} قطعة` 
                    : "غير محدود"}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-gray-700 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">تاريخ الإضافة</span>
                </div>
                <span className="text-gray-700">
                  {new Date(product.created_at).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>
            
            <Separator className="my-1" />
            
            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-1 gap-3 pt-1">
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
                className={`w-full ${product.is_active 
                  ? "text-amber-600 border-amber-200 bg-amber-50 hover:text-amber-700 hover:bg-amber-100" 
                  : "text-green-600 border-green-200 bg-green-50 hover:text-green-700 hover:bg-green-100"}`}
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
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
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
