import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import StorefrontLayout from '@/layouts/StorefrontLayout';

const StoreHome: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  
  // Fetch store data
  const { data: storeData, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['store', storeId],
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
  
  // Fetch featured products
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['storeFeaturedProducts', storeData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });
  
  // Fetch latest products
  const { data: latestProducts } = useQuery({
    queryKey: ['storeLatestProducts', storeData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });
  
  if (storeLoading || productsLoading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  
  if (storeError) {
    return (
      <ErrorState 
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب. الرجاء التحقق من الرابط والمحاولة مرة أخرى."
      />
    );
  }
  
  if (!storeData) {
    return (
      <StorefrontLayout storeData={{ store_name: 'متجر تجريبي' }}>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">المتجر غير متوفر</h1>
          <p className="text-gray-600 mb-8">نأسف، هذا المتجر غير متوفر حالياً أو قد تم إزالته.</p>
        </div>
      </StorefrontLayout>
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{storeData.store_name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {storeData.description || 'مرحبًا بكم في متجرنا الإلكتروني'}
          </p>
        </div>
        
        {/* Featured Products */}
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
              <p className="text-gray-500">لا توجد منتجات مميزة حاليًا</p>
            </div>
          )}
        </div>
        
        {/* Latest Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">أحدث المنتجات</h2>
          
          {latestProducts && latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {latestProducts.map((product) => (
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
              <p className="text-gray-500">لا توجد أحدث المنتجات حاليًا</p>
            </div>
          )}
        </div>
        
        {/* Store Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">تصنيفات المتجر</h2>
          
          {/* يمكنك هنا عرض تصنيفات المتجر بشكل جذاب */}
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا توجد تصنيفات متاحة حاليًا</p>
          </div>
        </div>
        
        {/* Promotional Banner */}
        <div className="bg-primary text-white py-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">عروض حصرية بمناسبة الافتتاح!</h2>
          <p className="text-lg mb-8">
            استمتع بخصومات تصل إلى 50% على مجموعة مختارة من المنتجات.
          </p>
          <button className="bg-white text-primary px-6 py-3 rounded-md text-lg font-semibold">
            تسوق الآن
          </button>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StoreHome;
