
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ShoppingBag, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import StoreHeader from "@/components/store/StoreHeader";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import StoreFooter from "@/components/store/StoreFooter";

const StoreHome: React.FC = () => {
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // استعلام لجلب بيانات المتجر
  const { data: storeData, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("معرف المتجر غير متوفر");
      const { data, error } = await getStoreFromUrl(storeId, supabase);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب المنتجات المميزة
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب المنتجات الجديدة
  const { data: newProducts, isLoading: newProductsLoading } = useQuery({
    queryKey: ['newProducts', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  if (storeError) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4" dir="rtl">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-red-600">خطأ في تحميل المتجر</h1>
          <p className="text-gray-600">لم نتمكن من العثور على المتجر المطلوب</p>
          <Button asChild variant="outline">
            <Link to="/">العودة للصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info("البحث عن: " + searchQuery);
      // التوجيه إلى صفحة البحث
      window.location.href = `/store/${storeId}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="flex-1">
        {/* قسم البحث */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-50 py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {storeLoading ? 
                  <Skeleton className="h-10 w-3/4 mx-auto" /> : 
                  `مرحباً بك في ${storeData?.store_name || 'متجرنا'}`
                }
              </h1>
              <p className="text-gray-600 mb-6">تسوق أحدث المنتجات بأفضل الأسعار</p>
              
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  className="pr-10 text-right"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Button type="submit" className="mr-2">ابحث</Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* المنتجات المميزة */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">منتجات مميزة</h2>
              <Link 
                to={`/store/${storeId}/products`} 
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                عرض الكل <ChevronRight className="h-4 w-4 mr-1" />
              </Link>
            </div>
            
            <FeaturedProducts 
              products={featuredProducts || []} 
              isLoading={productsLoading} 
              storeId={storeId || ''} 
              currency={storeData?.currency || 'KWD'}
            />
          </div>
        </section>
        
        {/* المنتجات الجديدة */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">أحدث المنتجات</h2>
              <Link 
                to={`/store/${storeId}/products`} 
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                عرض الكل <ChevronRight className="h-4 w-4 mr-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newProductsLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              ) : newProducts && newProducts.length > 0 ? (
                newProducts.map((product: any) => (
                  <Link 
                    to={`/store/${storeId}/products/${product.id}`} 
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-blue-600 font-bold">
                        {new Intl.NumberFormat('ar-EG', {
                          style: 'currency',
                          currency: storeData?.currency || 'KWD'
                        }).format(product.price)}
                      </p>
                      <Button className="w-full mt-3">إضافة للسلة</Button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">لا توجد منتجات جديدة حالياً</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default StoreHome;
