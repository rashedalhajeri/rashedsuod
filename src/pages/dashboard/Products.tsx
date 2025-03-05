
import React, { useState, useRef, useCallback } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Filter, Search, Edit, Trash2, Eye, MoreHorizontal, Upload, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
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
import { Progress } from "@/components/ui/progress";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
}

interface FormErrors {
  name?: string;
  price?: string;
  image?: string;
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
    image_url: null
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');

  // Reset form when dialog is opened/closed
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: null
    });
    setFormErrors({});
    setUploadState('idle');
    setUploadProgress(0);
  }, []);
  
  // فتشت بيانات المنتجات
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: storeData } = await useStoreData().refetch();
      
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
    }
  });
  
  // تصفية المنتجات حسب البحث
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // التحقق من المدخلات
  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "يرجى إدخال اسم المنتج";
    }
    
    if (formData.price <= 0) {
      errors.price = "يجب أن يكون السعر أكبر من صفر";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // محاكاة تقدم الرفع
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  // رفع ملف الصورة
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast.error("يرجى رفع صورة فقط");
      setFormErrors(prev => ({ ...prev, image: "يرجى رفع صورة فقط" }));
      return;
    }
    
    // التحقق من حجم الملف (أقل من 5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
      setFormErrors(prev => ({ ...prev, image: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت" }));
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadState('uploading');
      setFormErrors(prev => ({ ...prev, image: undefined }));
      
      const stopSimulation = simulateUploadProgress();
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `${storeData.id}/${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // رفع الملف إلى تخزين Supabase
      const { data, error } = await supabase.storage
        .from('store-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      stopSimulation();
      
      if (error) {
        throw error;
      }
      
      setUploadProgress(100);
      
      // الحصول على رابط الصورة العام
      const { data: urlData } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);
      
      // تحديث نموذج البيانات مع عنوان URL للصورة
      setFormData(prev => ({
        ...prev,
        image_url: urlData.publicUrl
      }));
      
      setUploadState('success');
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadState('error');
      setFormErrors(prev => ({ ...prev, image: "حدث خطأ أثناء رفع الصورة" }));
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };
  
  // إضافة منتج جديد
  const handleAddProduct = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      const { data: storeData } = await useStoreData().refetch();
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeData.id,
            name: formData.name.trim(),
            description: formData.description?.trim() || null,
            price: formData.price,
            stock_quantity: formData.stock_quantity || 0,
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
      resetForm();
      
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
      // إذا كان المنتج يحتوي على صورة، نحذفها أولاً
      if (selectedProduct.image_url) {
        // استخراج المسار من URL الصورة
        const imageUrl = selectedProduct.image_url;
        const storageUrl = supabase.storage.from('store-images').getPublicUrl('').data.publicUrl;
        
        if (imageUrl.startsWith(storageUrl)) {
          const imagePath = imageUrl.replace(storageUrl + '/', '');
          
          // حذف الصورة من التخزين
          const { error: storageError } = await supabase.storage
            .from('store-images')
            .remove([imagePath]);
            
          if (storageError) {
            console.error("Error deleting product image:", storageError);
            // نستمر في حذف المنتج حتى لو فشل حذف الصورة
          }
        }
      }
      
      // حذف المنتج
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
    
    // إزالة رسائل الخطأ عند الكتابة
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) || 0 : value
    }));
  };
  
  // إزالة الصورة
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: null }));
    setUploadState('idle');
    setUploadProgress(0);
    
    // إعادة تعيين قيمة حقل الملف
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // عرض حالة فارغة إذا لم تكن هناك منتجات
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
  
  // عرض المنتجات في الجدول
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
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
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
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{product.description || "بدون وصف"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-bold text-lg">{formatCurrency(product.price)}</div>
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
  
  // عرض مكون رفع الصورة
  const renderImageUploader = () => {
    return (
      <div className="grid gap-2">
        <Label htmlFor="image_url">صورة المنتج</Label>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          
          {formData.image_url ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-green-200">
              <img 
                src={formData.image_url} 
                alt="Product" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-0 right-0 p-2 flex gap-2">
                <Button 
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-green-50 text-green-700 p-2 text-sm flex items-center gap-2 border-t border-green-200">
                <CheckCircle className="h-4 w-4" />
                تم رفع الصورة بنجاح
              </div>
            </div>
          ) : (
            <div 
              className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition ${
                uploadState === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadState === 'uploading' ? (
                <div className="flex flex-col items-center w-full px-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    <p className="text-sm font-medium">جاري رفع الصورة...</p>
                  </div>
                  <Progress value={uploadProgress} className="w-full h-2" />
                  <p className="text-xs text-gray-500 mt-2">{Math.round(uploadProgress)}%</p>
                </div>
              ) : uploadState === 'error' ? (
                <>
                  <div className="rounded-full bg-red-100 p-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-sm font-medium text-red-600">فشل رفع الصورة</p>
                  <p className="text-xs text-red-500">{formErrors.image}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadState('idle');
                      setFormErrors(prev => ({ ...prev, image: undefined }));
                    }}
                  >
                    حاول مرة أخرى
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">اضغط هنا لرفع صورة</p>
                  <p className="text-xs text-gray-500">يدعم صيغ JPG، PNG بحد أقصى 5MB</p>
                </>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Image className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="image_url" 
                name="image_url" 
                placeholder="أو أدخل رابط صورة المنتج مباشرة" 
                value={formData.image_url || ''} 
                onChange={handleInputChange}
                className="pl-3 pr-10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 ml-2" />
              رفع صورة
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <Button className="gap-2" onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>
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
      
      {/* مربع حوار إضافة منتج */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة منتج جديد</DialogTitle>
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
                    className={formErrors.name ? "border-red-300" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500">{formErrors.name}</p>
                  )}
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
                
                {renderImageUploader()}
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.price === 0 ? "" : formData.price} 
                      onChange={handleInputChange}
                      className={`pl-16 text-base font-semibold dir-ltr ${formErrors.price ? "border-red-300" : ""}`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 border-r border-gray-200 pr-2">
                      <span className="text-sm">{storeData?.currency || 'KWD'}</span>
                    </div>
                  </div>
                  {formErrors.price && (
                    <p className="text-sm text-red-500">{formErrors.price}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                  <Input 
                    id="stock_quantity" 
                    name="stock_quantity" 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock_quantity === 0 ? "" : formData.stock_quantity} 
                    onChange={handleInputChange} 
                  />
                  <p className="text-xs text-gray-500">اترك الكمية كـ 0 إذا كان المنتج غير متوفر في المخزون</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddProduct} disabled={isUploading}>
              إضافة المنتج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* مربع حوار حذف منتج */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المنتج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-md border border-red-100">
              <div className="h-12 w-12 bg-white rounded overflow-hidden border border-red-100">
                {selectedProduct.image_url ? (
                  <img 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-gray-400 m-3" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500">السعر: {formatCurrency(selectedProduct.price)}</p>
              </div>
            </div>
          )}
          
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
