
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import StorefrontLayout from "@/layouts/StorefrontLayout";

const Products: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isListView, setIsListView] = useState(false);
  
  // Fetch store data
  const { data: storeData, isLoading: isLoadingStore, error: storeError } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("domain_name", storeId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });
  
  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["storeProducts", storeData?.id, searchQuery, priceRange],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData?.id);
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        query = query
          .gte("price", priceRange[0])
          .lte("price", priceRange[1]);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id,
  });
  
  // Set RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery });
  };
  
  if (isLoadingStore) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }
  
  if (storeError || !storeData) {
    return (
      <ErrorState
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب"
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">جميع المنتجات</h1>
          <p className="text-muted-foreground">
            تصفح مجموعة منتجات {storeData.store_name}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="h-4 w-4 ml-2" />
              بحث
            </Button>
          </form>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">نطاق السعر:</span>
              <div className="w-48">
                <Slider 
                  defaultValue={[0, 1000]} 
                  max={1000} 
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              <span className="text-sm">
                {priceRange[0]} - {priceRange[1]} ر.س
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">طريقة العرض:</span>
              <Button
                variant={isListView ? "outline" : "default"}
                size="sm"
                className="w-9 h-9 p-0"
                onClick={() => setIsListView(false)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={isListView ? "default" : "outline"}
                size="sm"
                className="w-9 h-9 p-0"
                onClick={() => setIsListView(true)}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {isLoadingProducts ? (
          <LoadingState message="جاري تحميل المنتجات..." />
        ) : products && products.length > 0 ? (
          <div className={`grid ${isListView ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-4`}>
            {products.map((product) => (
              <a
                key={product.id}
                href={`/store/${storeId}/product/${product.id}`}
                className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                  isListView ? "flex" : "block"
                }`}
              >
                <div className={`${isListView ? "w-1/3" : "w-full"} aspect-square bg-gray-100 relative`}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">لا توجد صورة</span>
                    </div>
                  )}
                </div>
                
                <div className={`${isListView ? "w-2/3" : "w-full"} p-4`}>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  {isListView && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description || "لا يوجد وصف"}
                    </p>
                  )}
                  
                  <div className={`flex items-center ${isListView ? "justify-between" : ""}`}>
                    <span className="font-bold text-gray-800">{product.price} ر.س</span>
                    
                    {isListView && (
                      <Button size="sm" className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                        عرض المنتج
                      </Button>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا توجد منتجات متاحة حاليًا</p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Products;
