
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import ProductCard from "@/components/store/ProductCard";
import { useStore } from "@/contexts/StoreContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description?: string | null;
  stock_quantity: number;
  additional_images: string[] | null;
}

const StoreHome: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { store, isLoading, error } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch products if store data is loaded successfully
    if (!isLoading && store && !error) {
      fetchFeaturedProducts();
    }
  }, [isLoading, store, error, storeId]);

  const fetchFeaturedProducts = async () => {
    if (!storeId || storeId === ":storeId") return;
    
    setLoadingProducts(true);
    setProductError(null);
    
    try {
      // Fetch featured products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId)
        .limit(4);
      
      if (productsError) {
        throw productsError;
      }
      
      // Transform the products data
      const transformedProducts: Product[] = productsData?.map(product => ({
        ...product,
        additional_images: Array.isArray(product.additional_images) 
          ? product.additional_images 
          : product.additional_images 
            ? [product.additional_images as string]
            : []
      })) || [];
      
      setFeaturedProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductError("حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // If the store context is still loading, show the loading state
  if (isLoading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل بيانات المتجر..." />
      </StorefrontLayout>
    );
  }

  // If there's an error in the store context, show the error state
  if (error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في تحميل المتجر"
          message={error}
          onRetry={handleRetry}
        />
      </StorefrontLayout>
    );
  }

  // If no store is found in the context, show an error
  if (!store) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="المتجر غير موجود"
          message="لم نتمكن من العثور على المتجر المطلوب"
          onRetry={handleRetry}
        />
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{store.store_name}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {store.description || `مرحباً بك في متجر ${store.store_name}. استعرض مجموعتنا من المنتجات المميزة.`}
          </p>
        </div>
        
        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">منتجات مميزة</h2>
            <Button variant="outline" asChild>
              <Link to={`/store/${storeId}/products`}>عرض كل المنتجات</Link>
            </Button>
          </div>
          
          {loadingProducts ? (
            <LoadingState message="جاري تحميل المنتجات..." />
          ) : productError ? (
            <ErrorState 
              title="خطأ في تحميل المنتجات"
              message={productError}
              onRetry={fetchFeaturedProducts}
            />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  storeId={storeId || ""} 
                  currency={store.currency}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </StorefrontLayout>
  );
};

export default StoreHome;
