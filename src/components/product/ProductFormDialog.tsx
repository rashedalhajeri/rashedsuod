
import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

// Import form sections
import BasicInfoSection from "./form/BasicInfoSection";
import InventorySection from "./form/InventorySection";
import AdvancedFeaturesSection from "./form/AdvancedFeaturesSection";
import ProductImagesSection from "./form/ProductImagesSection";
import ProductFormActions from "./form/ProductFormActions";
import ConditionalSections from "./form/ConditionalSections";
import FormSection from "./form/FormSection";
import CategorySelector from "./form/CategorySelector";
import SectionSelector from "./form/SectionSelector";
import { useProductForm } from "./form/useProductForm";
import { useProductFormSubmit } from "./form/useProductFormSubmit";
import { Product } from "@/utils/products/types";

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
  onAddSuccess: () => void;
  editProduct?: Product | null; // Add this to support editing
  isEditMode?: boolean;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  isOpen,
  onOpenChange,
  storeId,
  onAddSuccess,
  editProduct = null,
  isEditMode = false
}) => {
  const {
    formData,
    handleInputChange,
    handleSwitchChange,
    handleImagesChange,
    handleColorsChange,
    handleSizesChange,
    handleCategoryChange,
    handleSectionChange,
    toggleDiscount,
    isFormValid
  } = useProductForm(editProduct ? {
    name: editProduct.name,
    description: editProduct.description,
    price: editProduct.price,
    discount_price: editProduct.discount_price,
    stock_quantity: editProduct.stock_quantity,
    images: editProduct.images || [],
    track_inventory: editProduct.track_inventory,
    has_colors: editProduct.has_colors,
    has_sizes: editProduct.has_sizes,
    require_customer_name: editProduct.require_customer_name,
    require_customer_image: editProduct.require_customer_image,
    available_colors: editProduct.available_colors,
    available_sizes: editProduct.available_sizes,
    category_id: editProduct.category_id,
    section_id: editProduct.section_id
  } : undefined);
  
  const { isSubmitting, handleSubmit, handleUpdateProduct } = useProductFormSubmit({
    storeId,
    onSuccess: onAddSuccess,
    onClose: () => onOpenChange(false),
    productId: editProduct?.id
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {isEditMode 
              ? 'قم بتعديل معلومات المنتج أدناه ثم اضغط على حفظ التغييرات'
              : 'أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.'}
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
                handleInputChange={handleInputChange}
                toggleDiscount={toggleDiscount}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CategorySelector
                  categoryId={formData.category_id}
                  storeId={storeId}
                  onCategoryChange={handleCategoryChange}
                />
                
                <SectionSelector 
                  sectionId={formData.section_id}
                  storeId={storeId}
                  onSectionChange={handleSectionChange}
                />
              </div>
              
              <InventorySection 
                trackInventory={formData.track_inventory}
                stockQuantity={formData.stock_quantity}
                handleInputChange={handleInputChange}
                handleSwitchChange={handleSwitchChange}
              />
            </div>
            
            {/* القسم الأيسر - صور المنتج */}
            <div className="md:col-span-5">
              <ProductImagesSection 
                images={formData.images}
                storeId={storeId}
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
        
        <ProductFormActions 
          onCancel={() => onOpenChange(false)}
          onSubmit={() => isEditMode && editProduct 
            ? handleUpdateProduct(editProduct.id, formData) 
            : handleSubmit(formData)
          }
          isDisabled={!isFormValid || isSubmitting}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
