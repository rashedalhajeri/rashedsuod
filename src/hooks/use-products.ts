
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock_quantity: number | null;
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
      const transformedData: Product[] = data ? data.map(item => ({
        ...item,
        // Convert Json type to string[] for additional_images
        additional_images: Array.isArray(item.additional_images) 
          ? item.additional_images as string[]
          : item.additional_images 
            ? [item.additional_images as string] 
            : null
      })) : [];

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
