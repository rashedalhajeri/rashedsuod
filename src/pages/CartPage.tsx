
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Trash, Plus, Minus, ShoppingBag, ChevronRight, ArrowLeft, ShoppingCart } from "lucide-react";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, updateItemQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  
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
  
  const handleCheckout = () => {
    navigate(`/store/${storeDomain}/checkout`);
  };
  
  if (loading) {
    return <LoadingState message="جاري تحميل السلة..." />;
  }
  
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  
  const filteredCartItems = cart.filter(item => item.store_id === storeData.id);

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
            <span className="font-medium text-primary">سلة التسوق</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            سلة التسوق <ShoppingCart className="inline-block h-7 w-7 mr-2 text-primary" />
          </h1>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto py-8 px-4">
        {filteredCartItems.length === 0 ? (
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <ShoppingBag className="h-16 w-16 text-primary/70" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">السلة فارغة</h2>
              <p className="text-gray-500 mb-8 max-w-md text-center">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. استعرض المنتجات وأضف ما يناسبك.
              </p>
              <Button asChild size="lg" className="gap-2 font-medium">
                <Link to={`/store/${storeDomain}`}>
                  <ArrowLeft className="h-5 w-5" />
                  تصفح المنتجات
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-lg">
                    المنتجات ({filteredCartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                  <Button 
                    variant="ghost" 
                    className="text-gray-500 hover:text-red-500 transition-colors gap-1"
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من رغبتك في إفراغ السلة؟")) {
                        clearCart();
                        toast.info("تم إفراغ السلة");
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="text-sm">إفراغ السلة</span>
                  </Button>
                </div>
                
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredCartItems.map(item => (
                      <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4 space-x-reverse">
                          <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
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
                            <Link 
                              to={`/store/${storeDomain}/product/${item.id}`} 
                              className="font-medium text-lg hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            
                            <div className="flex justify-between items-end mt-2">
                              <div className="flex items-center mt-3">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8 rounded-r-md"
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="h-8 px-4 flex items-center justify-center border-t border-b text-sm">
                                  {item.quantity}
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="space-y-1 text-left">
                                <div className="text-gray-500 text-sm">سعر القطعة</div>
                                <div className="font-semibold">{item.price.toFixed(2)} {storeData?.currency || "KWD"}</div>
                              </div>
                              
                              <div className="space-y-1 text-left">
                                <div className="text-gray-500 text-sm">المجموع</div>
                                <div className="font-bold text-primary">
                                  {(item.price * item.quantity).toFixed(2)} {storeData?.currency || "KWD"}
                                </div>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                  >
                    <Link to={`/store/${storeDomain}`}>
                      <ArrowLeft className="h-4 w-4" />
                      متابعة التسوق
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="border-0 shadow-md sticky top-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6 border-b pb-3">ملخص الطلب</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-medium">{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="text-green-600 font-medium">مجاني</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">الإجمالي</span>
                      <span className="font-bold text-primary">{totalPrice(filteredCartItems).toFixed(2)} {storeData?.currency || "KWD"}</span>
                    </div>
                    
                    <div className="pt-3">
                      <Button 
                        className="w-full py-6 text-base shadow-lg hover:shadow-xl transition-all" 
                        size="lg"
                        onClick={handleCheckout}
                      >
                        إتمام الطلب
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <img src="/payment-icons/visa-master.png" alt="Visa/Mastercard" className="h-6" />
                        <img src="/payment-icons/mada.png" alt="Mada" className="h-5" />
                        <img src="/payment-icons/knet.png" alt="KNet" className="h-5" />
                        <img src="/payment-icons/benefit.png" alt="Benefit" className="h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default CartPage;
