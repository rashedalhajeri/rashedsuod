
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
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSection, setActiveSection] = useState("جميع المنتجات");

  // الأقسام الثابتة في المتجر
  const sections = ["جميع المنتجات", "الأكثر مبيعاً", "العروض", "الجديد"];

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

        // Fetch store categories
        const { data: storeCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .eq('store_id', store.id)
          .order('sort_order', { ascending: true });
        
        if (categoriesError) throw categoriesError;
        
        // Set categories from database
        const dbCategories = storeCategories?.map(cat => cat.name) || [];
        setCategories(dbCategories);
        
        // Set default active category/section
        setActiveSection("جميع المنتجات");
        setActiveCategory(dbCategories.length > 0 ? "" : "");

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
    // إذا كانت الفئة المختارة من الأقسام
    if (sections.includes(category)) {
      setActiveSection(category);
      setActiveCategory("");
    } else {
      // إذا كانت فئة حقيقية
      setActiveCategory(category);
      setActiveSection("");
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setActiveCategory("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewAllBestSelling = () => {
    setActiveSection("الأكثر مبيعاً");
    setActiveCategory("");
  };

  // Filter products by search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter products by category or section
  const getDisplayProducts = () => {
    // أولاً نفلتر حسب البحث
    let filtered = filteredProducts;
    
    // ثم حسب القسم أو الفئة
    if (activeCategory) {
      // فلترة حسب الفئة الحقيقية (لاحقاً سيتم ربطها بحقل التصنيف في المنتجات)
      return filtered;
    } else if (activeSection) {
      // فلترة حسب القسم
      if (activeSection === "جميع المنتجات") return filtered;
      if (activeSection === "العروض") 
        return filtered.filter(p => p.discount_percentage > 0 || (p.original_price && p.original_price > p.price));
      if (activeSection === "الأكثر مبيعاً") 
        return bestSellingProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      if (activeSection === "الجديد") 
        return filtered.slice(0, 8); // Most recent products
    }
    
    return filtered;
  };

  const displayProducts = getDisplayProducts();

  if (loading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto px-4 pt-16 categories-content"> 
        {/* App Banner - Now conditional based on bannerUrl existence */}
        <StoreBanner 
          storeName={storeData?.store_name}
          storeDescription={storeData?.description}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          logoUrl={storeData?.logo_url}
          bannerUrl={storeData?.banner_url}
        />
        
        {/* Category Quick Links - نمرر كلا من الأقسام والفئات */}
        <CategoryNavigation 
          activeCategory={activeCategory || activeSection}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          sections={sections}
        />
        
        {/* Featured Products Section */}
        {activeSection === "جميع المنتجات" && !activeCategory && (
          <FeaturedProductsSection 
            products={featuredProducts} 
            onViewAll={() => {}} 
          />
        )}
        
        {/* Best Selling Products Section */}
        {activeSection === "جميع المنتجات" && !activeCategory && (
          <BestSellingProductsSection 
            products={bestSellingProducts} 
            onViewAll={handleViewAllBestSelling} 
          />
        )}
        
        {/* All Products Section */}
        <AllProductsSection 
          products={displayProducts}
          activeCategory={activeCategory || activeSection}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default Store;
