
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description?: string | null;
}

interface Store {
  id: string;
  store_name: string;
  description?: string | null;
  logo_url?: string | null;
}

const StoreHome: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      // Validate the storeId to ensure it's a proper value and not just the placeholder
      if (!storeId || storeId === ":storeId") {
        console.error("Invalid store ID:", storeId);
        setError("معرف المتجر غير متوفر أو غير صالح");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching store with ID:", storeId);
        
        // Fetch store data
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("*")
          .eq("id", storeId)
          .maybeSingle();
        
        if (storeError) {
          console.error("Error fetching store:", storeError);
          throw storeError;
        }
        
        if (!storeData) {
          console.error("Store not found for ID:", storeId);
          setError("المتجر غير موجود");
          setLoading(false);
          return;
        }
        
        setStore(storeData);
        
        // Fetch featured products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeId)
          .limit(4);
        
        if (productsError) {
          console.error("Error fetching products:", productsError);
          throw productsError;
        }
        
        // Transform the additional_images field to ensure it's compatible with our Product interface
        const transformedProducts = productsData ? productsData.map(product => ({
          ...product,
          additional_images: Array.isArray(product.additional_images)
            ? product.additional_images
            : []
        })) : [];
        
        setFeaturedProducts(transformedProducts);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("حدث خطأ أثناء تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, navigate]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل بيانات المتجر..." />
      </StorefrontLayout>
    );
  }

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
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/store/${storeId}/products/${product.id}`}
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
