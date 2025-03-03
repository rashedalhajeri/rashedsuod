
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Trash, PenSquare, ShoppingCart, Package, Tag, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProductById, updateProduct, deleteProduct, getCategoriesByStoreId } from '@/integrations/supabase/client';
import { AuthContext } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { useMobile } from '@/hooks/use-mobile';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useContext(AuthContext);
  const isMobile = useMobile();
  
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Error state
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      if (!session || !id) return;
      
      try {
        setLoading(true);
        
        // Get user's store ID
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (storeError || !storeData) {
          toast({
            title: "خطأ في التحميل",
            description: "لم نتمكن من تحميل معلومات المتجر",
            variant: "destructive",
          });
          navigate('/products');
          return;
        }
        
        setStoreId(storeData.id);
        
        // Get product data
        const { data: productData, error: productError } = await getProductById(id);
        
        if (productError || !productData) {
          toast({
            title: "خطأ في التحميل",
            description: "لم نتمكن من تحميل بيانات المنتج",
            variant: "destructive",
          });
          navigate('/products');
          return;
        }
        
        // Check if product belongs to the user's store
        if (productData.store_id !== storeData.id) {
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحية لعرض هذا المنتج",
            variant: "destructive",
          });
          navigate('/products');
          return;
        }
        
        setProduct(productData);
        setName(productData.name || '');
        setDescription(productData.description || '');
        setPrice(productData.price.toString() || '');
        setStockQuantity(productData.stock_quantity?.toString() || '');
        setImageUrl(productData.image_url || '');
        setCategoryId(productData.category_id || null);
        
        // Get categories
        const { data: categoriesData } = await getCategoriesByStoreId(storeData.id);
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل بيانات المنتج",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, session, navigate, toast]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('اسم المنتج مطلوب');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) {
      setPriceError('الرجاء إدخال سعر صحيح');
      isValid = false;
    } else {
      setPriceError('');
    }
    
    return isValid;
  };
  
  const handleSave = async () => {
    if (!validateForm() || !id || !storeId) return;
    
    try {
      setSaving(true);
      
      const updatedProduct = {
        name,
        description: description || null,
        price: parseFloat(price),
        stock_quantity: stockQuantity ? parseInt(stockQuantity) : null,
        image_url: imageUrl || null,
        category_id: categoryId,
      };
      
      const { data, error } = await updateProduct(id, updatedProduct);
      
      if (error) {
        throw error;
      }
      
      setProduct(data?.[0] || null);
      setEditMode(false);
      
      toast({
        title: "تم الحفظ",
        description: "تم تحديث المنتج بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء تحديث المنتج",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      
      const { success, error } = await deleteProduct(id);
      
      if (error || !success) {
        throw error;
      }
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج بنجاح",
        variant: "default",
      });
      
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ في التحميل</AlertTitle>
          <AlertDescription>لم نتمكن من العثور على المنتج المطلوب</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const selectedCategory = categories.find(cat => cat.id === categoryId);
  
  return (
    <div className="container py-4 lg:py-8 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">المنتجات</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/products/${id}`}>{product.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-2xl font-bold">{editMode ? 'تعديل المنتج' : 'تفاصيل المنتج'}</h1>
        </div>
        
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PenSquare className="h-4 w-4" />
                تعديل
              </Button>
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    حذف
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>هل أنت متأكد من حذف المنتج؟</DialogTitle>
                    <DialogDescription>
                      هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المنتج نهائياً من قاعدة البيانات.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                إلغاء
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                معلومات المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={nameError ? 'border-red-500' : ''}
                    />
                    {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف المنتج</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                        className={priceError ? 'border-red-500' : ''}
                      />
                      {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stock">المخزون</Label>
                      <Input
                        id="stock"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">التصنيف</Label>
                    <Select
                      value={categoryId || ""}
                      onValueChange={(value) => setCategoryId(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر تصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">بدون تصنيف</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">رابط الصورة</Label>
                    <Input
                      id="image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    {selectedCategory && (
                      <Badge variant="secondary" className="mt-1">
                        <Tag className="h-3 w-3 ml-1" />
                        {selectedCategory.name}
                      </Badge>
                    )}
                  </div>
                  
                  {product.description && (
                    <div className="pt-2">
                      <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Separator />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">السعر</h4>
                      <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">المخزون</h4>
                      {product.stock_quantity !== null ? (
                        <div className="flex items-center">
                          <Badge 
                            variant={product.stock_quantity > 10 ? "default" : "outline"}
                            className="mt-1"
                          >
                            {product.stock_quantity > 0 ? `${product.stock_quantity} قطعة` : 'نفذت الكمية'}
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-gray-500">-</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                معاينة المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-4">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={name} 
                  className="max-w-full h-auto max-h-[240px] object-contain rounded-md"
                />
              ) : (
                <div className="w-full h-[240px] bg-gray-100 rounded-md flex justify-center items-center">
                  <p className="text-gray-400">لا توجد صورة</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {!editMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الإنشاء</span>
                  <span>{new Date(product.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">آخر تحديث</span>
                  <span>{new Date(product.updated_at).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم المنتج</span>
                  <span className="font-mono">{product.id.slice(0, 8)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
