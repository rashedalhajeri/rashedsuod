
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingBag, X, CreditCard, Truck } from "lucide-react";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { useShoppingCart, CartItem } from "@/hooks/use-shopping-cart";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const { cartItems, updateQuantity, removeItem, clearCart, subtotal } = useShoppingCart();
  const [couponCode, setCouponCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Format currency based on store settings
  const formatCurrency = storeData 
    ? getCurrencyFormatter(storeData.currency) 
    : (price: number) => `${price.toFixed(2)} KWD`;
    
  // Calculate shipping fee (placeholder)
  const shippingFee = 2;
  
  // Calculate total
  const total = subtotal + shippingFee;
  
  // Apply coupon
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("الرجاء إدخال كود الخصم");
      return;
    }
    
    // In a real app, you would validate the coupon code with the backend
    toast.error("كود الخصم غير صالح");
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }
    
    setIsCheckingOut(true);
    
    // Simulate API call
    setTimeout(() => {
      navigate("/store/checkout");
      setIsCheckingOut(false);
    }, 1000);
  };
  
  return (
    <StorefrontLayout storeId={storeData?.id}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">سلة التسوق</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/store" className="hover:text-primary">الرئيسية</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">سلة التسوق</span>
          </div>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">المنتجات</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500"
                    onClick={clearCart}
                  >
                    إفراغ السلة
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      formatCurrency={formatCurrency}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}
                </div>
              </div>
              
              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={() => navigate('/store/products')}
                className="mb-8"
              >
                <ChevronLeft className="ml-2 h-4 w-4" />
                متابعة التسوق
              </Button>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium">{formatCurrency(shippingFee)}</span>
                  </div>
                  {/* Add discount display here if applied */}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="كود الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                    >
                      تطبيق
                    </Button>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <Button
                  className="w-full mb-4"
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? (
                    <div className="flex items-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      جاري الإتمام...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      إتمام الشراء
                    </>
                  )}
                </Button>
                
                {/* Secure Checkout Note */}
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    معاملات آمنة ومشفرة
                  </div>
                  <p>نقبل مختلف وسائل الدفع بما في ذلك بطاقات الائتمان والدفع عند الاستلام</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-6">
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.
            </p>
            <Button
              onClick={() => navigate('/store/products')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              تصفح المنتجات
            </Button>
          </div>
        )}
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="bg-primary-50 p-3 rounded-full mr-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">توصيل سريع</h3>
              <p className="text-sm text-gray-600">شحن سريع لجميع الطلبات</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="bg-primary-50 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">دفع آمن</h3>
              <p className="text-sm text-gray-600">معاملات مالية آمنة ومشفرة</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="bg-primary-50 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">ضمان الجودة</h3>
              <p className="text-sm text-gray-600">سياسة إرجاع مرنة خلال 14 يوم</p>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

// Cart Item Row Component
const CartItemRow = ({ 
  item, 
  formatCurrency,
  updateQuantity,
  removeItem
}: { 
  item: CartItem; 
  formatCurrency: (price: number) => string;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}) => {
  return (
    <motion.div
      className="flex items-center border-b border-gray-100 pb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
    >
      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-grow mr-4">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-primary-700 font-bold">{formatCurrency(item.price)}</p>
      </div>
      
      <div className="flex items-center mr-4">
        <button
          type="button"
          className="p-1 text-gray-500 hover:text-primary-600"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
        <button
          type="button"
          className="p-1 text-gray-500 hover:text-primary-600"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="font-medium text-left w-24 mr-4">
        {formatCurrency(item.price * item.quantity)}
      </div>
      
      <button
        type="button"
        className="p-1 text-gray-400 hover:text-red-500"
        onClick={() => removeItem(item.id)}
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export default CartPage;
