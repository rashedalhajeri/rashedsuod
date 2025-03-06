import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
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
        setProducts(storeProducts || []);
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
  if (loading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  return <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow">
        {/* Hero Banner - Enhanced with gradient and image */}
        <div className="bg-gradient-to-r from-black/80 to-black/60 text-white relative" style={{
        backgroundImage: storeData?.banner_url ? `url(${storeData.banner_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}>
          
        </div>
        
        {/* Category Quick Links - New section */}
        <div className="bg-gray-50">
          <div className="container mx-auto py-6 px-4 overflow-x-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Button variant="outline" className="rounded-full">جميع المنتجات</Button>
              </div>
              <div className="flex-shrink-0">
                <Button variant="outline" className="rounded-full">الأكثر مبيعاً</Button>
              </div>
              <div className="flex-shrink-0">
                <Button variant="outline" className="rounded-full">العروض</Button>
              </div>
              <div className="flex-shrink-0">
                <Button variant="outline" className="rounded-full">الجديد</Button>
              </div>
              <div className="flex-shrink-0">
                <Button variant="outline" className="rounded-full">الأكسسوارات</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-2xl font-bold mb-6">استكشف منتجاتنا</h2>
          
          {filteredProducts.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <p className="text-gray-500 mb-4">لا توجد منتجات متاحة حالياً</p>
              <p className="text-sm text-gray-400">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
            </div> : <ProductGrid products={filteredProducts} />}
        </div>
        
        {/* Featured Section - New */}
        {products.length > 0 && <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">منتجات مميزة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(product => <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 h-10">
                        {product.description || "لا يوجد وصف للمنتج"}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <p className="font-bold text-lg">{product.price} ر.س</p>
                      <Badge variant="secondary">جديد</Badge>
                    </CardFooter>
                  </Card>)}
              </div>
            </div>
          </div>}
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>;
};
export default Store;