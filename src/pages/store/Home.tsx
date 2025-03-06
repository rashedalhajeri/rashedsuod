
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { useStoreDetection } from "@/hooks/use-store-detection";

const StoreHome: React.FC = () => {
  // Use the store detection hook
  const { store, loading: storeLoading, error: storeError } = useStoreDetection();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!store) return;
      
      try {
        setLoading(true);
        
        // Fetch featured products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", store.id)
          .limit(4);
        
        if (productsError) throw productsError;
        
        setFeaturedProducts(productsData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("حدث خطأ أثناء تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [store]);

  // Show loading state while store is being detected
  if (storeLoading || loading) {
    return (
      <StorefrontLayout>
        <LoadingState message={storeLoading ? "جاري تحميل بيانات المتجر..." : "جاري تحميل المنتجات..."} />
      </StorefrontLayout>
    );
  }

  // Show error if store detection failed
  if (storeError || error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في التحميل"
          message={storeError || error || "حدث خطأ غير متوقع"}
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  // Store URL for links
  const baseUrl = `/store/${store.id}`;

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{store.store_name}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            مرحباً بك في متجر {store.store_name}. استعرض مجموعتنا من المنتجات المميزة.
          </p>
        </div>
        
        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">منتجات مميزة</h2>
            <Button variant="outline" asChild>
              <Link to={`${baseUrl}/products`}>عرض كل المنتجات</Link>
            </Button>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`${baseUrl}/products/${product.id}`}
                  className="group block"
                >
                  <div className="bg-gray-100 aspect-square rounded-md overflow-hidden mb-2">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <img 
                          src="/placeholder.svg" 
                          alt="Placeholder" 
                          className="w-16 h-16 opacity-50" 
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-900 font-bold">{product.price} ر.س</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </StorefrontLayout>
  );
};

export default StoreHome;
