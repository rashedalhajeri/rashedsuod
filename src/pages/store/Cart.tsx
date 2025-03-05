import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import StorefrontLayout from '@/layouts/StorefrontLayout';

const Cart: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Load cart items from local storage
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const cartItems = localStorage.getItem('cart-items');
        if (cartItems) {
          setCart(JSON.parse(cartItems));
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, []);
  
  if (storeLoading || isLoading) {
    return <LoadingState message="جاري تحميل سلة التسوق..." />;
  }
  
  if (storeError) {
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
        <h1 className="text-3xl font-bold mb-8 text-center">سلة التسوق</h1>
        
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="w-full sm:w-20 h-20 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0 sm:ml-4">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-xs">لا توجد صورة</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.price} ر.س</p>
                          
                          <div className="flex items-center">
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                              <button 
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                  // Decrease quantity logic
                                }}
                              >
                                -
                              </button>
                              <span className="px-3 py-1">{item.quantity || 1}</span>
                              <button 
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                  // Increase quantity logic
                                }}
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                              onClick={() => {
                                // Remove item logic
                              }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="font-bold text-lg text-gray-800 mt-4 sm:mt-0">
                          {(item.price * (item.quantity || 1)).toFixed(2)} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-medium">
                        {cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2)} ر.س
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="font-medium">0.00 ر.س</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة (15%)</span>
                      <span className="font-medium">
                        {(cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) * 0.15).toFixed(2)} ر.س
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>المجموع</span>
                        <span>
                          {(cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) * 1.15).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full py-6" size="lg">
                        إتمام الطلب
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => navigate(`/store/${storeId}/products`)}
                      >
                        متابعة التسوق
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.</p>
            <Button 
              size="lg" 
              onClick={() => navigate(`/store/${storeId}/products`)}
            >
              تصفح المنتجات
            </Button>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Cart;
