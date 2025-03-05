
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";

// صفحة معاينة واجهة المتجر
const StorefrontPreview: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  
  // جلب بيانات المتجر
  const { data: storeData, isLoading, error } = useQuery({
    queryKey: ['storePreview', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('domain_name', storeId || 'demo-store')
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeId || storeId === 'demo-store'
  });
  
  // جلب منتجات المتجر
  const { data: products } = useQuery({
    queryKey: ['storeProducts', storeData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });
  
  // إعداد اتجاه الصفحة للغة العربية
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
  
  if (error) {
    return (
      <ErrorState 
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب. الرجاء التحقق من الرابط والمحاولة مرة أخرى."
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{storeData.store_name || "متجر تجريبي"}</h1>
          <p className="text-muted-foreground">مرحبًا بكم في متجرنا الإلكتروني</p>
        </div>
        
        {/* عرض المنتجات المميزة */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">المنتجات المميزة</h2>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
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
                    
                    {/* يمكن إضافة علامة خصم هنا في المستقبل عند إضافة السعر المخفض للمنتجات */}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || "لا يوجد وصف"}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{product.price} ر.س</span>
                      </div>
                      
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
        
        {/* رسالة تنبيه المعاينة */}
        <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-3 rounded-lg text-center text-sm md:text-base z-50 md:left-auto md:right-4 md:max-w-sm">
          أنت تشاهد معاينة للمتجر. هذه نسخة مبسطة من المتجر الكامل.
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StorefrontPreview;
