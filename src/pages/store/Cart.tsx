
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

const Cart: React.FC = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  
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
  
  // محاكاة تحميل عناصر السلة من التخزين المحلي
  useEffect(() => {
    // في تطبيق حقيقي سنقوم بتحميل السلة من localStorage أو من قاعدة البيانات
    // هنا نستخدم بيانات وهمية للعرض
    const mockCartItems: CartItem[] = [
      {
        id: "1",
        product_id: "prod-1",
        name: "قميص قطني بأكمام طويلة",
        price: 29.99,
        image_url: "https://images.unsplash.com/photo-1617713110428-29e130cc7a60?auto=format&fit=crop&q=80&w=300",
        quantity: 2
      },
      {
        id: "2",
        product_id: "prod-2",
        name: "حذاء رياضي خفيف",
        price: 59.99,
        image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=300",
        quantity: 1
      }
    ];
    
    setCartItems(mockCartItems);
  }, []);
  
  const formatCurrency = getCurrencyFormatter(storeData?.currency);
  
  // حساب المجموع الفرعي
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // رسوم الشحن (يمكن أن تكون ديناميكية بناءً على العنوان أو إجمالي الطلب)
  const shippingFee = subtotal > 100 ? 0 : 10;
  
  // المجموع الكلي
  const total = subtotal + shippingFee - discount;
  
  // تغيير كمية المنتج
  const updateItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // حذف منتج من السلة
  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success("تم حذف المنتج من السلة");
  };
  
  // تطبيق كوبون الخصم
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("الرجاء إدخال كود الخصم");
      return;
    }
    
    setIsApplyingCoupon(true);
    
    // محاكاة تحقق من كود الخصم
    setTimeout(() => {
      if (couponCode.toUpperCase() === "DISCOUNT20") {
        const discountAmount = subtotal * 0.2;
        setDiscount(discountAmount);
        toast.success("تم تطبيق كود الخصم بنجاح");
      } else {
        toast.error("كود الخصم غير صالح");
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };
  
  // الانتقال إلى صفحة الدفع
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("السلة فارغة");
      return;
    }
    
    toast.success("جاري الانتقال إلى صفحة الدفع...");
    // هنا ستكون عملية الانتقال إلى صفحة إتمام الطلب
    // navigate(`/store/${storeId}/checkout`);
  };
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <ShoppingCart className="h-6 w-6 ml-2" />
              سلة التسوق {cartItems.length > 0 && `(${cartItems.length})`}
            </h1>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/store/${storeId}/products`}>
                <ArrowRight className="h-4 w-4 ml-1" />
                متابعة التسوق
              </Link>
            </Button>
          </div>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* عناصر السلة */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    {cartItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          {/* صورة المنتج */}
                          <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* معلومات المنتج */}
                          <div className="flex-1 ml-0 sm:ml-4 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-blue-600 font-bold mt-1">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                              
                              <div className="flex items-center mt-3 sm:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="mx-3 min-w-6 text-center">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 mr-2"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {index < cartItems.length - 1 && <Separator className="my-4" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ملخص الطلب */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                  <h2 className="text-lg font-bold mb-4">ملخص الطلب</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600">مجاني</span>
                        ) : (
                          formatCurrency(shippingFee)
                        )}
                      </span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم</span>
                        <span>- {formatCurrency(discount)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="flex justify-between mb-6 font-bold text-lg">
                    <span>الإجمالي</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  {/* كود الخصم */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="كود الخصم"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon}
                      >
                        {isApplyingCoupon ? "جاري التطبيق..." : "تطبيق"}
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-green-600 text-sm mt-2">
                        تم تطبيق الخصم: {couponCode.toUpperCase()}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={proceedToCheckout}
                  >
                    <CreditCard className="h-5 w-5 ml-2" />
                    إتمام الطلب
                  </Button>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    التوصيل خلال 3-5 أيام عمل
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">سلة التسوق فارغة</h3>
              <p className="text-gray-500 mb-6">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
              <Button asChild>
                <Link to={`/store/${storeId}/products`}>
                  تصفح المنتجات
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default Cart;
