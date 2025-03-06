
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
import { Check, ChevronRight, CreditCard, Banknote, ArrowLeft, ShoppingCart, User, Phone, HomeIcon, MapPin, Mail, ClipboardList } from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
        
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link to={`/store/${storeDomain}`} className="hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-primary">إتمام الطلب</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              إتمام الطلب <ShoppingCart className="inline-block h-7 w-7 mr-2 text-primary" />
            </h1>
          </div>
        </div>
        
        <main className="flex-grow container mx-auto py-8 px-4">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-semibold mb-4">السلة فارغة</h2>
              <p className="text-gray-500 mb-6">لا يمكن إتمام الطلب، السلة فارغة</p>
              <Button asChild size="lg" className="gap-2">
                <Link to={`/store/${storeDomain}`}>
                  <ArrowLeft className="h-5 w-5" />
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
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link to={`/store/${storeDomain}`} className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/store/${storeDomain}/cart`} className="hover:text-primary transition-colors">
              سلة التسوق
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-primary">إتمام الطلب</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            إتمام الطلب <ClipboardList className="inline-block h-7 w-7 mr-2 text-primary" />
          </h1>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  معلومات الشخصية
                </h2>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} id="checkout-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">الاسم الكامل <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className="pr-10"
                          required
                          placeholder="محمد أحمد"
                        />
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">رقم الهاتف <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          className="pr-10"
                          required
                          placeholder="5xxxxxxxx"
                          type="tel"
                        />
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          className="pr-10"
                          placeholder="example@example.com"
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  عنوان التوصيل
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">العنوان التفصيلي <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="المنطقة، الشارع، البناية، الطابق، رقم الشقة"
                      className="resize-none pr-10 pt-3"
                    />
                    <HomeIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
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
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  طريقة الدفع
                </h2>
              </div>
              <CardContent className="p-6">
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 space-x-reverse border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
                      <div className="bg-green-100 p-2 rounded-full ml-3">
                        <Banknote className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium">الدفع عند الاستلام</span>
                        <p className="text-sm text-gray-500">ادفع نقداً عند استلام الطلب</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 space-x-reverse border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <RadioGroupItem value="card_payment" id="card_payment" />
                    <Label htmlFor="card_payment" className="flex items-center cursor-pointer">
                      <div className="bg-blue-100 p-2 rounded-full ml-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium">بطاقة ائتمان أو بطاقة مدى</span>
                        <p className="text-sm text-gray-500">سيتم توجيهك لبوابة الدفع بعد تأكيد الطلب</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="flex items-center justify-center gap-3 mt-6">
                  <img src="/payment-icons/visa-master.png" alt="Visa/Mastercard" className="h-8" />
                  <img src="/payment-icons/mada.png" alt="Mada" className="h-7" />
                  <img src="/payment-icons/knet.png" alt="KNet" className="h-7" />
                  <img src="/payment-icons/benefit.png" alt="Benefit" className="h-6" />
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:hidden">
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">ملخص الطلب</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="text-green-600">مجاني</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>الإجمالي</span>
                      <span className="text-primary">{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    form="checkout-form"
                    className="w-full mt-6 py-6 text-base shadow-lg hover:shadow-xl transition-all" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-pulse">جاري تأكيد الطلب...</span>
                      </>
                    ) : (
                      "تأكيد الطلب"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">المنتجات ({filteredCartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                </div>
                <CardContent className="p-0 max-h-80 overflow-y-auto">
                  <div className="divide-y">
                    {filteredCartItems.map(item => (
                      <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden border flex-shrink-0">
                            <img 
                              src={item.image_url || "/placeholder.svg"} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-gray-600 text-sm">
                                {item.quantity} × {item.price} {storeData?.currency || "KWD"}
                              </div>
                              
                              <div className="font-semibold text-primary">
                                {(item.price * item.quantity).toFixed(2)} {storeData?.currency || "KWD"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">ملخص الطلب</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span>{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="text-green-600">مجاني</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>الإجمالي</span>
                      <span className="text-primary">{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmit}
                    className="w-full mt-6 py-6 text-base shadow-lg hover:shadow-xl transition-all" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-pulse">جاري تأكيد الطلب...</span>
                      </>
                    ) : (
                      "تأكيد الطلب"
                    )}
                  </Button>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <Link to={`/store/${storeDomain}/cart`} className="text-primary hover:underline inline-flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      العودة للسلة
                    </Link>
                  </div>
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
