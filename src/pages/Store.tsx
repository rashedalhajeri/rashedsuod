
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import FeaturedProductsSection from "@/components/store/sections/FeaturedProductsSection";
import BestSellingProductsSection from "@/components/store/sections/BestSellingProductsSection";
import AllProductsSection from "@/components/store/sections/AllProductsSection";

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewAllBestSelling = () => {
    setActiveCategory("الأكثر مبيعاً");
  };

  // Filter products by search query
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
        {activeCategory === "جميع المنتجات" && (
          <FeaturedProductsSection 
            products={featuredProducts} 
            onViewAll={() => {}} 
          />
        )}
        
        {/* Best Selling Products Section */}
        {activeCategory === "جميع المنتجات" && (
          <BestSellingProductsSection 
            products={bestSellingProducts} 
            onViewAll={handleViewAllBestSelling} 
          />
        )}
        
        {/* All Products Section */}
        <AllProductsSection 
          products={displayProducts}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default Store;
