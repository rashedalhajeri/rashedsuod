
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import ProductCard from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  additional_images: string[] | null;
}

const PRODUCTS_PER_PAGE = 12;

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("SAR");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch store and products
  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || storeId === ":storeId") {
        setError("معرف المتجر غير متوفر أو غير صالح");
        setLoading(false);
        return;
      }
      
      try {
        // First, fetch store info to get the currency
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("currency")
          .eq("id", storeId)
          .maybeSingle();
        
        if (storeError) throw storeError;
        
        if (storeData?.currency) {
          setCurrency(storeData.currency);
        }
        
        // Then fetch the first page of products
        await fetchProducts();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [storeId]);

  const fetchProducts = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    }
    
    try {
      const pageToLoad = loadMore ? page + 1 : 0;
      const from = pageToLoad * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;
      
      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("store_id", storeId)
        .range(from, to)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform data to ensure additional_images is always an array
      const processedProducts: Product[] = data?.map(product => ({
        ...product,
        additional_images: Array.isArray(product.additional_images) 
          ? product.additional_images 
          : product.additional_images 
            ? [product.additional_images as string]
            : []
      })) || [];
      
      if (loadMore) {
        setProducts(prev => [...prev, ...processedProducts]);
        setPage(pageToLoad);
      } else {
        setProducts(processedProducts);
      }
      
      // Update hasMore flag
      setHasMore(count ? from + processedProducts.length < count : false);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (!loadMore) {
        setError("حدث خطأ أثناء تحميل المنتجات");
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(true);
    }
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل المنتجات..." />
      </StorefrontLayout>
    );
  }

  if (error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في تحميل المنتجات"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">جميع المنتجات</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  storeId={storeId || ""} 
                  currency={currency}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  className="gap-2"
                >
                  {loadingMore ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      عرض المزيد من المنتجات
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default StoreProducts;
