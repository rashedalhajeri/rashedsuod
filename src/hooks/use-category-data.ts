
import { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { supabase } from "@/integrations/supabase/client";

interface CategoryDetails {
  id: string;
  name: string;
  description?: string;
  store_id: string;
}

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

interface UseCategoryDataResult {
  products: Product[];
  categoryDetails: CategoryDetails | null;
  isLoadingProducts: boolean;
  productNames: string[];
  categories: string[];
  sections: string[];
  filteredProducts: Product[];
}

export const useCategoryData = (categoryName?: string, searchQuery: string = "") => {
  const { storeData, isLoading, error } = useStoreData();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    if (storeData?.id) {
      const fetchCategoryData = async () => {
        setIsLoadingProducts(true);
        
        try {
          // Fetch categories with actual products, not just counts
          const { data: categoriesData } = await supabase
            .from('categories')
            .select(`
              id,
              name,
              products:products(id)
            `)
            .eq('store_id', storeData.id)
            .order('sort_order');
            
          if (categoriesData) {
            // Filter out categories with no products - check products array length
            const categoriesWithProducts = categoriesData
              .filter(cat => cat.products.length > 0)
              .map(cat => cat.name);
              
            setCategories(categoriesWithProducts);
          }
          
          // Fetch all products if category is "الكل"
          if (categoryName?.toLowerCase() === "الكل" || categoryName === "all") {
            // Fetch all products
            const { data: allProductsData } = await supabase
              .from('products')
              .select('*')
              .eq('store_id', storeData.id);
              
            setProducts(allProductsData || []);
            
            if (allProductsData && allProductsData.length > 0) {
              setProductNames(allProductsData.map(product => product.name));
            }
            
            // Set category details for "الكل"
            setCategoryDetails({
              id: "all",
              name: "الكل",
              store_id: storeData.id
            });
          } else {
            // Fetch specific category
            const { data: categoryData } = await supabase
              .from('categories')
              .select('*')
              .eq('store_id', storeData.id)
              .ilike('name', categoryName || '')
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

  // Filter products by search query
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) 
    : products;

  return {
    products,
    categoryDetails,
    isLoadingProducts,
    productNames,
    categories,
    sections,
    filteredProducts,
  };
};
