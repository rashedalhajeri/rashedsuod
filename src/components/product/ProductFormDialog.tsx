
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

// Import all the smaller components
import BasicInfoSection from "./form/BasicInfoSection";
import PricingSection from "./form/PricingSection";
import InventorySection from "./form/InventorySection";
import AdvancedFeaturesSection from "./form/AdvancedFeaturesSection";
import ProductImagesSection from "./form/ProductImagesSection";
import ProductFormActions from "./form/ProductFormActions";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  images: string[];
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
}

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

  const handleAddProduct = async () => {
    try {
      if (!storeId) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      if (!formData.name || formData.price <= 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      
      if (formData.images.length === 0) {
        toast.error("يرجى إضافة صورة واحدة على الأقل");
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeId,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            discount_price: formData.discount_price,
            stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
            track_inventory: formData.track_inventory,
            has_colors: formData.has_colors,
            has_sizes: formData.has_sizes,
            require_customer_name: formData.require_customer_name,
            require_customer_image: formData.require_customer_image,
            available_colors: formData.has_colors ? formData.available_colors : null,
            available_sizes: formData.has_sizes ? formData.available_sizes : null,
            image_url: formData.images[0] || null,
            additional_images: formData.images.length > 1 ? formData.images.slice(1) : []
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding product:", error);
        toast.error("حدث خطأ أثناء إضافة المنتج");
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      onOpenChange(false);
      resetForm();
      onAddSuccess();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };
  
  const resetForm = () => {
    setFormData({
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
  };

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

  const toggleDiscount = () => {
    setFormData(prev => ({
      ...prev,
      discount_price: prev.discount_price === null ? prev.price : null
    }));
  };

  const isFormValid = formData.name && formData.price > 0 && formData.images.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة منتج جديد</DialogTitle>
          <DialogDescription>
            أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
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
          
          <AdvancedFeaturesSection 
            hasColors={formData.has_colors}
            hasSizes={formData.has_sizes}
            requireCustomerName={formData.require_customer_name}
            requireCustomerImage={formData.require_customer_image}
            handleSwitchChange={handleSwitchChange}
          />
          
          <ProductImagesSection 
            images={formData.images}
            storeId={storeId}
            handleImagesChange={handleImagesChange}
          />
        </div>
        
        <ProductFormActions 
          onCancel={() => onOpenChange(false)}
          onSubmit={handleAddProduct}
          isDisabled={!isFormValid}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
