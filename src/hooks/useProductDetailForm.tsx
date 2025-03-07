
import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";

export interface UseProductDetailFormProps {
  productId: string | null;
  storeData?: any;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const useProductDetailForm = ({ productId, storeData, onOpenChange, onSuccess }: UseProductDetailFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount_price: null,
      stock_quantity: null,
      image_url: null,
      additional_images: [],
      track_inventory: false,
      category_id: null,
      section_id: null,
      has_colors: false,
      has_sizes: false,
      require_customer_name: false,
      require_customer_image: false,
      available_colors: [],
      available_sizes: [],
      is_featured: false,
      images: [],
    },
  });

  const { reset, getValues, setValue, watch } = form;

  const formData = getValues();

  // Toggle discount function
  const toggleDiscount = () => {
    const currentDiscount = getValues('discount_price');
    setValue('discount_price', currentDiscount === null ? getValues('price') : null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("store_id", storeData?.id);

        if (error) {
          console.error("Error fetching categories:", error);
          setError(error.message);
        }

        setCategories(data || []);
      } catch (error: any) {
        console.error("Unexpected error fetching categories:", error);
        setError(error.message);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (storeData?.id) {
      fetchCategories();
    }
  }, [storeData?.id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .eq("id", productId)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setError(error.message);
          toast({
            title: "خطأ",
            description: "فشل في تحميل بيانات المنتج.",
            variant: "destructive",
          });
          return;
        }

        const productData = {
          ...data,
          is_featured: data.is_featured || false,
          sales_count: data.sales_count || 0,
          is_archived: data.is_archived || false
        } as unknown as RawProductData;

        const mappedProduct = mapRawProductToProduct(productData);
        
        setProduct(mappedProduct);
        
        reset({
          ...mappedProduct,
          images: mappedProduct.images || [],
          section_id: data.section_id || null
        });
      } catch (error: any) {
        console.error("Unexpected error fetching product:", error);
        setError(error.message);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات المنتج.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setValue(name as any, parsedValue);
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setValue(name as any, checked);
  };

  const handleImagesChange = (images: string[]) => {
    const mainImage = images.length > 0 ? images[0] : null;
    const additionalImages = images.length > 1 ? images.slice(1) : [];

    setValue('image_url', mainImage);
    setValue('additional_images', additionalImages);
    setValue('images', images);
  };

  const handleCategoryChange = (categoryId: string) => {
    setValue('category_id', categoryId === "none" ? null : categoryId);
  };

  const handleSectionChange = (sectionId: string) => {
    setValue('section_id', sectionId === "none" ? null : sectionId);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = getValues();
      
      const payload = {
        ...formData,
        additional_images: JSON.stringify(formData.additional_images || []),
        available_colors: JSON.stringify(formData.available_colors || []),
        available_sizes: JSON.stringify(formData.available_sizes || []),
      };

      delete (payload as any).images;

      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);

      if (error) {
        console.error("Error updating product:", error);
        setError(error.message);
        toast({
          title: "خطأ",
          description: "فشل في تحديث المنتج.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم بنجاح",
        description: "تم تحديث المنتج بنجاح.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Unexpected error updating product:", error);
      setError(error.message);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المنتج.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
        setError(error.message);
        toast({
          title: "خطأ",
          description: "فشل في حذف المنتج.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم بنجاح",
        description: "تم حذف المنتج بنجاح.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Unexpected error deleting product:", error);
      setError(error.message);
      toast({
        title: "خطأ",
        description: "فشل في حذف المنتج.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading: isInitialLoading,
    isSubmitting,
    error,
    product,
    categories,
    isLoadingCategories,
    formData: {
      ...getValues(),
      images: watch('images') || []
    },
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSectionChange,
    handleSave: handleSubmit,
    handleDelete,
    toggleDiscount
  };
};
