
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StoreLayout from "@/components/store/StoreLayout";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/navbar/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import CategoryNavigation from "@/components/store/CategoryNavigation";

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
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log("Category changed:", category);
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

  if (isLoading || isLoadingProducts) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }

  return (
    <StoreLayout storeData={storeData}>
      <div className="py-4" dir="rtl">
        {/* Search Bar with rounded design */}
        <div className="mb-4 px-2">
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
