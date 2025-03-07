
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Filter, Search, Edit, Trash2, Eye, MoreHorizontal, Percent, Tag, Box, User, Image as ImageIcon, Eye as EyeIcon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Product } from "@/utils/product-helpers";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  images: string[];
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
}

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    stock_quantity: 0,
    images: [],
    track_inventory: false,
    has_colors: false,
    has_sizes: false,
    require_customer_name: false,
    require_customer_image: false,
    available_colors: [],
    available_sizes: []
  });
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
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
    enabled: !!storeData?.id,
  });
  
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleAddProduct = async () => {
    try {
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
            discount_price: formData.discount_price,
            stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
            track_inventory: formData.track_inventory,
            has_colors: formData.has_colors,
            has_sizes: formData.has_sizes,
            require_customer_name: formData.require_customer_name,
            require_customer_image: formData.require_customer_image,
            available_colors: formData.has_colors ? formData.available_colors : null,
            available_sizes: formData.has_sizes ? formData.available_sizes : null,
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
        discount_price: null,
        stock_quantity: 0,
        images: [],
        track_inventory: false,
        has_colors: false,
        has_sizes: false,
        require_customer_name: false,
        require_customer_image: false,
        available_colors: [],
        available_sizes: []
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
      [name]: name === 'price' || name === 'stock_quantity' || name === 'discount_price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
          
          <div className="mt-4 space-y-6">
            {/* Basic Product Information */}
            <div className="space-y-4">
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
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="أدخل وصف المنتج"
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={4}
                />
              </div>
              
              {/* Price with discount option */}
              <div className="grid gap-2">
                <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      placeholder="0.000" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      discount_price: prev.discount_price === null ? prev.price : null
                    }))}
                  >
                    <Percent className="h-4 w-4" />
                    <span>خصم</span>
                  </Button>
                </div>
              </div>
              
              {formData.discount_price !== null && (
                <div className="grid gap-2">
                  <Label htmlFor="discount_price">السعر بعد الخصم <span className="text-red-500">*</span></Label>
                  <Input 
                    id="discount_price" 
                    name="discount_price" 
                    type="number" 
                    placeholder="0.000" 
                    value={formData.discount_price} 
                    onChange={handleInputChange} 
                  />
                </div>
              )}
              
              {/* Inventory tracking switch */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="track_inventory" className="mb-1">تتبع المخزون</Label>
                  <span className="text-sm text-gray-500">
                    {formData.track_inventory ? 'كمية محدودة' : 'كمية غير محدودة'}
                  </span>
                </div>
                <Switch 
                  id="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) => handleSwitchChange('track_inventory', checked)}
                />
              </div>
              
              {/* Stock quantity, only shown if tracking inventory */}
              {formData.track_inventory && (
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
              )}
              
              {/* Advanced properties section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  خصائص متقدمة
                </h3>
                
                <div className="grid gap-4">
                  {/* Colors option */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
                    </div>
                    <Switch 
                      id="has_colors"
                      checked={formData.has_colors}
                      onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
                    />
                  </div>
                  
                  {/* Sizes option */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-500" />
                      <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
                    </div>
                    <Switch 
                      id="has_sizes"
                      checked={formData.has_sizes}
                      onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
                    />
                  </div>
                  
                  {/* Require customer name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
                    </div>
                    <Switch 
                      id="require_customer_name"
                      checked={formData.require_customer_name}
                      onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
                    />
                  </div>
                  
                  {/* Require customer image */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-red-500" />
                      <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
                    </div>
                    <Switch 
                      id="require_customer_image"
                      checked={formData.require_customer_image}
                      onCheckedChange={(checked) => handleSwitchChange('require_customer_image', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Images */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-md font-medium">صور المنتج <span className="text-red-500">*</span></Label>
                <span className="text-sm text-gray-500">
                  ({formData.images.length} من 5)
                </span>
              </div>
              
              <ImageUploadGrid 
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={5}
                storeId={storeData?.id}
              />
              
              <p className="text-xs text-gray-500 text-center">
                الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك إضافة حتى 5 صور.
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
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
