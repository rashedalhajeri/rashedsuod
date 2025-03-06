
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { LogIn, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import LoginForm from "@/components/checkout/LoginForm";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import CartItemsPreview from "@/components/checkout/CartItemsPreview";
import EmptyCheckout from "@/components/checkout/EmptyCheckout";

const CheckoutPage = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "login">("guest");
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "cash_on_delivery",
    notes: ""
  });
  
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        
        // Get store by domain name
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeDomain)
          .maybeSingle();
        
        if (storeError) throw storeError;
        if (!store) {
          setError("لم يتم العثور على المتجر");
          return;
        }
        
        setStoreData(store);
        
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("حدث خطأ أثناء تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };
    
    if (storeDomain) {
      fetchStoreData();
    }
    
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        setUserData(user);
        
        // Pre-fill form with user data if available
        try {
          const { data: profile } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
            
          if (profile) {
            setFormData(prev => ({
              ...prev,
              customerName: profile.name || prev.customerName,
              customerEmail: user.email || prev.customerEmail,
              customerPhone: profile.phone || prev.customerPhone,
              shippingAddress: profile.city || prev.shippingAddress,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              customerEmail: user.email || prev.customerEmail,
            }));
          }
        } catch (err) {
          console.error("Error fetching customer profile:", err);
        }
      }
    };
    
    checkAuthStatus();
  }, [storeDomain]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setIsAuthenticated(true);
        setUserData(data.user);
        setFormData(prev => ({
          ...prev,
          customerEmail: data.user?.email || prev.customerEmail,
        }));
        toast.success("تم تسجيل الدخول بنجاح");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      toast.error("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } else {
      setIsAuthenticated(false);
      setUserData(null);
      toast.success("تم تسجيل الخروج بنجاح");
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };
  
  const handleSubmit = async () => {
    // Form validation
    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    const filteredCartItems = cart.filter(item => !storeData || item.store_id === storeData.id);
    if (filteredCartItems.length === 0) {
      toast.error("السلة فارغة");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Generate order number
      const orderNumber = `${storeData.domain_name.substring(0, 3).toUpperCase()}${Date.now().toString().substring(6)}`;
      
      // Create the order
      const order = {
        store_id: storeData.id,
        order_number: orderNumber,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail || null,
        customer_phone: formData.customerPhone,
        shipping_address: formData.shippingAddress,
        payment_method: formData.paymentMethod,
        status: "processing",
        total: totalPrice(filteredCartItems),
        notes: formData.notes || null
      };
      
      // Prepare order items
      const items = filteredCartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));
      
      // Call the edge function to create the order
      const { data, error: createOrderError } = await supabase.functions.invoke('create-order', {
        body: { order, items }
      });
      
      if (createOrderError) throw createOrderError;
      
      // Store customer information if user is authenticated
      if (isAuthenticated && userData && formData.customerEmail) {
        try {
          // Check if customer exists
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('email', formData.customerEmail)
            .eq('store_id', storeData.id)
            .maybeSingle();
            
          if (!existingCustomer) {
            // Create new customer
            await supabase.from('customers').insert([
              {
                name: formData.customerName,
                email: formData.customerEmail,
                phone: formData.customerPhone,
                city: formData.shippingAddress,
                store_id: storeData.id,
                total_orders: 1,
                total_spent: totalPrice(filteredCartItems)
              }
            ]);
          }
        } catch (err) {
          console.error("Error storing customer information:", err);
          // Non-blocking error, continue with checkout
        }
      }
      
      // Order created successfully
      clearCart(); // Clear the cart
      
      // Redirect to success page
      navigate(`/store/${storeDomain}/order-success/${data.order.id}`);
      
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingState message="جاري تحميل الصفحة..." />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <StoreNavbar storeName={storeDomain?.charAt(0).toUpperCase() + storeDomain?.slice(1) || "المتجر"} logoUrl={null} />
        <div className="flex-grow container mx-auto py-8 px-4">
          <ErrorState 
            title="خطأ" 
            message={error} 
            onRetry={() => window.location.reload()}
          />
        </div>
        <StoreFooter storeName={storeDomain?.charAt(0).toUpperCase() + storeDomain?.slice(1) || "المتجر"} />
      </div>
    );
  }
  
  const filteredCartItems = cart.filter(item => !storeData || item.store_id === storeData.id);
  
  if (filteredCartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
        <CheckoutHeader storeDomain={storeDomain || ""} />
        <main className="flex-grow container mx-auto py-8 px-4">
          <EmptyCheckout storeDomain={storeDomain || ""} />
        </main>
        <StoreFooter storeName={storeData?.store_name} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      <CheckoutHeader storeDomain={storeDomain || ""} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Section */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  معلومات الشخصية
                </h2>
              </div>
              <CardContent className="p-6">
                {isAuthenticated ? (
                  <CustomerInfoForm 
                    formData={formData}
                    isAuthenticated={isAuthenticated}
                    userData={userData}
                    handleChange={handleChange}
                    handleLogout={handleLogout}
                  />
                ) : (
                  <Tabs value={checkoutMode} onValueChange={(value) => setCheckoutMode(value as "guest" | "login")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="guest" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span>الدفع كزائر</span>
                      </TabsTrigger>
                      <TabsTrigger value="login" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        <span>تسجيل الدخول</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="guest">
                      <CustomerInfoForm 
                        formData={formData}
                        isAuthenticated={false}
                        userData={null}
                        handleChange={handleChange}
                        handleLogout={handleLogout}
                      />
                      
                      <div className="mt-4 text-sm text-gray-500">
                        لديك حساب بالفعل؟{" "}
                        <button
                          type="button"
                          onClick={() => setCheckoutMode("login")}
                          className="text-primary hover:underline"
                        >
                          تسجيل الدخول
                        </button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="login">
                      <LoginForm 
                        loginData={loginData}
                        loginError={loginError}
                        submitting={submitting}
                        storeDomain={storeDomain || ""}
                        handleLoginDataChange={handleLoginDataChange}
                        handleLogin={handleLogin}
                        setCheckoutMode={setCheckoutMode}
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
            
            {/* Shipping Address Section */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  عنوان التوصيل
                </h2>
              </div>
              <CardContent className="p-6">
                <ShippingAddressForm 
                  formData={formData} 
                  handleChange={handleChange} 
                />
              </CardContent>
            </Card>
            
            {/* Payment Method Section */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  طريقة الدفع
                </h2>
              </div>
              <CardContent className="p-6">
                <PaymentMethodSelector 
                  selectedMethod={formData.paymentMethod}
                  onMethodChange={handlePaymentMethodChange}
                />
              </CardContent>
            </Card>
            
            {/* Mobile Order Summary (visible only on mobile) */}
            <div className="lg:hidden">
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">ملخص الطلب</h2>
                </div>
                <CardContent className="p-6">
                  <OrderSummary 
                    totalAmount={totalPrice(filteredCartItems)}
                    currency={storeData?.currency || "KWD"}
                    submitting={submitting}
                    storeDomain={storeDomain || ""}
                    onSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Sidebar: Cart and Order Summary */}
          <div>
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Cart Items Preview */}
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">المنتجات ({filteredCartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                </div>
                <CardContent className="p-0 max-h-80 overflow-y-auto">
                  <CartItemsPreview 
                    items={filteredCartItems}
                    currency={storeData?.currency || "KWD"}
                  />
                </CardContent>
              </Card>
              
              {/* Order Summary - Desktop */}
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">ملخص الطلب</h2>
                </div>
                <CardContent className="p-6">
                  <OrderSummary 
                    totalAmount={totalPrice(filteredCartItems)}
                    currency={storeData?.currency || "KWD"}
                    submitting={submitting}
                    storeDomain={storeDomain || ""}
                    onSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default CheckoutPage;
