
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const OrderSuccessPage = () => {
  const { orderId, storeDomain } = useParams<{ orderId: string; storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
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
        
        // Get order data
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              *,
              product:products(name, image_url)
            )
          `)
          .eq('id', orderId)
          .eq('store_id', store.id)
          .single();
        
        if (orderError) throw orderError;
        if (!order) {
          setError("لم يتم العثور على الطلب");
          return;
        }
        
        setOrderData(order);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId && storeDomain) {
      fetchData();
    }
  }, [orderId, storeDomain]);
  
  if (loading) {
    return <LoadingState message="جاري تحميل الصفحة..." />;
  }
  
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  
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
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">تم استلام طلبك بنجاح!</h1>
            <p className="text-gray-600 mb-6">شكراً لك على طلبك. سنقوم بمعالجته في أقرب وقت ممكن.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
              <div className="font-medium">رقم الطلب: {orderData.order_number}</div>
            </div>
            
            <div className="max-w-lg mx-auto text-right mb-8">
              <h3 className="font-semibold text-lg mb-2">تفاصيل الطلب:</h3>
              
              <div className="space-y-1 mb-4">
                <div><span className="font-medium">الاسم:</span> {orderData.customer_name}</div>
                {orderData.customer_phone && <div><span className="font-medium">رقم الهاتف:</span> {orderData.customer_phone}</div>}
                {orderData.customer_email && <div><span className="font-medium">البريد الإلكتروني:</span> {orderData.customer_email}</div>}
                <div><span className="font-medium">عنوان التوصيل:</span> {orderData.shipping_address}</div>
                <div><span className="font-medium">طريقة الدفع:</span> {orderData.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</div>
                <div><span className="font-medium">المبلغ الإجمالي:</span> {orderData.total} {storeData?.currency || "KWD"}</div>
              </div>
              
              <h4 className="font-medium mb-2">المنتجات:</h4>
              <ul className="list-disc list-inside space-y-1">
                {orderData.items.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name} ({item.quantity} قطعة) - {item.total_price} {storeData?.currency || "KWD"}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-x-4 space-x-reverse">
              <Button asChild>
                <Link to={`/store/${storeDomain}`}>
                  العودة للمتجر
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default OrderSuccessPage;
