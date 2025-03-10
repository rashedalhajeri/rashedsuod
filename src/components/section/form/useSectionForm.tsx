
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product } from "./types";

export const useSectionForm = (
  isOpen: boolean,
  newSectionType: string,
  newProductIds: string[] | null,
  newCategoryId: string | null,
  setNewCategoryId: (id: string | null) => void,
  setNewProductIds: (ids: string[] | null) => void
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");
  const [customType, setCustomType] = useState<string>(""); // "products" or "category"
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  // Fetch categories and products when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSectionType(newSectionType || "");
      fetchCategories();
      fetchProducts();
    }
  }, [isOpen, newSectionType]);

  // Filter products based on search query
  useEffect(() => {
    if (productSearchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = productSearchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(query)
        )
      );
    }
  }, [productSearchQuery, products]);

  // Filter categories based on search query
  useEffect(() => {
    if (categorySearchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = categorySearchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter(category => 
          category.name.toLowerCase().includes(query)
        )
      );
    }
  }, [categorySearchQuery, categories]);

  // Fetch categories from the database
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      setFilteredCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from the database
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, price, discount_price')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
      
      // Initialize selected products from newProductIds
      if (newProductIds) {
        const selectedMap: Record<string, boolean> = {};
        newProductIds.forEach(id => {
          selectedMap[id] = true;
        });
        setSelectedProducts(selectedMap);
      } else {
        setSelectedProducts({});
      }
      
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products for a specific category
  const fetchCategoryProducts = useCallback(async (categoryId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, price, discount_price')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategoryProducts(data || []);
    } catch (err) {
      console.error("Error fetching category products:", err);
      setCategoryProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle product selection
  const handleProductSelect = (productId: string, isSelected: boolean) => {
    const updatedSelection = { ...selectedProducts, [productId]: isSelected };
    setSelectedProducts(updatedSelection);
    
    // Update newProductIds based on selection
    const selectedIds = Object.keys(updatedSelection).filter(id => updatedSelection[id]);
    setNewProductIds(selectedIds.length > 0 ? selectedIds : null);
  };

  const handleTypeChange = (type: string) => {
    setSelectedSectionType(type);
    
    // Reset fields for different types
    if (type !== 'category') {
      setNewCategoryId(null);
      setCategoryProducts([]);
    }
    
    if (type !== 'custom') {
      setNewProductIds(null);
      setSelectedProducts({});
      setCustomType("");
    }
  };

  const handleCustomTypeChange = (type: string) => {
    setCustomType(type);
    
    // Reset other fields
    if (type === 'products') {
      setNewCategoryId(null);
      setCategoryProducts([]);
    } else if (type === 'category') {
      setNewProductIds(null);
      setSelectedProducts({});
    }
  };

  return {
    categories,
    products,
    filteredProducts,
    filteredCategories,
    isLoading,
    selectedProducts,
    productSearchQuery,
    setProductSearchQuery,
    categorySearchQuery,
    setCategorySearchQuery,
    selectedSectionType,
    setSelectedSectionType,
    customType,
    setCustomType,
    categoryProducts,
    fetchCategoryProducts,
    handleProductSelect,
    handleTypeChange,
    handleCustomTypeChange
  };
};
