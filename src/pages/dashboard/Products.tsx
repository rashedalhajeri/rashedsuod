
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Filter, Search, Edit, Trash2, Eye, MoreHorizontal, SlidersHorizontal, ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import LoadingState from "@/components/ui/loading-state";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
}

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>("created_at_desc");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    image_url: null
  });
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
  // Get query data with sorting
  const getSortQuery = () => {
    if (sortBy === "name_asc") return { column: "name", ascending: true };
    if (sortBy === "name_desc") return { column: "name", ascending: false };
    if (sortBy === "price_asc") return { column: "price", ascending: true };
    if (sortBy === "price_desc") return { column: "price", ascending: false };
    if (sortBy === "stock_asc") return { column: "stock_quantity", ascending: true };
    if (sortBy === "stock_desc") return { column: "stock_quantity", ascending: false };
    if (sortBy === "created_at_asc") return { column: "created_at", ascending: true };
    return { column: "created_at", ascending: false }; // Default
  };
  
  // فتشت بيانات المنتجات
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', sortBy],
    queryFn: async () => {
      const { data: storeData } = await useStoreData().refetch();
      
      if (!storeData?.id) {
        return [];
      }
      
      const sortQuery = getSortQuery();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order(sortQuery.column, { ascending: sortQuery.ascending });
        
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      return data || [];
    }
  });
  
  // تصفية المنتجات حسب البحث
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // إضافة منتج جديد
  const handleAddProduct = async () => {
    try {
      const { data: storeData } = await useStoreData().refetch();
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      if (!formData.name || formData.price <= 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeData.id,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            image_url: formData.image_url
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding product:", error);
        toast.error("حدث خطأ أثناء إضافة المنتج");
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock_quantity: 0,
        image_url: null
      });
      
      refetch();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };
  
  // حذف منتج
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
        
      if (error) {
        console.error("Error deleting product:", error);
        toast.error("حدث خطأ أثناء حذف المنتج");
        return;
      }
      
      toast.success("تم حذف المنتج بنجاح");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.error("Error in handleDeleteProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };
  
  // تغيير قيم النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) : value
    }));
  };
  
  // عرض حالة فارغة إذا لم تكن هناك منتجات
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-primary-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium">لا توجد منتجات بعد</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        ابدأ بإضافة منتجات جديدة لعرضها في متجرك
      </p>
      <Button className="mt-4 gap-2" onClick={() => setIsAddDialogOpen(true)}>
        <Plus className="h-4 w-4" />
        <span>إضافة أول منتج</span>
      </Button>
    </div>
  );
  
  // عرض المنتجات في الجدول
  const renderProductsList = () => (
    <div className="grid gap-4">
      {filteredProducts?.map((product, index) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{product.description || "بدون وصف"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-bold text-primary-600">{formatCurrency(product.price)}</div>
                <div className="text-sm">
                  <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"} className="mt-1">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} في المخزون` : "نفذت الكمية"}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Edit className="h-4 w-4" /> تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Eye className="h-4 w-4" /> عرض
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary-500" />
            إدارة المنتجات
          </h1>
          <Button className="gap-2 hover:bg-primary-600" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>إضافة منتج</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن منتج..." 
                className="pl-3 pr-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <ArrowDownUp className="h-4 w-4" />
                  <span>ترتيب حسب</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                  الاسم (تصاعدي)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                  الاسم (تنازلي)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price_asc")}>
                  السعر (الأقل أولاً)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price_desc")}>
                  السعر (الأعلى أولاً)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("stock_desc")}>
                  المخزون (الأكثر أولاً)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created_at_desc")}>
                  الأحدث إضافة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="md:col-span-2">
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>تصفية</span>
            </Button>
          </div>
        </div>
        
        <Card className="border-primary-100">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-medium flex items-center">
              <Package className="h-4 w-4 inline-block ml-2 text-primary-500" />
              {isLoading ? "جاري التحميل..." : `قائمة المنتجات (${filteredProducts?.length || 0})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <LoadingState message="جاري تحميل المنتجات..." />
            ) : filteredProducts && filteredProducts.length > 0 ? (
              renderProductsList()
            ) : (
              renderEmptyState()
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* مربع حوار إضافة منتج */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-500" />
              إضافة منتج جديد
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">معلومات المنتج</TabsTrigger>
              <TabsTrigger value="inventory">المخزون والسعر</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="أدخل اسم المنتج" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="أدخل وصف المنتج"
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input 
                    id="image_url" 
                    name="image_url" 
                    placeholder="أدخل رابط صورة المنتج (اختياري)" 
                    value={formData.image_url || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                  <Input 
                    id="stock_quantity" 
                    name="stock_quantity" 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock_quantity} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddProduct}>
              إضافة المنتج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* مربع حوار حذف منتج */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              حذف المنتج
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              حذف المنتج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
