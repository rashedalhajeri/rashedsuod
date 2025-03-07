
import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
import { useProductCategories } from "@/hooks/use-product-categories";

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
    available_sizes: [],
    category_id: null
  });
  
  const { isSubmitting, handleSubmit } = useProductFormSubmit({
    storeId,
    onSuccess: onAddSuccess,
    onClose: () => onOpenChange(false)
  });

  const { categories, loading: categoriesLoading } = useProductCategories(storeId);

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

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: categoryId || null
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
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">الفئة</Label>
                  <Select 
                    value={formData.category_id || ""} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">بدون فئة</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categoriesLoading && (
                    <p className="text-xs text-gray-500">جاري تحميل الفئات...</p>
                  )}
                  {categories.length === 0 && !categoriesLoading && (
                    <p className="text-xs text-gray-500">لا توجد فئات متاحة. يمكنك إضافة فئات من قسم "الفئات والأقسام"</p>
                  )}
                </div>
                
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
                  onChange={handleImagesChange}
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
