
import React, { useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ShoppingBag, Search, FilterX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { ErrorState } from "@/components/ui/error-state";

const StoreProducts: React.FC = () => {
  const { storeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  
  // استعلام لجلب بيانات المتجر
  const { data: storeData, isLoading: storeLoading, error: storeError, refetch: refetchStore } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("معرف المتجر غير متوفر");
      const { data, error } = await getStoreFromUrl(storeId, supabase);
      
      if (error) {
        console.error("Store lookup error:", error);
        throw new Error(error.message || "لم نتمكن من العثور على المتجر المطلوب");
      }
      
      if (!data) {
        throw new Error("لم نتمكن من العثور على المتجر المطلوب");
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب المنتجات
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['storeProducts', storeData?.id, searchQuery],
    queryFn: async () => {
      if (!storeData?.id) return [];
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id);
        
      // إضافة فلتر البحث إذا كان موجودًا
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput !== searchQuery) {
      const newParams = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        newParams.set("search", searchInput);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams);
    }
  };
  
  const handleClearSearch = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };
  
  // التعامل مع حالة وجود خطأ في تحميل المتجر
  if (storeError) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4" dir="rtl">
        <ErrorState 
          title="خطأ في تحميل المتجر"
          message={storeError.message || "لم نتمكن من العثور على المتجر المطلوب. تأكد من صحة الرابط المستخدم."}
          onRetry={() => refetchStore()}
        />
        
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <Button asChild variant="outline">
            <Link to="/">العودة للصفحة الرئيسية</Link>
          </Button>
          
          <Button asChild variant="default">
            <Link to="/dashboard">الذهاب إلى لوحة التحكم</Link>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 max-w-md text-center">
          <p>للوصول إلى المتجر، يمكنك استخدام أحد روابط المتاجر المتاحة:</p>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center justify-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded">/store/fhad</code>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 p-0 text-blue-600"
                onClick={() => navigate('/store/fhad')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded">/store/rashed</code>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 p-0 text-blue-600"
                onClick={() => navigate('/store/rashed')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded">/store/Alhajeri</code>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 p-0 text-blue-600"
                onClick={() => navigate('/store/Alhajeri')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold">
              {searchQuery ? `نتائج البحث: ${searchQuery}` : "جميع المنتجات"}
            </h1>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-64">
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  className="pr-10 text-right"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button type="submit">ابحث</Button>
              
              {searchQuery && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  <FilterX className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
              )}
            </form>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">لا توجد منتجات متاحة</h3>
              {searchQuery ? (
                <>
                  <p className="text-gray-500 mb-4">لم نتمكن من العثور على أي منتجات تطابق "{searchQuery}"</p>
                  <Button onClick={handleClearSearch} variant="outline">
                    مسح البحث
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">
                  لم يتم إضافة أي منتجات بعد إلى هذا المتجر
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default StoreProducts;
