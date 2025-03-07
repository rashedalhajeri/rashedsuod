
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { useProductDetailForm } from "@/hooks/useProductDetailForm";
import { AlertTriangle } from "lucide-react";

// Import form sections
import BasicInfoSection from "./form/BasicInfoSection";
import InventorySection from "./form/InventorySection";
import AdvancedFeaturesSection from "./form/AdvancedFeaturesSection";
import ProductImagesSection from "./form/ProductImagesSection";
import ConditionalSections from "./form/ConditionalSections";
import FormSection from "./form/FormSection";
import CategorySelector from "./form/CategorySelector";
import SectionSelector from "./form/SectionSelector";

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
    isLoading,
    isSubmitting,
    error,
    formData,
    categories,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSectionChange,
    handleSave,
    handleDelete,
    toggleDiscount
  } = useProductDetailForm({ 
    productId, 
    storeData,
    onOpenChange,
    onSuccess
  });

  const handleColorsChange = (colors: string[]) => {
    handleSwitchChange('available_colors', colors as any);
  };

  const handleSizesChange = (sizes: string[]) => {
    handleSwitchChange('available_sizes', sizes as any);
  };

  if (isLoading) {
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
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isUpdating ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            قم بتعديل معلومات المنتج حسب احتياجك
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-1">
          {/* القسم الأول: المعلومات الأساسية والصور */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* القسم الأيمن - المعلومات الأساسية */}
            <div className="md:col-span-7 space-y-6">
              <BasicInfoSection 
                name={formData.name}
                description={formData.description}
                price={formData.price}
                discountPrice={formData.discount_price}
                handleInputChange={handleChange}
                toggleDiscount={toggleDiscount}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CategorySelector
                  categoryId={formData.category_id}
                  storeId={storeData?.id}
                  onCategoryChange={handleCategoryChange}
                />

                <SectionSelector
                  sectionId={formData.section_id}
                  storeId={storeData?.id}
                  onSectionChange={handleSectionChange}
                />
              </div>
              
              <InventorySection 
                trackInventory={formData.track_inventory}
                stockQuantity={formData.stock_quantity}
                handleInputChange={handleChange}
                handleSwitchChange={handleSwitchChange}
              />
            </div>
            
            {/* القسم الأيسر - صور المنتج */}
            <div className="md:col-span-5">
              <ProductImagesSection 
                images={formData.images}
                storeId={storeData?.id}
                onChange={handleImagesChange}
                maxImages={5}
              />
            </div>
          </div>
          
          {/* قسم الخصائص المتقدمة */}
          <FormSection>
            <AdvancedFeaturesSection 
              hasColors={formData.has_colors}
              hasSizes={formData.has_sizes}
              requireCustomerName={formData.require_customer_name}
              requireCustomerImage={formData.require_customer_image}
              handleSwitchChange={handleSwitchChange}
            />
          </FormSection>
          
          {/* قسم الألوان والمقاسات - يظهر فقط عند تفعيلها */}
          <ConditionalSections 
            formData={formData}
            handleColorsChange={handleColorsChange}
            handleSizesChange={handleSizesChange}
          />
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          {isUpdating && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              حذف المنتج
            </Button>
          )}
          
          {!isUpdating && <div></div>}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <SaveButton isSaving={isSubmitting} onClick={handleSave} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
