
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Search, ShoppingCart, Heart, ListFilter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { useStoreDetection } from "@/hooks/use-store-detection";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { toast } from "sonner";

// Product type definition
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  additional_images: string[] | null;
  store_id: string;
  category_id: string | null;
  category_name?: string;
}

// Category type definition
interface Category {
  id: string;
  name: string;
  description: string | null;
  store_id: string;
}

const StoreProducts: React.FC = () => {
  // Use the store detection hook
  const { store, loading: storeLoading, error: storeError } = useStoreDetection();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Format currency based on store settings
  const formatCurrency = (price: number) => {
    return getCurrencyFormatter(store?.currency)(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!store) return;
      
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("store_id", store.id);
        
        if (categoriesError) throw categoriesError;
        
        setCategories(categoriesData || []);
        
        // Fetch products with category names
        const { data, error: productsError } = await supabase
          .from("products")
          .select(`
            *,
            categories(name)
          `)
          .eq("store_id", store.id);
        
        if (productsError) throw productsError;
        
        // Transform data to include category_name
        const productsWithCategories = data?.map(product => ({
          ...product,
          category_name: product.categories?.name
        })) || [];
        
        setProducts(productsWithCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [store]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Filter by search
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by category
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
      
      // Filter by stock
      const matchesStock = !inStockOnly || product.stock_quantity > 0;
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      // Sort products
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  // Store URL for links
  const baseUrl = `/store/${store?.id}`;
  
  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("تمت إضافة المنتج إلى السلة");
  };
  
  // Add to favorites handler
  const handleAddToFavorites = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("تمت إضافة المنتج إلى المفضلة");
  };

  // Show loading state while store is being detected
  if (storeLoading || loading) {
    return (
      <StorefrontLayout>
        <LoadingState message={storeLoading ? "جاري تحميل بيانات المتجر..." : "جاري تحميل المنتجات..."} />
      </StorefrontLayout>
    );
  }

  // Show error if store detection failed
  if (storeError || error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في التحميل"
          message={storeError || error || "حدث خطأ غير متوقع"}
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-2">جميع المنتجات</h1>
          <p className="text-gray-500 mb-6">
            استعرض تشكيلتنا الواسعة من المنتجات المميزة
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <motion.div 
            className="hidden md:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">البحث</h3>
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="ابحث عن منتج..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <Search className="absolute top-2.5 right-3 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">التصنيفات</h3>
                    <div className="space-y-2">
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          selectedCategory === null 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        جميع المنتجات
                      </div>
                      
                      {categories.map(category => (
                        <div 
                          key={category.id}
                          className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                            selectedCategory === category.id 
                              ? "bg-primary-100 text-primary-700" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">ترتيب حسب</h3>
                    <div className="space-y-2">
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "newest" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("newest")}
                      >
                        الأحدث
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "price_low" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("price_low")}
                      >
                        السعر: من الأقل إلى الأعلى
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "price_high" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("price_high")}
                      >
                        السعر: من الأعلى إلى الأقل
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="accent-primary-500 w-4 h-4 ml-2" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <span>المنتجات المتوفرة فقط</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Filter Button - Mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="relative flex-1 ml-2">
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>تصفية المنتجات</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-medium mb-3">التصنيفات</h3>
                    <div className="space-y-2">
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          selectedCategory === null 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        جميع المنتجات
                      </div>
                      
                      {categories.map(category => (
                        <div 
                          key={category.id}
                          className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                            selectedCategory === category.id 
                              ? "bg-primary-100 text-primary-700" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">ترتيب حسب</h3>
                    <div className="space-y-2">
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "newest" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("newest")}
                      >
                        الأحدث
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "price_low" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("price_low")}
                      >
                        السعر: من الأقل إلى الأعلى
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${
                          sortBy === "price_high" 
                            ? "bg-primary-100 text-primary-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("price_high")}
                      >
                        السعر: من الأعلى إلى الأقل
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="accent-primary-500 w-4 h-4 ml-2" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <span>المنتجات المتوفرة فقط</span>
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">لا توجد منتجات متطابقة مع عوامل التصفية</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setInStockOnly(false);
                  }}>
                    إعادة ضبط التصفية
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <Link 
                    key={product.id} 
                    to={`${baseUrl}/products/${product.id}`}
                    className="group block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden h-full transition-all hover:shadow-md group-hover:border-primary-200 relative">
                        <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <img 
                                src="/placeholder.svg" 
                                alt="Placeholder" 
                                className="w-16 h-16 opacity-50" 
                              />
                            </div>
                          )}
                          
                          {/* Quick action buttons */}
                          <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="secondary" 
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white hover:bg-primary-50 shadow-sm"
                              onClick={(e) => handleAddToFavorites(e, product.id)}
                            >
                              <Heart className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white hover:bg-primary-50 shadow-sm"
                              onClick={(e) => handleAddToCart(e, product.id)}
                            >
                              <ShoppingCart className="h-4 w-4 text-gray-600" />
                            </Button>
                          </div>
                          
                          {/* Tags */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.sale_price !== null && (
                              <Badge className="bg-red-500">تخفيض</Badge>
                            )}
                            {product.stock_quantity <= 0 && (
                              <Badge variant="secondary" className="bg-gray-800 text-white">نفذت الكمية</Badge>
                            )}
                            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                              <Badge variant="secondary" className="bg-yellow-500">كمية محدودة</Badge>
                            )}
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          {product.category_name && (
                            <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
                          )}
                          <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                          
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 font-bold">{formatCurrency(product.price)}</p>
                            {product.sale_price && (
                              <p className="text-gray-500 line-through text-sm">{formatCurrency(product.sale_price)}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StoreProducts;
