
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { getStoreFromUrl } from "@/utils/url-utils";
import { toast } from "sonner";

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) {
        setError("معرف المتجر غير متوفر");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching products for store:", storeId);
        
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
        
        // Fetch products with the store ID from database
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeData.id)
          .order('created_at', { ascending: false });
        
        if (error) throw new Error(error.message || "حدث خطأ في تحميل المنتجات");
        
        setProducts(data || []);
        
        // If this was a retry that succeeded, show success toast
        if (retryAttempt > 0) {
          toast.success("تم تحميل المنتجات بنجاح");
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "حدث خطأ أثناء تحميل المنتجات");
        
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
    
    fetchProducts();
  }, [storeId, retryAttempt]);

  // Retry loading function
  const handleRetry = () => {
    setRetryAttempt(prev => prev + 1);
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
        <div className="container mx-auto py-8 px-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>خطأ في تحميل المنتجات</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <ErrorState 
            title="خطأ في تحميل المنتجات"
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
        <h1 className="text-2xl font-bold mb-6">جميع المنتجات</h1>
        
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate(baseUrl)}
              >
                العودة للصفحة الرئيسية
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`${baseUrl}/products/${product.id}`}
                className="group block"
              >
                <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
                  <div className="aspect-square bg-gray-100">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
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
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-900 font-bold">{product.price} ر.س</p>
                    {product.stock_quantity <= 0 && (
                      <p className="text-red-600 text-sm mt-1">غير متوفر</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default StoreProducts;
