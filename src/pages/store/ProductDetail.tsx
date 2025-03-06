
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowRight } from "lucide-react";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ProductGallery } from "@/features/store/product-detail/ProductGallery";
import { ProductInformation } from "@/features/store/product-detail/ProductInformation";
import { ProductActions } from "@/features/store/product-detail/ProductActions";
import { useProductDetail } from "@/features/store/product-detail/useProductDetail";

const ProductDetail = () => {
  const { storeId, productId } = useParams();
  const navigate = useNavigate();
  
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
  });
  
  // استخدام هوك تفاصيل المنتج
  const { 
    product, 
    isLoading: productLoading, 
    error: productError,
    quantity,
    setQuantity,
    addToCart,
    isAddingToCart,
    refetchProduct
  } = useProductDetail(productId, storeData);
  
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
  
  // التعامل مع حالة وجود خطأ في تحميل المنتج
  if (productError) {
    return (
      <div dir="rtl">
        <StoreHeader storeData={storeData} isLoading={storeLoading} />
        
        <div className="container mx-auto px-4 py-12 flex items-center justify-center flex-col">
          <ErrorState 
            title="خطأ في تحميل المنتج"
            message={productError.message || "لم نتمكن من العثور على المنتج المطلوب"}
            onRetry={() => refetchProduct()}
          />
          
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to={`/store/${storeId}`}>العودة للمتجر</Link>
            </Button>
          </div>
        </div>
        
        <StoreFooter storeData={storeData} />
      </div>
    );
  }
  
  return (
    <div dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="container mx-auto px-4 py-8">
        {productLoading || storeLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductGallery product={product} />
            
            <div className="space-y-6">
              <ProductInformation 
                product={product} 
                currency={storeData?.currency || 'KWD'} 
              />
              
              <ProductActions 
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                addToCart={addToCart}
                isAddingToCart={isAddingToCart}
                currency={storeData?.currency || 'KWD'}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">لم يتم العثور على المنتج</p>
          </div>
        )}
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default ProductDetail;
