
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Trash, Plus, Minus, ShoppingBag, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to={`/store/${storeDomain}`} className="flex items-center text-sm text-blue-600 hover:underline">
            <ChevronRight className="h-4 w-4 ml-1" />
            <span>العودة للمتجر</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">سلة التسوق</h1>
        
        {filteredCartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">السلة فارغة</h2>
              <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
              <Button asChild>
                <Link to={`/store/${storeDomain}`}>
                  تصفح المنتجات
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {filteredCartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 space-x-reverse">
                        <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
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
                            className="font-medium hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <div className="text-gray-600 mt-1">{item.price} {storeData?.currency || "KWD"}</div>
                        </div>
                        
                        <div className="flex items-center border rounded-md">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="font-medium text-right min-w-[80px]">
                          {(item.price * item.quantity).toFixed(2)} {storeData?.currency || "KWD"}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between px-6 py-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من رغبتك في إفراغ السلة؟")) {
                        clearCart();
                        toast.info("تم إفراغ السلة");
                      }
                    }}
                  >
                    إفراغ السلة
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to={`/store/${storeDomain}`}>
                      متابعة التسوق
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
                  
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
                </CardContent>
                <CardFooter className="px-6 py-4 border-t">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    إتمام الطلب
                  </Button>
                </CardFooter>
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
