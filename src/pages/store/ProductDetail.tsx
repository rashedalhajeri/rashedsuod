
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ShoppingBag, ShoppingCart, Minus, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import ProductGallery from "@/components/store/ProductGallery";

const StoreProductDetail: React.FC = () => {
  const { storeId, productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // استعلام لجلب بيانات المتجر
  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("معرف المتجر غير متوفر");
      const { data, error } = await getStoreFromUrl(storeId, supabase);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب بيانات المنتج
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error("معرف المنتج غير متوفر");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب منتجات مشابهة
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedProducts', productId],
    queryFn: async () => {
      if (!storeData?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .neq('id', productId)
        .limit(4);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id,
  });
  
  const formatCurrency = getCurrencyFormatter(storeData?.currency);
  
  const incrementQuantity = () => {
    if (product && quantity < (product.stock_quantity || 10)) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    toast.success(`تم إضافة ${quantity} من ${product?.name} إلى السلة`);
    // TODO: إضافة المنتج للسلة
  };
  
  if (productLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <StoreHeader storeData={storeData} isLoading={storeLoading} />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </div>
                <div className="w-full md:w-1/2">
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-1/4 mb-6" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-8" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <StoreFooter storeData={storeData} />
      </div>
    );
  }
  
  // تنسيق الصور للعرض في المعرض
  const galleryImages = [];
  if (product.image_url) {
    galleryImages.push({ original: product.image_url, thumbnail: product.image_url });
  }
  if (product.additional_images && Array.isArray(product.additional_images)) {
    product.additional_images.forEach((url: string) => {
      galleryImages.push({ original: url, thumbnail: url });
    });
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* مسار التنقل */}
          <div className="mb-6 flex items-center text-sm text-gray-500">
            <Link to={`/store/${storeId}`} className="hover:text-blue-600">
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4 mx-2" />
            <Link to={`/store/${storeId}/products`} className="hover:text-blue-600">
              المنتجات
            </Link>
            <ChevronLeft className="h-4 w-4 mx-2" />
            <span className="font-medium text-gray-700">{product.name}</span>
          </div>
          
          {/* تفاصيل المنتج */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* معرض الصور */}
              <div className="w-full md:w-1/2">
                {galleryImages.length > 0 ? (
                  <ProductGallery images={galleryImages} />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* معلومات المنتج */}
              <div className="w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {product.description || "لا يوجد وصف متاح لهذا المنتج."}
                </p>
                
                {/* حالة المخزون */}
                <div className="mb-6">
                  {product.stock_quantity > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      متوفر في المخزون - {product.stock_quantity} قطعة
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      غير متوفر حالياً
                    </Badge>
                  )}
                </div>
                
                {/* اختيار الكمية */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">الكمية</h3>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 min-w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={product.stock_quantity <= 0 || quantity >= product.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* أزرار الشراء وإضافة للسلة */}
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    إضافة للسلة
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => {
                      handleAddToCart();
                      navigate(`/store/${storeId}/cart`);
                    }}
                    disabled={product.stock_quantity <= 0}
                  >
                    شراء الآن
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* تفاصيل إضافية وتقييمات */}
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">تفاصيل المنتج</TabsTrigger>
                <TabsTrigger value="shipping">الشحن والتسليم</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="p-4">
                <div className="prose max-w-none">
                  <p>{product.description || "لا توجد تفاصيل إضافية لهذا المنتج."}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="p-4">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium mb-3">معلومات الشحن</h3>
                  <p>يتم شحن المنتجات خلال 2-3 أيام عمل من تاريخ الطلب.</p>
                  <p>التوصيل متاح لجميع مناطق {storeData?.country || "البلاد"}.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* منتجات مشابهة */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">منتجات مشابهة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link 
                    to={`/store/${storeId}/products/${relatedProduct.id}`} 
                    key={relatedProduct.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      {relatedProduct.image_url ? (
                        <img 
                          src={relatedProduct.image_url} 
                          alt={relatedProduct.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-base mb-1 line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-blue-600 font-bold">
                        {formatCurrency(relatedProduct.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default StoreProductDetail;
