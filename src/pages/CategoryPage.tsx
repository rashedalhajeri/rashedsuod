
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreLayout from "@/components/store/StoreLayout";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/navbar/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const { storeDomain, categoryName } = useParams<{ storeDomain: string; categoryName: string }>();
  const { storeData, isLoading, error } = useStoreData();
  const [products, setProducts] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
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
          
          // Fetch products in this category
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeData.id)
            .eq('category', categoryName);
          
          setProducts(productsData || []);
          
          // Get product names for search suggestions
          if (productsData && productsData.length > 0) {
            setProductNames(productsData.map(product => product.name));
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
        {/* Back navigation */}
        <div className="mb-4 px-3">
          <Link 
            to={`/store/${storeDomain}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1 rtl:rotate-180" />
            <span>العودة إلى المتجر</span>
          </Link>
        </div>
        
        {/* Category Header */}
        <div className="mb-6 bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6 px-4 rounded-xl">
          <h1 className="text-2xl font-bold mb-2 text-right">
            {displayCategoryName === "Clinics" ? "العيادات" : 
             displayCategoryName === "Electronics" ? "الإلكترونيات" : 
             displayCategoryName}
          </h1>
          <p className="text-blue-100 text-right">
            {categoryDetails?.description || `تصفح جميع منتجات ${displayCategoryName}`}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6 px-3">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            productNames={productNames}
          />
        </div>
        
        {/* Products Grid */}
        <div className="px-3">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
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
