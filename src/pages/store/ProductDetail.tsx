import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingBag, Heart, Share2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { useShoppingCart } from "@/hooks/use-shopping-cart";

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const { addToCart } = useShoppingCart();
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const formatCurrency = storeData 
    ? getCurrencyFormatter(storeData.currency) 
    : (price: number) => `${price.toFixed(2)} KWD`;
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
    meta: {
      onError: (error: Error) => {
        toast.error("حدث خطأ أثناء تحميل تفاصيل المنتج");
        console.error(error);
      }
    }
  });
  
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['relatedProducts', product?.store_id],
    queryFn: async () => {
      if (!product?.store_id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', product.store_id)
        .neq('id', product.id)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!product?.store_id
  });
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image_url
      });
      
      setIsAddingToCart(false);
    }, 500);
  };
  
  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="pt-4 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }
  
  if (!product) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-2">لم يتم العثور على المنتج</h1>
          <p className="text-gray-600 mb-6">
            المنتج الذي تبحث عنه غير موجود أو تم حذفه
          </p>
          <Button
            onClick={() => navigate('/store/products')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة إلى المنتجات
          </Button>
        </div>
      </StorefrontLayout>
    );
  }
  
  return (
    <StorefrontLayout storeId={product.store_id}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <a href="/store" className="hover:text-primary">الرئيسية</a>
          <span className="mx-2">/</span>
          <a href="/store/products" className="hover:text-primary">المنتجات</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto object-contain mx-auto"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">لا توجد صورة</span>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="text-2xl font-bold text-primary-700 mb-4">
                {formatCurrency(product.price)}
              </div>
              
              <div className="border-t border-b py-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "لا يوجد وصف متاح لهذا المنتج."}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية
                </label>
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center w-12">{quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                    onClick={increaseQuantity}
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {product.stock_quantity !== null && (
                <div className="flex items-center mb-6">
                  <div
                    className={`flex items-center ${
                      product.stock_quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock_quantity > 0 ? (
                      <>
                        <Check className="h-5 w-5 mr-1" />
                        <span>متوفر في المخزن</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 mr-1" />
                        <span>غير متوفر حالياً</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  className="w-full flex items-center justify-center py-6"
                  disabled={isAddingToCart || (product.stock_quantity !== null && product.stock_quantity <= 0)}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      جاري الإضافة...
                    </div>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      إضافة إلى السلة
                    </>
                  )}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center">
                    <Heart className="mr-2 h-5 w-5" />
                    أضف للمفضلة
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Share2 className="mr-2 h-5 w-5" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b">
              <TabsTrigger value="description" className="flex-1">الوصف</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">التفاصيل</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">الشحن والإرجاع</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="description">
                <div className="prose max-w-none">
                  <p>{product.description || "لا يوجد وصف متاح لهذا المنتج."}</p>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="prose max-w-none">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">الكود</td>
                        <td className="py-2">{product.id.substring(0, 8).toUpperCase()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">السعر</td>
                        <td className="py-2">{formatCurrency(product.price)}</td>
                      </tr>
                      {product.stock_quantity !== null && (
                        <tr className="border-b">
                          <td className="py-2 font-medium">المخزون</td>
                          <td className="py-2">{product.stock_quantity} وحدة</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="shipping">
                <div className="prose max-w-none">
                  <h4 className="text-lg font-medium mb-2">سياسة الشحن</h4>
                  <p className="mb-4">يتم شحن المنتجات خلال 1-3 أيام عمل من تاريخ الطلب. تختلف رسوم الشحن حسب الموقع والوزن.</p>
                  
                  <h4 className="text-lg font-medium mb-2">سياسة الإرجاع</h4>
                  <p>يمكن إرجاع المنتجات خلال 14 يومًا من تاريخ الاستلام شريطة أن تكون في حالتها الأصلية وغير مستخدمة.</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">منتجات ذات صلة</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoadingRelated ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))
              ) : (
                relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className="relative h-48 bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/store/products/${relatedProduct.id}`)}
                    >
                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 
                        className="font-medium text-lg mb-2 cursor-pointer hover:text-primary truncate"
                        onClick={() => navigate(`/store/products/${relatedProduct.id}`)}
                      >
                        {relatedProduct.name}
                      </h3>
                      <p className="text-primary-700 font-bold">
                        {formatCurrency(relatedProduct.price)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetailPage;
