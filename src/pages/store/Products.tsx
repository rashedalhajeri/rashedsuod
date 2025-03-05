
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { getStoreFromUrl } from "@/utils/url-utils";

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) {
        setError("معرف المتجر غير متوفر");
        setLoading(false);
        return;
      }
      
      try {
        // Use the new utility function to get store data
        const { data: storeData, error: storeError } = await getStoreFromUrl(storeId, supabase);
        
        if (storeError) throw storeError;
        if (!storeData) {
          setError("المتجر غير موجود");
          return;
        }
        
        setStore(storeData);
        
        // Fetch products with the store ID from database
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeData.id);
        
        if (error) throw error;
        
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("حدث خطأ أثناء تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [storeId]);

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
