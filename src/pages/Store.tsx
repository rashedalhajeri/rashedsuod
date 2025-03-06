
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
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
        
        // Select best selling products (random 4 for demo)
        // In a real app, you would sort by sales count
        const randomProducts = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        setBestSellingProducts(randomProducts);
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow">
        {/* Hero Banner - تحسين مظهر البانر */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 animate-fade-in">{storeData?.store_name}</h1>
              <p className="text-xl text-gray-700 mb-8 animate-enter">
                {storeData?.description || `متجر ${storeData?.store_name} الإلكتروني، نوفر لكم أفضل المنتجات`}
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto mt-8 glass-effect rounded-full">
                <Input
                  type="search"
                  placeholder="ابحث عن منتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 pl-4 py-6 rounded-full border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-base bg-white/70 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Quick Links - تحسين فئات المنتجات */}
        <div className="bg-white py-8 border-b sticky top-16 z-20 shadow-sm">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
              <Button variant="outline" className="rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all">جميع المنتجات</Button>
              <Button variant="outline" className="rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all">الأكثر مبيعاً</Button>
              <Button variant="outline" className="rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all">العروض</Button>
              <Button variant="outline" className="rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all">الجديد</Button>
              <Button variant="outline" className="rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all">الأكسسوارات</Button>
            </div>
          </div>
        </div>
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 relative pb-2 before:absolute before:bottom-0 before:right-0 before:w-12 before:h-1 before:bg-primary">منتجات مميزة</h2>
                <Button variant="ghost" className="text-primary hover:bg-primary/5">عرض الكل</Button>
              </div>
              
              <ProductGrid products={featuredProducts} />
            </div>
          </section>
        )}
        
        {/* Best Selling Products */}
        {bestSellingProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 relative pb-2 before:absolute before:bottom-0 before:right-0 before:w-12 before:h-1 before:bg-primary">الأكثر مبيعاً</h2>
                <Button variant="ghost" className="text-primary hover:bg-primary/5">عرض الكل</Button>
              </div>
              
              <ProductGrid products={bestSellingProducts} />
            </div>
          </section>
        )}
        
        {/* All Products Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 relative pb-2 before:absolute before:bottom-0 before:right-0 before:w-12 before:h-1 before:bg-primary">جميع المنتجات</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} منتج
                </span>
              </div>
            </div>
            
            {searchQuery && (
              <p className="mb-6 text-gray-500">
                نتائج البحث عن: <span className="font-medium text-primary">{searchQuery}</span>
              </p>
            )}
            
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? `لا توجد نتائج مطابقة لـ "${searchQuery}"`
                    : "لا توجد منتجات متاحة حالياً"}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="mt-4"
                  >
                    عرض جميع المنتجات
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default Store;
