
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid, List, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { useShoppingCart } from "@/hooks/use-shopping-cart";

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || "";
  
  const { data: storeData } = useStoreData();
  const { addToCart } = useShoppingCart();
  
  // Format currency based on store settings
  const formatCurrency = storeData 
    ? getCurrencyFormatter(storeData.currency) 
    : (price: number) => `${price.toFixed(2)} KWD`;
  
  // State for UI
  const [isGridView, setIsGridView] = useState(true);
  const [filters, setFilters] = useState({
    search: searchQuery,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "newest"
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  // Update search when URL changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery
    }));
  }, [searchQuery]);
  
  // Fetch products with filtering
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', storeData?.id, filters],
    queryFn: async () => {
      if (!storeData?.id) return [];
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .gte('price', filters.minPrice)
        .lte('price', filters.maxPrice);
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      if (filters.sortBy === "newest") {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === "price_asc") {
        query = query.order('price', { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order('price', { ascending: false });
      } else if (filters.sortBy === "name_asc") {
        query = query.order('name', { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id
  });
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search query
    if (filters.search) {
      navigate(`/store/products?search=${encodeURIComponent(filters.search)}`);
    } else {
      navigate('/store/products');
    }
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  // Apply price filter
  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
  };
  
  // Handle quick add to cart
  const handleQuickAdd = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url
    });
  };
  
  return (
    <StorefrontLayout storeId={storeData?.id}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المنتجات</h1>
          <p className="text-gray-600">تصفح وتسوق من تشكيلة متنوعة من المنتجات</p>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="ابحث عن منتج..."
                  className="pl-10 pr-4 w-full md:w-64"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <button 
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden md:inline">التصفية</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="h-full flex flex-col py-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">التصفية والفرز</h3>
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="space-y-6 flex-1 overflow-y-auto">
                      {/* Price Range */}
                      <div>
                        <h4 className="font-medium mb-3">نطاق السعر</h4>
                        <div className="px-3">
                          <Slider
                            defaultValue={[0, 1000]}
                            max={1000}
                            step={10}
                            value={priceRange}
                            onValueChange={handlePriceRangeChange}
                            className="mb-6"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span>{formatCurrency(priceRange[0])}</span>
                            <span>{formatCurrency(priceRange[1])}</span>
                          </div>
                        </div>
                        <Button 
                          onClick={applyPriceFilter} 
                          className="w-full mt-4"
                        >
                          تطبيق
                        </Button>
                      </div>
                      
                      {/* Sort Options */}
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">ترتيب حسب</h4>
                        <div className="space-y-2">
                          {[
                            { id: "newest", label: "الأحدث" },
                            { id: "price_asc", label: "السعر: من الأقل إلى الأعلى" },
                            { id: "price_desc", label: "السعر: من الأعلى إلى الأقل" },
                            { id: "name_asc", label: "الاسم: أ-ي" }
                          ].map((option) => (
                            <div key={option.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Checkbox
                                id={option.id}
                                checked={filters.sortBy === option.id}
                                onCheckedChange={() => setFilters({ ...filters, sortBy: option.id })}
                              />
                              <label
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6 mt-6">
                      <Button variant="outline" className="w-full">
                        إعادة تعيين التصفية
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <Button
                  variant={isGridView ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${isGridView ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setIsGridView(true)}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={!isGridView ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${!isGridView ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setIsGridView(false)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {(filters.search || filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">التصفية النشطة:</span>
              
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  بحث: {filters.search}
                  <button
                    onClick={() => {
                      setFilters({ ...filters, search: "" });
                      navigate('/store/products');
                    }}
                    className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  السعر: {formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}
                  <button
                    onClick={() => {
                      setFilters({ ...filters, minPrice: 0, maxPrice: 1000 });
                      setPriceRange([0, 1000]);
                    }}
                    className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-gray-500"
                onClick={() => {
                  setFilters({
                    search: "",
                    minPrice: 0,
                    maxPrice: 1000,
                    sortBy: "newest"
                  });
                  setPriceRange([0, 1000]);
                  navigate('/store/products');
                }}
              >
                مسح الكل
              </Button>
            </div>
          )}
        </div>
        
        {/* Products Grid/List */}
        {isLoading ? (
          <div className={`grid ${isGridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className={`${isGridView ? 'h-64' : 'h-32'} w-full rounded-lg`} />
            ))}
          </div>
        ) : products?.length ? (
          <>
            {isGridView ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className="relative h-48 bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/store/products/${product.id}`)}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 
                        className="font-medium text-lg mb-2 cursor-pointer hover:text-primary truncate"
                        onClick={() => navigate(`/store/products/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-primary-700 font-bold mb-3">
                        {formatCurrency(product.price)}
                      </p>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleQuickAdd(product)}
                      >
                        <ShoppingBag className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex"
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="w-32 h-32 flex-shrink-0 bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/store/products/${product.id}`)}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 
                          className="font-medium text-lg mb-2 cursor-pointer hover:text-primary"
                          onClick={() => navigate(`/store/products/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {product.description || "لا يوجد وصف متاح."}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-primary-700 font-bold">
                          {formatCurrency(product.price)}
                        </p>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAdd(product)}
                        >
                          <ShoppingBag className="h-4 w-4 ml-2" />
                          أضف للسلة
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-gray-600 mb-6">
              {filters.search 
                ? `لم نتمكن من العثور على منتجات تطابق "${filters.search}"`
                : "لم نتمكن من العثور على منتجات تطابق معايير البحث الخاصة بك"}
            </p>
            <Button
              onClick={() => {
                setFilters({
                  search: "",
                  minPrice: 0,
                  maxPrice: 1000,
                  sortBy: "newest"
                });
                setPriceRange([0, 1000]);
                navigate('/store/products');
              }}
            >
              عرض جميع المنتجات
            </Button>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default ProductsPage;
