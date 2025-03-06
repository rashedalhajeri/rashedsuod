import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/navbar/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import { motion } from "framer-motion";
import { ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  store_id: string;
  image_url?: string;
  additional_images?: any;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

interface CategoryDetails {
  id: string;
  name: string;
  description?: string;
  store_id: string;
}

const CategoryPage = () => {
  const { storeDomain, categoryName } = useParams<{ storeDomain: string; categoryName: string }>();
  const { storeData, isLoading, error } = useStoreData();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [productNames, setProductNames] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (storeData?.id && categoryName) {
      const fetchCategoryData = async () => {
        setIsLoadingProducts(true);
        
        try {
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('name')
            .eq('store_id', storeData.id);
            
          if (categoriesData) {
            setCategories(categoriesData.map(cat => cat.name));
          }
          
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('store_id', storeData.id)
            .ilike('name', categoryName)
            .single();
            
          setCategoryDetails(categoryData);
          
          if (categoryData) {
            const { data: productsData } = await supabase
              .from('products')
              .select('*')
              .eq('store_id', storeData.id)
              .eq('category_id', categoryData.id);
            
            setProducts(productsData || []);
            
            if (productsData && productsData.length > 0) {
              setProductNames(productsData.map(product => product.name));
            }
          } else {
            setProducts([]);
          }
        } catch (err) {
          console.error("Error fetching category data:", err);
        } finally {
          setIsLoadingProducts(false);
        }
      };
      
      fetchCategoryData();
    }
  }, [storeData, categoryName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleCategoryChange = (category: string) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      navigate(`/store/${storeDomain}`);
    } else {
      navigate(`/store/${storeDomain}/category/${encodeURIComponent(category.toLowerCase())}`);
    }
  };
  
  const handleSectionChange = (section: string) => {
    console.log("Section changed:", section);
  };
  
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) 
    : products;

  const handleNavigateToAllDeals = () => {
    navigate(`/store/${storeDomain}`);
  };

  if (isLoading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }
  
  const headerTitle = categoryDetails?.name || "جميع الصفقات";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-gradient-to-l from-blue-500 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mt-20 -mr-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -ml-16 blur-lg"></div>
        
        <div className="container mx-auto px-4 py-5 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/store/${storeDomain}/cart`} className="block">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </Link>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button 
                variant="ghost" 
                className="text-white bg-white/10 hover:bg-white/20 p-0 h-9 w-9 rounded-full"
                onClick={handleNavigateToAllDeals}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <Link to={`/store/${storeDomain}/login`} className="block">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
          
          <div className="text-center py-3">
            <h1 className="text-2xl font-bold text-white tracking-wide mb-1">{headerTitle}</h1>
            <div className="h-1 w-20 bg-white/30 rounded-full mx-auto"></div>
          </div>
        </div>
        
        <div className="h-5 bg-gray-50 rounded-t-3xl -mb-1"></div>
      </header>
      
      <motion.div 
        className="container mx-auto px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            productNames={productNames}
          />
        </div>
        
        <CategoryNavigation
          categories={categories}
          sections={sections}
          activeCategory={categoryName || ""}
          activeSection=""
          onCategoryChange={handleCategoryChange}
          onSectionChange={handleSectionChange}
          storeDomain={storeDomain}
        />
        
        <div className="mt-6">
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">لم نتمكن من العثور على منتجات في هذه الفئة</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryPage;
