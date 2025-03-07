
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductFormData } from "@/components/product/form/useProductFormSubmit";

export const useProductOperations = (
  productId: string | undefined,
  storeId: string | undefined,
  formData: ProductFormData,
  isFormValid: boolean
) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const isNewProduct = !productId || productId === 'new';

  const handleSave = async () => {
    if (!storeId) {
      toast.error("لم يتم العثور على معرف المتجر");
      return;
    }
    
    if (!isFormValid) {
      toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة");
      return;
    }
    
    try {
      setIsSaving(true);
      
      const productToSave = {
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
        additional_images: formData.images.length > 1 ? formData.images.slice(1) : [],
        category_id: formData.category_id || null,
        updated_at: new Date().toISOString()
      };
      
      if (productId && productId !== 'new') {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productToSave)
          .eq('id', productId);
          
        if (error) throw error;
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productToSave]);
          
        if (error) throw error;
        toast.success("تم إضافة المنتج بنجاح");
      }
      
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId || productId === 'new') return;
    
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast.success("تم حذف المنتج بنجاح");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleSave,
    handleDelete,
    isNewProduct
  };
};
