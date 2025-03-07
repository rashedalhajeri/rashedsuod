
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ProductFormData {
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

interface UseProductFormSubmitProps {
  storeId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const useProductFormSubmit = ({ storeId, onSuccess, onClose }: UseProductFormSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData: ProductFormData): string | null => {
    if (!formData.name || formData.price <= 0) {
      return "يرجى ملء جميع الحقول المطلوبة";
    }
    
    if (formData.images.length === 0) {
      return "يرجى إضافة صورة واحدة على الأقل";
    }
    
    if (formData.has_sizes && (!formData.available_sizes || formData.available_sizes.length === 0)) {
      return "يرجى إضافة مقاس واحد على الأقل عند تفعيل خاصية المقاسات";
    }
    
    if (formData.has_colors && (!formData.available_colors || formData.available_colors.length === 0)) {
      return "يرجى إضافة لون واحد على الأقل عند تفعيل خاصية الألوان";
    }
    
    return null;
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      
      if (!storeId) {
        toast.error("لم يتم العثور على معرف المتجر");
        setIsSubmitting(false);
        return;
      }
      
      const validationError = validateForm(formData);
      if (validationError) {
        toast.error(validationError);
        setIsSubmitting(false);
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
        setIsSubmitting(false);
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
