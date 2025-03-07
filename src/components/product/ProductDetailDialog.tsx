
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { useProductDetailForm } from "@/hooks/useProductDetailForm";
import ProductBasicInfo from "@/components/product/form/ProductBasicInfo";
import ProductAdvancedInfo from "@/components/product/form/ProductAdvancedInfo";
import { X } from "lucide-react";

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
  const {
    product,
    loading,
    saving,
    error,
    formData,
    categories,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSave,
    handleDelete
  } = useProductDetailForm({ 
    productId, 
    storeData,
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } 
  });

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <LoadingState message="جاري تحميل بيانات المنتج..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <ErrorState 
            title="خطأ في تحميل المنتج"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </DialogContent>
      </Dialog>
    );
  }

  const isUpdating = !!productId;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isUpdating ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <SaveButton isSaving={saving} onClick={handleSave} />
          </div>
        </div>

        <div className="space-y-6" dir="rtl">
          <ProductBasicInfo
            name={formData.name}
            description={formData.description}
            price={formData.price}
            discount_price={formData.discount_price}
            images={formData.images}
            storeId={storeData?.id}
            handleChange={handleChange}
            handleImagesChange={handleImagesChange}
          />

          <ProductAdvancedInfo
            category_id={formData.category_id}
            track_inventory={formData.track_inventory}
            stock_quantity={formData.stock_quantity}
            has_colors={formData.has_colors}
            has_sizes={formData.has_sizes}
            require_customer_name={formData.require_customer_name}
            require_customer_image={formData.require_customer_image}
            available_colors={formData.available_colors}
            available_sizes={formData.available_sizes}
            categories={categories}
            handleChange={handleChange}
            handleSwitchChange={handleSwitchChange}
            handleCategoryChange={handleCategoryChange}
            formData={formData}
          />

          {isUpdating && (
            <div className="flex justify-end mt-4">
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="mr-auto"
              >
                حذف المنتج
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
