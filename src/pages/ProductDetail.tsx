
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, getProductById, updateProduct, deleteProduct } from "@/integrations/supabase/client";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SaveButton from "@/components/ui/save-button";
import ImageUploadGrid from "@/components/ui/image-upload-grid";
import { fetchCategories } from "@/services/category-service";
import { Percent, Box, Tag, User, Image as ImageIcon } from "lucide-react";
import { Product } from "@/utils/product-helpers";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount_price: null as number | null,
    stock_quantity: 0,
    track_inventory: false,
    images: [] as string[],
    category_id: "" as string | null,
    has_colors: false,
    has_sizes: false,
    require_customer_name: false,
    require_customer_image: false,
    available_colors: [] as string[] | null,
    available_sizes: [] as string[] | null
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const { data, error } = await getProductById(productId);
        
        if (error) throw error;
        if (!data) {
          setError("المنتج غير موجود");
          return;
        }
        
        setProduct(data);
        
        const allImages = [
          ...(data.image_url ? [data.image_url] : []),
          ...(data.additional_images || [])
        ];
        
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          discount_price: data.discount_price || null,
          stock_quantity: data.stock_quantity || 0,
          track_inventory: data.track_inventory !== undefined ? data.track_inventory : !!data.stock_quantity,
          images: allImages,
          category_id: data.category_id || null,
          has_colors: data.has_colors || false,
          has_sizes: data.has_sizes || false,
          require_customer_name: data.require_customer_name || false,
          require_customer_image: data.require_customer_image || false,
          available_colors: data.available_colors || [],
          available_sizes: data.available_sizes || []
        });

        if (storeData?.id) {
          const { data: categoriesData } = await fetchCategories(storeData.id);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, storeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock_quantity" || name === "discount_price" ? 
        parseFloat(value) || 0 : 
        value
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

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: categoryId
    }));
  };

  const handleSave = async () => {
    if (!productId || !product) return;
    
    try {
      setSaving(true);
      
      if (formData.images.length === 0) {
        toast.error("يرجى إضافة صورة واحدة على الأقل");
        setSaving(false);
        return;
      }
      
      const updates = {
        ...formData,
        stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
        image_url: formData.images[0] || null,
        additional_images: formData.images.length > 1 ? formData.images.slice(1) : [],
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await updateProduct(productId, updates);
      
      if (error) throw error;
      
      setProduct(data[0]);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    
    try {
      setSaving(true);
      const { success, error } = await deleteProduct(productId);
      
      if (error) throw error;
      if (success) {
        toast.success("تم حذف المنتج بنجاح");
        navigate("/products");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="جاري تحميل بيانات المنتج..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتج"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/products")}>
            العودة للمنتجات
          </Button>
          <SaveButton isSaving={saving} onClick={handleSave} />
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">التفاصيل الأساسية</TabsTrigger>
          <TabsTrigger value="media">الصور والوسائط</TabsTrigger>
          <TabsTrigger value="advanced">إعدادات متقدمة</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المنتج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسم المنتج"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="أدخل وصف المنتج"
                  rows={5}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر</Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.001"
                      value={formData.price}
                      onChange={handleChange}
                      className="flex-1"
                    />
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
                  <div className="space-y-2">
                    <Label htmlFor="discount_price">السعر بعد الخصم</Label>
                    <Input
                      id="discount_price"
                      name="discount_price"
                      type="number"
                      min="0"
                      step="0.001"
                      value={formData.discount_price}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
              
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
              
              {formData.track_inventory && (
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select 
                  value={formData.category_id || ""} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">بدون فئة</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>صور المنتج</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>صور المنتج</Label>
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
                
                {formData.images.length === 0 && (
                  <div className="p-4 border rounded-md border-yellow-200 bg-yellow-50 text-yellow-700 text-sm">
                    لم يتم إضافة أي صور للمنتج. يوصى بإضافة صورة واحدة على الأقل.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>خصائص متقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Colors option */}
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-500" />
                    <div>
                      <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
                      <p className="text-xs text-gray-500">إضافة خيارات الألوان للمنتج</p>
                    </div>
                  </div>
                  <Switch 
                    id="has_colors"
                    checked={formData.has_colors}
                    onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
                  />
                </div>
                
                {/* Sizes option */}
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <div>
                      <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
                      <p className="text-xs text-gray-500">إضافة خيارات المقاسات للمنتج</p>
                    </div>
                  </div>
                  <Switch 
                    id="has_sizes"
                    checked={formData.has_sizes}
                    onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
                  />
                </div>
                
                {/* Require customer name */}
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <div>
                      <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
                      <p className="text-xs text-gray-500">سيطلب من العميل إدخال اسمه عند إضافة المنتج للسلة</p>
                    </div>
                  </div>
                  <Switch 
                    id="require_customer_name"
                    checked={formData.require_customer_name}
                    onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
                  />
                </div>
                
                {/* Require customer image */}
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-red-500" />
                    <div>
                      <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
                      <p className="text-xs text-gray-500">سيطلب من العميل رفع صورة عند إضافة المنتج للسلة</p>
                    </div>
                  </div>
                  <Switch 
                    id="require_customer_image"
                    checked={formData.require_customer_image}
                    onCheckedChange={(checked) => handleSwitchChange('require_customer_image', checked)}
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">حذف المنتج</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف المنتج بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        تأكيد الحذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
