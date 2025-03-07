
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";

export const useProductData = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: storeData } = useStoreData();
  const isNewProduct = !productId || productId === 'new';
  
  // Fetch product data if editing an existing product
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || productId === 'new') return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error("المنتج غير موجود");
      }
      
      // Ensure all fields have the correct types before returning
      return {
        ...data,
        has_colors: Boolean(data.has_colors),
        has_sizes: Boolean(data.has_sizes),
        track_inventory: Boolean(data.track_inventory),
        require_customer_name: Boolean(data.require_customer_name),
        require_customer_image: Boolean(data.require_customer_image),
        available_colors: Array.isArray(data.available_colors) ? data.available_colors.map(color => String(color)) : [],
        available_sizes: Array.isArray(data.available_sizes) ? data.available_sizes.map(size => String(size)) : [],
        images: [
          ...(data.image_url ? [String(data.image_url)] : []),
          ...(Array.isArray(data.additional_images) ? data.additional_images.map(img => String(img)) : [])
        ]
      };
    },
    enabled: !!productId && productId !== 'new' && !!storeData?.id,
  });

  return {
    productData,
    isLoading,
    error,
    isNewProduct,
    storeData
  };
};
