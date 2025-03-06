
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
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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

        // Get products from this store
        const { data: storeProducts, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });

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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatCurrency = (price: number) => {
    if (!storeData) return price;
    
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: storeData.currency || 'SAR',
    }).format(price);
  };

  if (loading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
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
              <div className="flex justify-center gap-4">
                <Button size="lg" className="px-6">تسوق الآن</Button>
                <Button variant="outline" size="lg" className="px-6">تواصل معنا</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto relative">
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                className="w-full pr-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
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
        <div className="container mx-auto py-16 px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">منتجاتنا المميزة</h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border">
              <p className="text-gray-500 mb-4">لا توجد منتجات متاحة حالياً</p>
              <p className="text-sm text-gray-400">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">الأكثر مبيعاً</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-primary" variant="secondary">مميز</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-lg truncate">{product.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 h-10 mt-1">
                        {product.description || "لا يوجد وصف للمنتج"}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
                      <Button size="sm" className="flex gap-1 items-center">
                        <ShoppingCart className="h-4 w-4" />
                        <span>أضف للسلة</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default Store;
