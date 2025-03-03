
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  Package, 
  Plus, 
  Search, 
  Settings, 
  ShoppingBag, 
  Home, 
  X, 
  Check,
  ChevronRight
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
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  store_id: string;
  image_url?: string;
  stock_quantity?: number;
  created_at: string;
}

const Products: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock_quantity: ""
  });
  const navigate = useNavigate();

  // Check for auth state and fetch products data
  useEffect(() => {
    const fetchSessionAndProducts = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        
        setSession(sessionData.session);
        
        // Fetch store data for the authenticated user
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (storeError) {
          throw storeError;
        }
        
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
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProducts();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_OUT') {
          navigate("/");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch store data for the authenticated user
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', session?.user.id)
        .single();
      
      if (storeError) {
        throw storeError;
      }
      
      // Add new product
      const { data, error } = await supabase
        .from('products')
        .insert([
          { 
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            image_url: newProduct.image_url || null,
            stock_quantity: newProduct.stock_quantity ? parseInt(newProduct.stock_quantity) : null,
            store_id: storeData.id
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      setProducts([...data, ...products]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        stock_quantity: ""
      });
      
      setIsAddProductOpen(false);
      toast.success("تم إضافة المنتج بنجاح");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
            <p className="text-gray-600">أضف وعدل منتجات متجرك</p>
          </div>
          <Button 
            onClick={() => setIsAddProductOpen(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة منتج جديد
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 pr-12 py-2"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-4">لم تقم بإضافة أي منتجات بعد. أضف منتجك الأول الآن!</p>
            <Button 
              onClick={() => setIsAddProductOpen(true)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة منتج جديد
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 relative">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">{product.price.toFixed(2)} {'\u062F\u002E\u0643'}</span>
                    {product.stock_quantity !== null && (
                      <span className="text-sm text-gray-600">
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
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  placeholder="أدخل وصف المنتج"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
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
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">المخزون</Label>
                <Input
                  id="stock"
                  placeholder="أدخل كمية المخزون"
                  type="number"
                  min="0"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">رابط الصورة</Label>
                <Input
                  id="image"
                  placeholder="أدخل رابط صورة المنتج"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductOpen(false)}
                className="mb-2 sm:mb-0"
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
              
              <Button 
                type="button" 
                onClick={handleAddProduct}
                disabled={loading || !newProduct.name || !newProduct.price}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {loading ? "جاري الإضافة..." : "إضافة المنتج"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Products;
