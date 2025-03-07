
import { useState, useEffect } from "react";
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

  // Initialize the form with default values
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
      has_colors: false,
      has_sizes: false,
      require_customer_name: false,
      require_customer_image: false,
      available_colors: [],
      available_sizes: [],
      is_featured: false,
    },
  });

  // Destructure form methods and state
  const { reset, getValues, setValue, formState, watch } = form;
  const formValues = watch();

  // Get the form values (to be used as formData in components)
  const formData = getValues();

  // Fetch categories when storeData is available
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

  // Fetch product data when productId changes
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
            title: "Error",
            description: "Failed to load product details.",
            variant: "destructive",
          });
          return;
        }

        // Map raw product data to Product type
        const mappedProduct = mapRawProductToProduct(data as RawProductData);
        setProduct(mappedProduct);
        
        // Reset form with product data
        reset(mappedProduct);
      } catch (error: any) {
        console.error("Unexpected error fetching product:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset]);

  // Event handlers for form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setValue('category_id', categoryId);
  };

  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = getValues();
      
      // Format data for API
      const payload = {
        ...formData,
        additional_images: JSON.stringify(formData.additional_images || []),
        available_colors: JSON.stringify(formData.available_colors || []),
        available_sizes: JSON.stringify(formData.available_sizes || []),
      };

      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);

      if (error) {
        console.error("Error updating product:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to update product.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product updated successfully.",
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
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!productId) return;
    
    if (!confirm("Are you sure you want to delete this product?")) {
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
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product deleted successfully.",
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
        title: "Error",
        description: "Failed to delete product.",
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
    // Export form data and handlers for components
    formData,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSave: handleSubmit,
    handleDelete
  };
};
