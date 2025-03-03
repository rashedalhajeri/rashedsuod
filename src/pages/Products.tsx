
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  Package, 
  Plus, 
  Search, 
  X, 
  Check,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  Filter,
  Tag,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFilter } from "@/components/product/ProductFilter";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  store_id: string;
  image_url?: string | null;
  stock_quantity?: number | null;
  created_at: string;
  category?: string | null;
}

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

const Products: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([
    "ملابس", "إلكترونيات", "منزل", "طعام", "رياضة", "أخرى"
  ]);
  const navigate = useNavigate();

  // Check for auth state and fetch products data
  useEffect(() => {
    const fetchSessionAndProducts = async () => {
      try {
        setIsLoading(true);
        
        // Get session data
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!sessionData.session) {
          toast.error("يرجى تسجيل الدخول للوصول إلى صفحة المنتجات");
          navigate("/");
          return;
        }
        
        setSession(sessionData.session);
        
        // Fetch store data for the authenticated user using maybeSingle() instead of single()
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();
        
        if (storeError) {
          throw storeError;
        }
        
        // Check if store exists
        if (!storeData) {
          toast.error("لم يتم العثور على متجر. يرجى إنشاء متجر أولاً");
          navigate("/create-store");
          return;
        }
        
        setStoreId(storeData.id);
        setStore(storeData);
        
        // Fetch products for the store
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });
        
        if (productsError) {
          throw productsError;
        }
        
        setProducts(productsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المنتجات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndProducts();
  }, [navigate]);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'store_id'>) => {
    if (!storeId) {
      toast.error("لم يتم العثور على معرف المتجر");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate price is a valid number
      const price = parseFloat(String(productData.price));
      if (isNaN(price) || price < 0) {
        toast.error("يرجى إدخال سعر صحيح");
        return;
      }
      
      // Add new product
      const { data, error } = await supabase
        .from('products')
        .insert([
          { 
            name: productData.name,
            description: productData.description || null,
            price: price,
            image_url: productData.image_url || null,
            stock_quantity: productData.stock_quantity || null,
            store_id: storeId,
            category: productData.category || "أخرى"
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update products list - add at the beginning for better UX
        setProducts([...data, ...products]);
        setIsAddProductOpen(false);
        toast.success("تم إضافة المنتج بنجاح");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products
    .filter(product => 
      (activeFilter ? product.category === activeFilter : true) &&
      (searchQuery ? 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        : true
      )
    );

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-KW', { 
      style: 'currency', 
      currency: store?.currency || 'KWD'
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
            <p className="text-gray-600">أضف وعدل منتجات متجرك</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={() => setIsAddProductOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 flex-grow md:flex-grow-0"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-12 py-2"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6" 
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Select value={activeFilter || ""} onValueChange={(value) => setActiveFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{activeFilter || "جميع التصنيفات"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع التصنيفات</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="border rounded-md flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-10 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-10 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {activeFilter && (
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-500 ml-2">التصنيف النشط:</span>
              <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm">
                <Tag className="h-3 w-3" />
                {activeFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 hover:bg-primary-100" 
                  onClick={() => setActiveFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Loader2 className="h-12 w-12 mx-auto text-primary-500 mb-4 animate-spin" />
            <p className="text-lg text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          searchQuery || activeFilter ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">لم يتم العثور على منتجات</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery && `لم نتمكن من العثور على أي منتجات تطابق "${searchQuery}"`}
                {activeFilter && !searchQuery && `لم نتمكن من العثور على منتجات في تصنيف "${activeFilter}"`}
                {activeFilter && searchQuery && ` في تصنيف "${activeFilter}"`}
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter(null);
                }}
              >
                عرض جميع المنتجات
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-600 mb-4">لم تقم بإضافة أي منتجات بعد. أضف منتجك الأول الآن!</p>
              <Button 
                onClick={() => setIsAddProductOpen(true)}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة منتج جديد
              </Button>
            </div>
          )
        ) : (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Handle image loading error
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/300x150?text=صورة+غير+متوفرة';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {product.category && (
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description || "لا يوجد وصف"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
                      {product.stock_quantity !== null && (
                        <span className={`text-sm ${product.stock_quantity > 10 ? 'text-green-600' : product.stock_quantity > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                          المخزون: {product.stock_quantity}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full text-primary-600 hover:text-primary-700 hover:bg-gray-100"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      عرض التفاصيل
                      <ChevronRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b px-4 py-3 bg-gray-50 font-medium">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">المنتج</div>
                  <div className="col-span-2 text-center">السعر</div>
                  <div className="col-span-2 text-center">المخزون</div>
                  <div className="col-span-2 text-center">الإجراءات</div>
                </div>
              </div>
              {filteredProducts.map((product) => (
                <div key={product.id} className="border-b last:border-0 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://via.placeholder.com/48?text=صورة';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {product.category || "غير مصنف"}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-medium">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity === null ? 'bg-gray-100 text-gray-600' :
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 
                        product.stock_quantity > 0 ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity === null ? 'غير محدد' : product.stock_quantity}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        عرض
                        <ChevronRight className="h-3 w-3 mr-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={(open) => {
          setIsAddProductOpen(open);
        }}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">إضافة منتج جديد</DialogTitle>
              <DialogDescription className="text-center">
                أضف منتجًا جديدًا إلى متجرك
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم المنتج"
                  onChange={(e) => {}}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  placeholder="أدخل وصف المنتج"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  placeholder="أدخل سعر المنتج"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">المخزون</Label>
                <Input
                  id="stock"
                  placeholder="أدخل كمية المخزون"
                  type="number"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">رابط الصورة</Label>
                <Input
                  id="image"
                  placeholder="أدخل رابط صورة المنتج"
                />
                <p className="text-xs text-gray-500">ادخل رابط صورة المنتج الخاص بك. يفضل صور بحجم 300×300 بكسل.</p>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddProductOpen(false);
                }}
                className="mb-2 sm:mb-0"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
              
              <Button 
                type="button" 
                disabled={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 ml-2" />
                    إضافة المنتج
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Products;
