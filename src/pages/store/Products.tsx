
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoreFromUrl } from "@/utils/url-utils";
import { ShoppingBag, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const StoreProducts: React.FC = () => {
  const { storeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // استعلام لجلب بيانات المتجر
  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("معرف المتجر غير متوفر");
      const { data, error } = await getStoreFromUrl(storeId, supabase);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام لجلب الفئات
  const { data: categories } = useQuery({
    queryKey: ['categories', storeId],
    queryFn: async () => {
      if (!storeData?.id) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeData.id);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id,
  });
  
  // استعلام لجلب المنتجات
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', storeId, searchQuery, sortBy, filterCategories, currentPage],
    queryFn: async () => {
      if (!storeData?.id) return { products: [], totalCount: 0 };
      
      let query = supabase
        .from('products')
        .select('*, categories(*)', { count: 'exact' })
        .eq('store_id', storeData.id);
      
      // تطبيق البحث
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      // تطبيق تصفية الفئات
      if (filterCategories.length > 0) {
        query = query.in('category_id', filterCategories);
      }
      
      // تطبيق الترتيب
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      // تطبيق الصفحات
      const from = (currentPage - 1) * productsPerPage;
      const to = from + productsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        products: data || [],
        totalCount: count || 0
      };
    },
    enabled: !!storeData?.id,
    staleTime: 1000 * 60 * 1, // 1 دقيقة
  });
  
  const formatCurrency = getCurrencyFormatter(storeData?.currency);
  
  // تحديث عنوان URL عند تغيير البحث
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // تم تنفيذ البحث في useQuery
  };
  
  const handleCategoryFilter = (categoryId: string) => {
    if (filterCategories.includes(categoryId)) {
      setFilterCategories(filterCategories.filter(id => id !== categoryId));
    } else {
      setFilterCategories([...filterCategories, categoryId]);
    }
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلتر
  };
  
  const clearFilters = () => {
    setFilterCategories([]);
    setCurrentPage(1);
  };
  
  const totalPages = Math.ceil((productsData?.totalCount || 0) / productsPerPage);
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader storeData={storeData} isLoading={storeLoading} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {searchQuery ? `نتائج البحث: ${searchQuery}` : "جميع المنتجات"}
            </h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 ml-2">
                {productsLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  `${productsData?.totalCount || 0} منتج`
                )}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* فلتر للشاشات الكبيرة */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">تصفية النتائج</h3>
                  {filterCategories.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs h-auto py-1"
                    >
                      مسح الكل
                    </Button>
                  )}
                </div>
                
                <Separator className="mb-4" />
                
                <div>
                  <h4 className="font-medium mb-2">الفئات</h4>
                  <div className="space-y-2">
                    {categories?.map((category: any) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={filterCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryFilter(category.id)}
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm mr-2 cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                    
                    {!categories?.length && (
                      <p className="text-sm text-gray-500">لا توجد فئات</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* المنتجات وشريط البحث */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 relative">
                    <form onSubmit={handleSearch}>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="ابحث عن منتجات..."
                        className="pr-10 text-right"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-40">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="الترتيب حسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">الأحدث</SelectItem>
                          <SelectItem value="price_low">السعر: من الأقل للأعلى</SelectItem>
                          <SelectItem value="price_high">السعر: من الأعلى للأقل</SelectItem>
                          <SelectItem value="name_asc">أبجدي: أ-ي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* فلتر للشاشات الصغيرة */}
                    <div className="block lg:hidden">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="icon">
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                          <SheetHeader>
                            <SheetTitle>تصفية النتائج</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6">
                            {filterCategories.length > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={clearFilters}
                                className="mb-4"
                              >
                                مسح الكل
                              </Button>
                            )}
                            
                            <h4 className="font-medium mb-2">الفئات</h4>
                            <div className="space-y-2">
                              {categories?.map((category: any) => (
                                <div key={category.id} className="flex items-center">
                                  <Checkbox 
                                    id={`mobile-category-${category.id}`}
                                    checked={filterCategories.includes(category.id)}
                                    onCheckedChange={() => handleCategoryFilter(category.id)}
                                  />
                                  <label 
                                    htmlFor={`mobile-category-${category.id}`}
                                    className="text-sm mr-2 cursor-pointer"
                                  >
                                    {category.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* قائمة المنتجات */}
              {filterCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filterCategories.map((categoryId) => {
                    const categoryName = categories?.find((c: any) => c.id === categoryId)?.name;
                    return (
                      <div 
                        key={categoryId}
                        className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {categoryName}
                        <button 
                          onClick={() => handleCategoryFilter(categoryId)}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    مسح الكل
                  </button>
                </div>
              )}
              
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : productsData?.products && productsData.products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productsData.products.map((product: any) => (
                      <Link 
                        to={`/store/${storeId}/products/${product.id}`} 
                        key={product.id}
                        className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-blue-600 font-bold mb-3">
                            {formatCurrency(product.price)}
                          </p>
                          <Button className="w-full mt-1">إضافة للسلة</Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* ترقيم الصفحات */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          السابق
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            // عرض الصفحات القريبة من الصفحة الحالية فقط
                            if (page === 1 || page === totalPages) return true;
                            if (Math.abs(page - currentPage) <= 1) return true;
                            return false;
                          })
                          .map((page, index, array) => {
                            // إضافة "..." للصفحات المحذوفة
                            if (index > 0 && array[index - 1] !== page - 1) {
                              return (
                                <React.Fragment key={`ellipsis-${page}`}>
                                  <span className="mx-1">...</span>
                                  <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </Button>
                                </React.Fragment>
                              );
                            }
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            );
                          })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          التالي
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">لا توجد منتجات</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? `لم نتمكن من العثور على منتجات تطابق "${searchQuery}"`
                      : "لا توجد منتجات متاحة حالياً"}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                    >
                      مسح البحث
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <StoreFooter storeData={storeData} />
    </div>
  );
};

export default StoreProducts;
