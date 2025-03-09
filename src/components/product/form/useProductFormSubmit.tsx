
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { databaseClient } from "@/integrations/database/client";

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
  productId?: string;
}

export const useProductFormSubmit = ({
  storeId,
  onSuccess,
  onClose,
  productId
}: ProductFormSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: ProductFormData) => {
    if (!storeId) {
      toast.error("خطأ", {
        description: "معرف المتجر غير متوفر"
      });
      return;
    }
    
    if (!formData.name || formData.price <= 0 || !formData.images.length) {
      toast.error("خطأ", {
        description: "يرجى ملء جميع الحقول المطلوبة"
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
      toast.success("تمت الإضافة بنجاح", {
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
      toast.error("خطأ", {
        description: error.message || "حدث خطأ أثناء إضافة المنتج"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productId: string, formData: ProductFormData) => {
    if (!storeId) {
      toast.error("خطأ", {
        description: "معرف المتجر غير متوفر"
      });
      return;
    }
    
    if (!formData.name || formData.price <= 0 || !formData.images.length) {
      toast.error("خطأ", {
        description: "يرجى ملء جميع الحقول المطلوبة"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Updating product data:", formData);
      
      // Prepare data for update
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
        category_id: formData.category_id,
        section_id: formData.section_id
      };
      
      console.log("Product data for update:", productData);
      
      // Update in database
      const { data, error } = await databaseClient.products.updateProduct(productId, productData);
      
      if (error) {
        console.error("Error updating product:", error);
        throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
      }
      
      console.log("Product updated successfully:", data);
      
      // Show success message
      toast.success("تم التحديث بنجاح", {
        description: "تم تحديث المنتج بنجاح"
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
      console.error("Error in handleUpdateProduct:", error);
      toast.error("خطأ", {
        description: error.message || "حدث خطأ أثناء تحديث المنتج"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmit,
    handleUpdateProduct
  };
};
