
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";

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
          .maybeSingle();
        
        if (storeError) {
          console.error("Error fetching store data:", storeError);
          throw storeError;
        }
        
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
  const currency = storeData?.currency || "KWD";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <CartHeader storeDomain={storeDomain || ""} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        {filteredCartItems.length === 0 ? (
          <EmptyCart storeDomain={storeDomain || ""} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsList 
                items={filteredCartItems}
                storeDomain={storeDomain || ""}
                currency={currency}
                updateItemQuantity={updateItemQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            </div>
            
            <div>
              <CartSummary 
                totalPrice={totalPrice(filteredCartItems)}
                currency={currency}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default CartPage;
