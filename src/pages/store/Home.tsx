
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { getStoreFromUrl } from "@/utils/url-utils";
import { toast } from "sonner";

const StoreHome: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError("معرف المتجر غير متوفر");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching store data for:", storeId);
        
        // Use the utility function to get store data
        const { data: storeData, error: storeError } = await getStoreFromUrl(storeId, supabase);
        
        if (storeError) {
          console.error("Error fetching store:", storeError);
          throw new Error(storeError.message || "حدث خطأ في تحميل بيانات المتجر");
        }
        
        if (!storeData) {
          console.error("Store not found for ID:", storeId);
          throw new Error("المتجر غير موجود");
        }
        
        console.log("Store found:", storeData);
        setStore(storeData);
        
        // Fetch featured products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeData.id)
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (productsError) throw new Error(productsError.message || "حدث خطأ في تحميل المنتجات");
        
        setFeaturedProducts(productsData || []);
        
        // If this was a retry that succeeded, show success toast
        if (retryAttempt > 0) {
          toast.success("تم تحميل بيانات المتجر بنجاح");
        }
      } catch (err: any) {
        console.error("Error fetching store data:", err);
        setError(err.message || "حدث خطأ أثناء تحميل بيانات المتجر");
        
        // If it's the first attempt, try again automatically once after a short delay
        if (retryAttempt === 0) {
          setTimeout(() => {
            setRetryAttempt(prev => prev + 1);
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, retryAttempt]);

  // Retry loading function
  const handleRetry = () => {
    setRetryAttempt(prev => prev + 1);
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
        <div className="container mx-auto py-8 px-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>خطأ في تحميل المتجر</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <ErrorState 
            title="خطأ في تحميل المتجر"
            message={error}
            onRetry={handleRetry}
          />
        </div>
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
