
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import useStoreData from "@/hooks/use-store-data";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  additional_images: string[];
}

export interface FormErrors {
  [key: string]: string | undefined;
  name?: string;
  price?: string;
  image?: string;
}

export const useProductForm = (
  storeData: any,
  onClose: () => void,
  onSuccess: () => void
) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    image_url: null,
    additional_images: []
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: null,
      additional_images: []
    });
    setFormErrors({});
    setIsUploading(false);
  }, []);

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "يرجى إدخال اسم المنتج";
    }
    
    if (formData.price <= 0) {
      errors.price = "يجب أن يكون السعر أكبر من صفر";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddProduct = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      const { data: storeData } = await useStoreData().refetch();
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const additionalImagesUrls = Array.isArray(formData.additional_images) ? formData.additional_images : [];
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeData.id,
            name: formData.name.trim(),
            description: formData.description?.trim() || null,
            price: formData.price,
            stock_quantity: formData.stock_quantity || 0,
            image_url: formData.image_url,
            additional_images: additionalImagesUrls
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding product:", error);
        toast.error("حدث خطأ أثناء إضافة المنتج");
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      onClose();
      resetForm();
      onSuccess();
      
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    isUploading,
    setIsUploading,
    resetForm,
    validateForm,
    handleInputChange,
    handleAddProduct
  };
};
