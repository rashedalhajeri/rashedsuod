
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import ProductGrid from "@/components/store/ProductGrid";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("جميع المنتجات");

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter products by category
  const getCategoryProducts = () => {
    if (activeCategory === "جميع المنتجات") return filteredProducts;
    if (activeCategory === "العروض") 
      return filteredProducts.filter(p => p.discount_percentage > 0 || (p.original_price && p.original_price > p.price));
    if (activeCategory === "الأكثر مبيعاً") 
      return bestSellingProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    if (activeCategory === "الجديد") 
      return filteredProducts.slice(0, 8); // Most recent products
    
    // Category filter (would use actual categories from database in production)
    return filteredProducts;
  };

  const displayProducts = getCategoryProducts();

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
        {/* Hero Banner */}
        <StoreBanner 
          storeName={storeData?.store_name}
          storeDescription={storeData?.description}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        
        {/* Category Quick Links */}
        <CategoryNavigation 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          categories={["جميع المنتجات", "الأكثر مبيعاً", "العروض", "الجديد", "الأكسسوارات"]}
        />
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && activeCategory === "جميع المنتجات" && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="store-section-title">منتجات مميزة</h2>
                <Button variant="ghost" className="text-primary hover:bg-primary/5">عرض الكل</Button>
              </div>
              
              <ProductGrid products={featuredProducts} />
            </div>
          </section>
        )}
        
        {/* Best Selling Products */}
        {bestSellingProducts.length > 0 && activeCategory === "جميع المنتجات" && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="store-section-title">الأكثر مبيعاً</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary hover:bg-primary/5"
                  onClick={() => setActiveCategory("الأكثر مبيعاً")}
                >
                  عرض الكل
                </Button>
              </div>
              
              <ProductGrid products={bestSellingProducts} />
            </div>
          </section>
        )}
        
        {/* All Products Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="store-section-title">
                {activeCategory === "جميع المنتجات" ? "جميع المنتجات" : activeCategory}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {displayProducts.length} منتج
                </span>
              </div>
            </div>
            
            {searchQuery && (
              <p className="mb-6 text-gray-500">
                نتائج البحث عن: <span className="font-medium text-primary">{searchQuery}</span>
              </p>
            )}
            
            {displayProducts.length > 0 ? (
              <ProductGrid products={displayProducts} />
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
