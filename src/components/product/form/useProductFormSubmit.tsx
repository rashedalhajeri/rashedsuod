
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number | null;
  images: string[];
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: string[];
  available_sizes: string[];
  category_id: string | null;
  section_id?: string | null;
  [key: string]: any;
}

export interface ProductFormSubmitProps {
  storeId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useProductFormSubmit = ({
  storeId,
  onSuccess,
  onClose
}: ProductFormSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: ProductFormData) => {
    if (!storeId) {
      toast({
        title: "خطأ",
        description: "معرف المتجر غير متوفر",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || formData.price <= 0 || !formData.images.length) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting product data:", formData);
      
      // Prepare data for submission
      const productData = {
        name: formData.name,
        description: formData.description || '',
        price: formData.price,
        discount_price: formData.discount_price,
        image_url: formData.images[0] || null,
        additional_images: JSON.stringify(formData.images.slice(1)),
        stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
        track_inventory: formData.track_inventory,
        has_colors: formData.has_colors,
        has_sizes: formData.has_sizes,
        require_customer_name: formData.require_customer_name,
        require_customer_image: formData.require_customer_image,
        available_colors: JSON.stringify(formData.available_colors),
        available_sizes: JSON.stringify(formData.available_sizes),
        store_id: storeId,
        category_id: formData.category_id,
        section_id: formData.section_id,
        is_featured: false,
        is_archived: false,
        is_active: true,
        sales_count: 0
      };
      
      console.log("Product data for database:", productData);
      
      // Submit to database
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding product:", error);
        throw new Error(error.message);
      }
      
      console.log("Product added successfully:", data);
      
      // Show success message
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المنتج بنجاح"
      });
      
      // Call the success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the dialog
      if (onClose) {
        onClose();
      }
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmit
  };
};
