
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreLayout from "@/components/store/StoreLayout";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/navbar/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Define the Product interface to match what we're getting from Supabase
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string; // Changed from category to category_id to match db schema
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

  // Fetch store data and category products
  useEffect(() => {
    if (storeData?.id && categoryName) {
      const fetchCategoryData = async () => {
        setIsLoadingProducts(true);
        
        try {
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
  
  // Filter products by search term
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) 
    : products;

  // Format category name for display
  const displayCategoryName = categoryName 
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "";

  if (isLoading || isLoadingProducts) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }

  return (
    <StoreLayout storeData={storeData}>
      <div className="py-4" dir="rtl">
        {/* Hero Banner with gradient background */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-blue-600 via-blue-500 to-blue-400 opacity-90"></div>
          <div className="relative z-10 p-6 text-white">
            <div className="mb-2">
              <Link 
                to={`/store/${storeDomain}`}
                className="inline-flex items-center text-white/90 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1 rtl:rotate-180" />
                <span>العودة إلى المتجر</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-right">
              {displayCategoryName === "Clinics" ? "العيادات" : 
               displayCategoryName === "Electronics" ? "الإلكترونيات" : 
               displayCategoryName === "الكل" ? "جميع الصفقات" :
               displayCategoryName}
            </h1>
            <p className="text-white/80 text-right mt-1">
              {categoryDetails?.description || `تصفح جميع منتجات ${displayCategoryName}`}
            </p>
          </div>
        </div>
        
        {/* Search Bar with rounded design */}
        <div className="mb-6 px-2">
          <div className="search-bar-modern">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
              productNames={productNames}
            />
          </div>
        </div>
        
        {/* Category Pills - simplified visual style */}
        <div className="mb-6 overflow-x-auto hide-scrollbar px-2">
          <div className="flex gap-4 pb-2">
            <div className={`category-pill ${displayCategoryName === "الكل" ? "active" : ""}`}>
              <div className="category-pill-icon">
                <img src="/public/lovable-uploads/76b54a01-0b01-4389-87c4-99406ba4e5ca.png" alt="الكل" className="w-7 h-7" />
              </div>
              <span>الكل</span>
            </div>
            <div className={`category-pill ${displayCategoryName === "Clinics" ? "active" : ""}`}>
              <div className="category-pill-icon">
                <img src="/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png" alt="Clinics" className="w-7 h-7" />
              </div>
              <span>العيادات</span>
            </div>
            <div className={`category-pill ${displayCategoryName === "Electronics" ? "active" : ""}`}>
              <div className="category-pill-icon">
                <img src="/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg" alt="Electronics" className="w-7 h-7" />
              </div>
              <span>الإلكترونيات</span>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="px-2">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">لم نتمكن من العثور على منتجات في هذه الفئة</p>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default CategoryPage;
