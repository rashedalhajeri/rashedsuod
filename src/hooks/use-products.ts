
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Define simpler Product interface to avoid recursive typing issues
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock_quantity: number;
  additional_images: string[] | null;
  store_id: string;
  created_at: string;
  updated_at: string;
}

interface UseProductsOptions {
  storeId: string;
  limit?: number;
  searchQuery?: string;
  categoryId?: string;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchNextPage: () => Promise<void>;
  hasMore: boolean;
  refetch: () => Promise<void>;
}

export const useProducts = ({
  storeId,
  limit = 12,
  searchQuery = "",
  categoryId
}: UseProductsOptions): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (currentPage: number = 0, append: boolean = false) => {
    if (!storeId) {
      setError("معرف المتجر غير متوفر");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const startRange = currentPage * limit;
      const endRange = startRange + limit - 1;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('store_id', storeId)
        .range(startRange, endRange);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: fetchError, count } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (count !== null) {
        setTotalCount(count);
        setHasMore((currentPage + 1) * limit < count);
      }

      // Transform the data to ensure it matches the Product interface
      const transformedData: Product[] = data ? data.map(item => {
        // Process additional_images to ensure they're strings
        let processedImages: string[] | null = null;
        
        if (item.additional_images) {
          if (Array.isArray(item.additional_images)) {
            processedImages = item.additional_images.map(img => 
              typeof img === 'string' ? img : JSON.stringify(img)
            );
          } else if (typeof item.additional_images === 'string') {
            processedImages = [item.additional_images];
          }
        }
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image_url: item.image_url,
          stock_quantity: item.stock_quantity || 0,
          additional_images: processedImages,
          store_id: item.store_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      }) : [];

      if (append) {
        setProducts(prev => [...prev, ...transformedData]);
      } else {
        setProducts(transformedData);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProducts(nextPage, true);
  };

  const refetch = async () => {
    setPage(0);
    await fetchProducts(0, false);
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId, limit, searchQuery, categoryId]);

  return {
    products,
    isLoading,
    error,
    totalCount,
    fetchNextPage,
    hasMore,
    refetch
  };
};

export default useProducts;
