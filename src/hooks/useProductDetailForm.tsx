import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/products/types";

export interface UseProductDetailFormProps {
  productId: string | null;
  storeData?: any;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const useProductDetailForm = ({ productId, storeData, onOpenChange, onSuccess }: UseProductDetailFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useState(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("store_id", storeData?.id);

        if (error) {
          console.error("Error fetching categories:", error);
          setError(error);
        }

        setCategories(data || []);
      } catch (error: any) {
        console.error("Unexpected error fetching categories:", error);
        setError(error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (storeData?.id) {
      fetchCategories();
    }
  }, [storeData?.id]);

  useState(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setError(error);
          toast({
            title: "Error",
            description: "Failed to load product details.",
            variant: "destructive",
          });
          return;
        }

        setProduct(data);
        form.reset(data);
      } catch (error: any) {
        console.error("Unexpected error fetching product:", error);
        setError(error);
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
  }, [productId, form]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", productId);

      if (error) {
        console.error("Error updating product:", error);
        setError(error);
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
      setError(error);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isInitialLoading,
    error,
    product,
    handleSubmit,
    categories,
    isLoadingCategories
  };
};
