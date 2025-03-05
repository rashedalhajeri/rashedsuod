import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Heart, Minus, Plus, Share2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
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
  
  // Fetch product details
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['storeProduct', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });
  
  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.category_id, product?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)
        .eq('category_id', product?.category_id)
        .neq('id', product?.id)
        .limit(4);
        
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id && !!product?.id && !!storeData?.id
  });
  
  const handleAddToCart = () => {
    // Add to cart logic
    const cartItems = localStorage.getItem('cart-items');
    let cart = cartItems ? JSON.parse(cartItems) : [];
    
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart-items', JSON.stringify(cart));
    
    // Dispatch event to update cart count in StorefrontLayout
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة ${product.name} إلى سلة التسوق الخاصة بك`,
    });
  };
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };
  
  if (storeLoading || productLoading) {
    return <LoadingState message="جاري تحميل تفاصيل المنتج..." />;
  }
  
  if (storeError) {
    return (
      <StorefrontLayout storeData={{ store_name: 'متجر تجريبي' }}>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">المتجر غير متوفر</h1>
          <p className="text-gray-600 mb-8">نأسف، هذا المتجر غير متوفر حالياً أو قد تم إزالته.</p>
        </div>
      </StorefrontLayout>
    );
  }
  
  if (productError) {
    return (
      <StorefrontLayout storeData={storeData}>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">المنتج غير متوفر</h1>
          <p className="text-gray-600 mb-8">نأسف، هذا المنتج غير متوفر حالياً أو قد تم إزالته.</p>
          <Button onClick={() => navigate(`/store/${storeId}/products`)}>
            العودة إلى المنتجات
          </Button>
        </div>
      </StorefrontLayout>
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-400">لا توجد صورة</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description || 'لا يوجد وصف لهذا المنتج'}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-semibold">{product.price} ر.س</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <Button onClick={handleAddToCart}>
                إضافة إلى السلة
                <ShoppingBag className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            {product.categories && (
              <div className="mb-4">
                <span className="text-gray-700 font-semibold">التصنيف:</span>
                <span className="text-primary ml-2">{product.categories.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">منتجات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {relatedProduct.image_url ? (
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{relatedProduct.description || "لا يوجد وصف"}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{relatedProduct.price} ر.س</span>
                      </div>
                      
                      <Button size="sm">
                        إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
