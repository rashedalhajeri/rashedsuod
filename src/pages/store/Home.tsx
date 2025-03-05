
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";

const StoreHome: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch store data
  const { data: storeData } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*")
          .eq("domain_name", storeId)
          .single();
          
        if (error) throw error;
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to fetch store data");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!storeId,
  });
  
  // Fetch featured products
  const { data: featuredProducts } = useQuery({
    queryKey: ["featuredProducts", storeData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData?.id)
        .order("created_at", { ascending: false })
        .limit(8);
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id,
  });
  
  // Set RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);
  
  if (isLoading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  
  if (error || !storeData) {
    return (
      <ErrorState
        title="لم يتم العثور على المتجر"
        message={error || "تعذر العثور على المتجر المطلوب"}
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{storeData.store_name}</h1>
          <p className="text-muted-foreground">مرحبًا بكم في متجرنا الإلكتروني</p>
        </div>
        
        {/* Featured products */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">المنتجات المميزة</h2>
          
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || "لا يوجد وصف"}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{product.price} ر.س</span>
                      <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">لا توجد منتجات متاحة حاليًا</p>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StoreHome;
