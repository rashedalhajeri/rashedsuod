import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import ProductGrid from "@/components/store/ProductGrid";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
const Store = () => {
  const {
    storeDomain
  } = useParams<{
    storeDomain: string;
  }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    toast
  } = useToast();
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);

        // Get store by domain name
        const {
          data: store,
          error: storeError
        } = await supabase.from('stores').select('*').eq('domain_name', storeDomain).single();
        if (storeError) throw storeError;
        if (!store) {
          setError("لم يتم العثور على المتجر");
          return;
        }
        setStoreData(store);

        // Get products from this store
        const {
          data: storeProducts,
          error: productsError
        } = await supabase.from('products').select('*').eq('store_id', store.id).order('created_at', {
          ascending: false
        });
        if (productsError) throw productsError;
        const allProducts = storeProducts || [];
        setProducts(allProducts);

        // Select featured products (most recent 4)
        setFeaturedProducts(allProducts.slice(0, 4));
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
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const formatCurrency = (price: number) => {
    if (!storeData) return price;
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: storeData.currency || 'SAR'
    }).format(price);
  };
  if (loading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  return <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-gray-50 py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{storeData?.store_name}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {storeData?.description || `متجر ${storeData?.store_name} الإلكتروني، نوفر لكم أفضل المنتجات`}
              </p>
              
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        
        
        {/* Category Quick Links */}
        <div className="bg-white py-8">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="rounded-full">جميع المنتجات</Button>
              <Button variant="outline" className="rounded-full">الأكثر مبيعاً</Button>
              <Button variant="outline" className="rounded-full">العروض</Button>
              <Button variant="outline" className="rounded-full">الجديد</Button>
              <Button variant="outline" className="rounded-full">الأكسسوارات</Button>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0}
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>;
};
export default Store;