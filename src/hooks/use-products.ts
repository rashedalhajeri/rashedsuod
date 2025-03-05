
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Define a simplified Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock_quantity?: number;
  additional_images: string[];
  store_id: string;
  created_at: string;
  updated_at: string;
}

export const useProducts = (storeId: string | undefined) => {
  return useQuery({
    queryKey: ['products', storeId],
    queryFn: async (): Promise<Product[]> => {
      if (!storeId) {
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("حدث خطأ في جلب المنتجات");
        throw error;
      }

      // Process the products to ensure they match the Product interface
      const processedProducts: Product[] = [];
      
      for (const item of data || []) {
        // Process additional_images safely - make sure we convert all items to strings
        let additionalImages: string[] = [];
        if (item.additional_images) {
          try {
            // Handle either string or already parsed JSON
            if (typeof item.additional_images === 'string') {
              additionalImages = JSON.parse(item.additional_images);
            } else if (Array.isArray(item.additional_images)) {
              // Convert each item to string to ensure type safety
              additionalImages = (item.additional_images as Json[]).map(item => 
                item !== null ? String(item) : ''
              ).filter(item => item !== '');
            }
          } catch (e) {
            console.error("Error parsing additional_images:", e);
            additionalImages = [];
          }
        }

        // Create a properly typed product object
        const product: Product = {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description || '',
          image_url: item.image_url || '',
          stock_quantity: item.stock_quantity || 0,
          additional_images: additionalImages,
          store_id: item.store_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        };

        processedProducts.push(product);
      }

      return processedProducts;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useProducts;
