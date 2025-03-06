import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, getProductById, updateProduct, deleteProduct } from "@/integrations/supabase/client";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SaveButton from "@/components/ui/save-button";
import ImageUploadGrid from "@/components/ui/image-upload-grid";
import { fetchCategories } from "@/services/category-service";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    images: [] as string[],
    category_id: "" as string | null
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
          stock_quantity: data.stock_quantity || 0,
          images: allImages,
          category_id: data.category_id || null
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
      [name]: name === "price" || name === "stock_quantity" ? 
        parseFloat(value) || 0 : 
        value
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
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                
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
              </div>
              
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
                  <Label>صور المنتج</Label>
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
              <CardTitle>إعدادات متقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">يمكنك إجراء عمليات متقدمة للمنتج هنا.</p>
              
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
