
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, ChevronRight, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StorefrontLayout from "@/layouts/StorefrontLayout";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  store_id: string;
}

const Cart: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch store data
  const { data: storeData, isLoading: isLoadingStore, error: storeError } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("domain_name", storeId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });
  
  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cart-items") || "[]");
        // Filter items for this store only
        const storeItems = items.filter((item: CartItem) => item.store_id === storeData?.id);
        setCartItems(storeItems);
      } catch (error) {
        console.error("Error loading cart items", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (storeData?.id) {
      loadCartItems();
    }
  }, [storeData]);
  
  // Set RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);
  
  const updateCartItem = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };
  
  const removeCartItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
    toast.success("تم حذف المنتج من السلة");
  };
  
  const saveCartItems = (items: CartItem[]) => {
    // Get all cart items (including those for other stores)
    const allItems = JSON.parse(localStorage.getItem("cart-items") || "[]");
    
    // Remove items for this store
    const otherStoreItems = allItems.filter((item: CartItem) => item.store_id !== storeData?.id);
    
    // Add updated items for this store
    const updatedAllItems = [...otherStoreItems, ...items];
    
    localStorage.setItem("cart-items", JSON.stringify(updatedAllItems));
    window.dispatchEvent(new Event("cart-updated"));
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    toast.info("سيتم تطوير هذه الميزة قريبًا");
  };
  
  if (isLoadingStore) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  
  if (storeError || !storeData) {
    return (
      <ErrorState
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب"
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button onClick={() => navigate(`/store/${storeId}`)} className="hover:text-primary">
            الرئيسية
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700 font-medium">سلة التسوق</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
        
        {loading ? (
          <LoadingState message="جاري تحميل سلة التسوق..." />
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6">المنتج</th>
                      <th className="text-center py-4 px-2">السعر</th>
                      <th className="text-center py-4 px-2">الكمية</th>
                      <th className="text-center py-4 px-2">الإجمالي</th>
                      <th className="py-4 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="mr-4">
                              <a 
                                href={`/store/${storeId}/product/${item.id}`}
                                className="text-base font-medium text-gray-800 hover:text-primary"
                              >
                                {item.name}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">{item.price.toFixed(2)} ر.س</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-md"
                              onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="h-8 w-10 flex items-center justify-center border-y border-gray-200">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-md"
                              onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center font-medium">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </td>
                        <td className="py-4 px-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeCartItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">إجمالي المنتجات</span>
                    <span className="font-medium">{calculateTotal().toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium">0.00 ر.س</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-lg text-primary">
                      {calculateTotal().toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    متابعة الشراء
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/store/${storeId}/products`)}
                  >
                    متابعة التسوق
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">رمز القسيمة</h3>
                  <div className="flex">
                    <Input placeholder="أدخل رمز القسيمة" className="rounded-l-none" />
                    <Button className="rounded-r-none">تطبيق</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">سلة التسوق فارغة</h2>
            <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.</p>
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
