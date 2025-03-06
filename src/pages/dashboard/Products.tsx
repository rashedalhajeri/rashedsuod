
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Filter, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
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
import ImageUploadGrid from "@/components/ui/image-upload-grid";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string[];
}

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    images: []
  });
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // قم بجلب بيانات المتجر من الحالة المخزنة بدلاً من استدعاء useStoreData
      if (!storeData?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!storeData?.id, // فقط قم بتنفيذ الاستعلام عندما تكون بيانات المتجر متاحة
  });
  
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleAddProduct = async () => {
    try {
      // استخدام بيانات المتجر من الحالة بدلاً من استدعاء useStoreData
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      if (!formData.name || formData.price <= 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      
      if (formData.images.length === 0) {
        toast.error("يرجى إضافة صورة واحدة على الأقل");
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
            image_url: formData.images[0] || null,
            additional_images: formData.images.length > 1 ? formData.images.slice(1) : []
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
        images: []
      });
      
      refetch();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) : value
    }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };
  
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Package className="h-12 w-12 mx-auto text-muted-foreground" />
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
  
  const renderProductsList = () => (
    <div className="grid gap-4">
      {filteredProducts?.map((product) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
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
                <p className="text-sm text-gray-500 line-clamp-1">{product.description || "بدون وصف"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-bold">{formatCurrency(product.price)}</div>
                <div className="text-sm">
                  <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"} className="mt-1">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} في المخزون` : "نفذت الكمية"}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> عرض
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-red-600"
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
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>إضافة منتج</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
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
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              <span>تصفية النتائج</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <Package className="h-4 w-4 inline-block ml-2" />
              قائمة المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
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
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة منتج جديد</DialogTitle>
            <DialogDescription>
              أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">معلومات المنتج</TabsTrigger>
              <TabsTrigger value="images">الصور</TabsTrigger>
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
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>صور المنتج <span className="text-red-500">*</span></Label>
                  <ImageUploadGrid 
                    images={formData.images}
                    onImagesChange={handleImagesChange}
                    maxImages={5}
                    storeId={storeData?.id}
                  />
                  <p className="text-xs text-gray-500">
                    يمكنك إضافة حتى 5 صور. اسحب وأفلت الصور أو اضغط لرفع الصور من جهازك.
                  </p>
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
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleAddProduct}
                disabled={!formData.name || formData.price <= 0 || formData.images.length === 0}
                className="w-full sm:w-auto"
              >
                إضافة المنتج
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المنتج</DialogTitle>
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
