
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import StoreLayout from "@/components/store/StoreLayout";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/navbar/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import { motion } from "framer-motion";
import { ShoppingCart, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the Product interface to match what we're getting from Supabase
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

  // Fetch store data and category products
  useEffect(() => {
    if (storeData?.id && categoryName) {
      const fetchCategoryData = async () => {
        setIsLoadingProducts(true);
        
        try {
          // Get all categories for the store
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('name')
            .eq('store_id', storeData.id);
            
          if (categoriesData) {
            setCategories(categoriesData.map(cat => cat.name));
          }
          
          // Get category details first
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('store_id', storeData.id)
            .ilike('name', categoryName)
            .single();
            
          setCategoryDetails(categoryData);
          
          if (categoryData) {
            // Fetch products in this category using category_id
            const { data: productsData } = await supabase
              .from('products')
              .select('*')
              .eq('store_id', storeData.id)
              .eq('category_id', categoryData.id);
            
            setProducts(productsData || []);
            
            // Get product names for search suggestions
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

  // Handle search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Handle category change - now we'll navigate without triggering full reload
  const handleCategoryChange = (category: string) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      navigate(`/store/${storeDomain}`);
    } else {
      navigate(`/store/${storeDomain}/category/${encodeURIComponent(category.toLowerCase())}`);
    }
  };
  
  // Handle section change
  const handleSectionChange = (section: string) => {
    console.log("Section changed:", section);
  };
  
  // Filter products by search term
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) 
    : products;

  // Back button handler
  const handleBackToStore = () => {
    navigate(`/store/${storeDomain}`);
  };

  if (isLoading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Category Header - Modified to be more compact and professional */}
      <header className="bg-gradient-to-l from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white bg-white/10 hover:bg-white/20 rounded-full mr-2"
                onClick={handleBackToStore}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">{categoryDetails?.name || "جميع المنتجات"}</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to={`/store/${storeDomain}/cart`}>
                <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20 rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={`/store/${storeDomain}/login`}>
                <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Search Bar with rounded design */}
        <div className="mb-4">
          <div className="search-bar-modern">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
              productNames={productNames}
            />
          </div>
        </div>
        
        {/* Category Navigation */}
        <CategoryNavigation
          categories={categories}
          sections={sections}
          activeCategory={categoryName || ""}
          activeSection=""
          onCategoryChange={handleCategoryChange}
          onSectionChange={handleSectionChange}
          storeDomain={storeDomain}
        />
        
        {/* Products Grid */}
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
