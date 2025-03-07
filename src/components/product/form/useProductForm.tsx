
import { useState } from "react";
import { ProductFormData } from "./useProductFormSubmit";

export const useProductForm = (initialData?: Partial<ProductFormData>) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    discount_price: initialData?.discount_price || null,
    stock_quantity: initialData?.stock_quantity || 0,
    images: initialData?.images || [],
    track_inventory: initialData?.track_inventory || false,
    has_colors: initialData?.has_colors || false,
    has_sizes: initialData?.has_sizes || false,
    require_customer_name: initialData?.require_customer_name || false,
    require_customer_image: initialData?.require_customer_image || false,
    available_colors: initialData?.available_colors || [],
    available_sizes: initialData?.available_sizes || [],
    category_id: initialData?.category_id || null,
    section_id: initialData?.section_id || null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      // For number fields, convert to number or use 0 if empty
      const parsedValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    console.log("Category changed to:", categoryId);
    setFormData(prev => ({
      ...prev,
      category_id: categoryId === "none" ? null : categoryId
    }));
  };

  const handleSectionChange = (sectionId: string) => {
    console.log("Section changed to:", sectionId);
    setFormData(prev => ({
      ...prev,
      section_id: sectionId === "none" ? null : sectionId
    }));
  };

  const toggleDiscount = () => {
    setFormData(prev => {
      // If discount_price is null, set it to a default value (can be the same as price)
      // If discount_price is not null, set it back to null to remove the discount
      if (prev.discount_price === null) {
        return {
          ...prev,
          discount_price: prev.price > 0 ? prev.price * 0.9 : 0 // Default 10% discount
        };
      } else {
        return {
          ...prev,
          discount_price: null
        };
      }
    });
  };

  const isFormValid = formData.name && formData.price > 0 && formData.images.length > 0 && 
    (!formData.has_colors || (formData.available_colors && formData.available_colors.length > 0)) &&
    (!formData.has_sizes || (formData.available_sizes && formData.available_sizes.length > 0));

  return {
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
  };
};
