
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, CreditCard, Banknote } from "lucide-react";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CheckoutPage = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
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
          .single();
        
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
  }, [storeDomain]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    const filteredCartItems = cart.filter(item => item.store_id === storeData.id);
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
    return <ErrorState title="خطأ" message={error} />;
  }
  
  const filteredCartItems = cart.filter(item => item.store_id === storeData.id);
  
  if (filteredCartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
        
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link to={`/store/${storeDomain}`} className="flex items-center text-sm text-blue-600 hover:underline">
              <ChevronRight className="h-4 w-4 ml-1" />
              <span>العودة للمتجر</span>
            </Link>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-4">السلة فارغة</h2>
              <p className="text-gray-500 mb-6">لا يمكن إتمام الطلب، السلة فارغة</p>
              <Button asChild>
                <Link to={`/store/${storeDomain}`}>
                  تصفح المنتجات
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        
        <StoreFooter storeName={storeData?.store_name} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to={`/store/${storeDomain}/cart`} className="flex items-center text-sm text-blue-600 hover:underline">
            <ChevronRight className="h-4 w-4 ml-1" />
            <span>العودة للسلة</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">معلومات التوصيل</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName">الاسم الكامل <span className="text-red-500">*</span></Label>
                          <Input
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                          <Input
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone">رقم الهاتف <span className="text-red-500">*</span></Label>
                          <Input
                            id="customerPhone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="shippingAddress">عنوان التوصيل <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="shippingAddress"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleChange}
                          required
                          rows={3}
                        />
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="notes">ملاحظات للطلب</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={2}
                          placeholder="أي تعليمات إضافية للتوصيل أو الطلب؟"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">طريقة الدفع</h3>
                      
                      <RadioGroup 
                        value={formData.paymentMethod} 
                        onValueChange={handlePaymentMethodChange}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                          <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
                            <Banknote className="ml-2 h-5 w-5 text-gray-600" />
                            <div>
                              <span className="font-medium">الدفع عند الاستلام</span>
                              <p className="text-sm text-gray-500">ادفع نقداً عند استلام الطلب</p>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <RadioGroupItem value="card_payment" id="card_payment" />
                          <Label htmlFor="card_payment" className="flex items-center cursor-pointer">
                            <CreditCard className="ml-2 h-5 w-5 text-gray-600" />
                            <div>
                              <span className="font-medium">بطاقة ائتمان أو بطاقة مدى</span>
                              <p className="text-sm text-gray-500">سيتم توجيهك لبوابة الدفع بعد تأكيد الطلب</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="lg:hidden">
                      <Separator className="my-4" />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">إجمالي ({filteredCartItems.reduce((acc, item) => acc + item.quantity, 0)} منتجات)</span>
                          <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">الشحن</span>
                          <span>مجاني</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-semibold text-lg">
                          <span>الإجمالي</span>
                          <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6">
                  {filteredCartItems.map(item => (
                    <div key={item.id} className="flex items-start">
                      <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.image_url || "/placeholder.svg"} 
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow mr-3">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="text-gray-600 text-sm">
                          {item.quantity} × {item.price} {storeData?.currency || "KWD"}
                        </div>
                      </div>
                      
                      <div className="font-medium text-sm">
                        {(item.price * item.quantity).toFixed(2)} {storeData?.currency || "KWD"}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">إجمالي ({filteredCartItems.reduce((acc, item) => acc + item.quantity, 0)} منتجات)</span>
                    <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span>مجاني</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>الإجمالي</span>
                    <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default CheckoutPage;
