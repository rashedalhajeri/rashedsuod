
import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

// Import form sections
import BasicInfoSection from "./form/BasicInfoSection";
import PricingSection from "./form/PricingSection";
import InventorySection from "./form/InventorySection";
import AdvancedFeaturesSection from "./form/AdvancedFeaturesSection";
import ProductImagesSection from "./form/ProductImagesSection";
import ProductFormActions from "./form/ProductFormActions";
import ConditionalSections from "./form/ConditionalSections";
import FormSection from "./form/FormSection";
import { useProductFormSubmit, ProductFormData } from "./form/useProductFormSubmit";

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
  onAddSuccess: () => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  isOpen,
  onOpenChange,
  storeId,
  onAddSuccess
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    stock_quantity: 0,
    images: [],
    track_inventory: false,
    has_colors: false,
    has_sizes: false,
    require_customer_name: false,
    require_customer_image: false,
    available_colors: [],
    available_sizes: []
  });
  
  const { isSubmitting, handleSubmit } = useProductFormSubmit({
    storeId,
    onSuccess: onAddSuccess,
    onClose: () => onOpenChange(false)
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' || name === 'discount_price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };
  
  const handleColorsChange = (colors: string[]) => {
    setFormData(prev => ({
      ...prev,
      available_colors: colors
    }));
  };
  
  const handleSizesChange = (sizes: string[]) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: sizes
    }));
  };

  const toggleDiscount = () => {
    setFormData(prev => ({
      ...prev,
      discount_price: prev.discount_price === null ? prev.price : null
    }));
  };

  const isFormValid = formData.name && formData.price > 0 && formData.images.length > 0 && 
    (!formData.has_colors || (formData.available_colors && formData.available_colors.length > 0)) &&
    (!formData.has_sizes || (formData.available_sizes && formData.available_sizes.length > 0));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">إضافة منتج جديد</DialogTitle>
          <DialogDescription className="text-gray-500">
            أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* القسم العلوي: المعلومات الأساسية والسعر والصور */}
          <FormSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <BasicInfoSection 
                  name={formData.name}
                  description={formData.description}
                  handleInputChange={handleInputChange}
                />
                
                <PricingSection 
                  price={formData.price}
                  discountPrice={formData.discount_price}
                  handleInputChange={handleInputChange}
                  toggleDiscount={toggleDiscount}
                />
                
                <InventorySection 
                  trackInventory={formData.track_inventory}
                  stockQuantity={formData.stock_quantity}
                  handleInputChange={handleInputChange}
                  handleSwitchChange={handleSwitchChange}
                />
              </div>
              
              <div>
                <ProductImagesSection 
                  images={formData.images}
                  storeId={storeId}
                  handleImagesChange={handleImagesChange}
                  maxImages={5}
                />
              </div>
            </div>
          </FormSection>
          
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
          onSubmit={() => handleSubmit(formData)}
          isDisabled={!isFormValid || isSubmitting}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
