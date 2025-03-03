
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Edit, 
  Trash, 
  Share, 
  Copy, 
  ImageIcon, 
  Tag,
  Loader2,
  Info,
  Clock,
  Package,
  DollarSign,
  ExternalLink,
  ArrowLeftRight,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getProductById, deleteProduct, getCategoriesByStoreId, updateProductCategory } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

interface ProductDetails {
  id: string;
  name: string;
  description: string | null;
  price: number;
  store_id: string;
  image_url: string | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  categories?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await getProductById(id);
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError("لم يتم العثور على المنتج");
          return;
        }
        
        setProduct(data);
        setSelectedCategoryId(data.category_id);
        
        // Fetch categories
        if (data.store_id) {
          const { data: categoriesData } = await getCategoriesByStoreId(data.store_id);
          if (categoriesData) {
            setCategories(categoriesData);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
        toast.error("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleDelete = async () => {
    if (!product) return;
    
    try {
      setIsDeleting(true);
      
      const { success, error } = await deleteProduct(product.id);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        toast.success("تم حذف المنتج بنجاح");
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleCategoryChange = async () => {
    if (!product) return;
    
    try {
      setIsChangingCategory(true);
      
      const { data, error } = await updateProductCategory(product.id, selectedCategoryId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const updatedProduct = { 
          ...product, 
          category_id: selectedCategoryId,
          categories: selectedCategoryId 
            ? categories.find(c => c.id === selectedCategoryId) || null
            : null
        };
        setProduct(updatedProduct);
        toast.success("تم تحديث تصنيف المنتج بنجاح");
      }
    } catch (error) {
      console.error("Error updating product category:", error);
      toast.error("حدث خطأ أثناء تحديث تصنيف المنتج");
    } finally {
      setIsChangingCategory(false);
      setIsCategoryDialogOpen(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-KW', { 
      style: 'currency', 
      currency: 'KWD'
    }).format(price);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto text-primary-500 mb-4 animate-spin" />
            <p className="text-lg text-gray-600">جاري تحميل بيانات المنتج...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Info className="h-12 w-12 mx-auto text-orange-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">{error || "لم يتم العثور على المنتج"}</h3>
          <p className="text-gray-600 mb-4">
            لا يمكن عرض بيانات المنتج المطلوب. قد يكون المنتج غير موجود أو تم حذفه.
          </p>
          <Button 
            onClick={() => navigate("/dashboard/products")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة إلى المنتجات
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate("/dashboard/products")}
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              المنتجات
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">تفاصيل المنتج</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCategoryDialogOpen(true)}
            >
              <Tag className="h-4 w-4 ml-2" />
              تغيير التصنيف
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/products/${product.id}`, '_blank')}
            >
              <Eye className="h-4 w-4 ml-2" />
              معاينة
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 ml-2" />
              حذف
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.categories && (
                  <Badge variant="outline" className="mt-1">
                    <Tag className="h-3 w-3 ml-1" />
                    {product.categories.name}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded-md mb-6 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/300x300?text=صورة+غير+متوفرة';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">لا توجد صورة للمنتج</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">تفاصيل المنتج</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description || "لا يوجد وصف لهذا المنتج."}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 border border-gray-200">
                <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">معلومات إضافية</TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">المخزون</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">تاريخ المنتج</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="animate-fade-in bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">معلومات المنتج</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <div className="text-sm text-gray-500">معرف المنتج</div>
                      <div className="font-medium">{product.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">تاريخ الإنشاء</div>
                      <div className="font-medium">{formatDate(product.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">آخر تحديث</div>
                      <div className="font-medium">{formatDate(product.updated_at)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">التصنيف</div>
                      <div className="font-medium">
                        {product.categories ? product.categories.name : "غير مصنف"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="inventory" className="animate-fade-in bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">معلومات المخزون</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <div className="text-sm text-gray-500">كمية المخزون</div>
                      <div className="font-medium">
                        {product.stock_quantity !== null ? product.stock_quantity : "غير محدد"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">حالة المخزون</div>
                      <div>
                        {product.stock_quantity === null ? (
                          <Badge variant="outline">غير محدد</Badge>
                        ) : product.stock_quantity > 10 ? (
                          <Badge variant="success">متوفر</Badge>
                        ) : product.stock_quantity > 0 ? (
                          <Badge variant="warning">منخفض</Badge>
                        ) : (
                          <Badge variant="destructive">غير متوفر</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="animate-fade-in bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">تاريخ المنتج</h3>
                  
                  <div className="relative border-r-2 border-gray-200 pr-4 space-y-8">
                    <div className="relative">
                      <div className="absolute right-[-14.5px] top-1 w-6 h-6 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center">
                        <Package className="h-3 w-3 text-white" />
                      </div>
                      <div className="mb-1">
                        <span className="text-sm font-medium">إنشاء المنتج</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 ml-1" />
                        {formatDate(product.created_at)}
                      </div>
                    </div>
                    
                    {product.created_at !== product.updated_at && (
                      <div className="relative">
                        <div className="absolute right-[-14.5px] top-1 w-6 h-6 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center">
                          <Edit className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1">
                          <span className="text-sm font-medium">تحديث المنتج</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          {formatDate(product.updated_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملخص المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">السعر</span>
                  <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">المخزون</span>
                  <div>
                    {product.stock_quantity === null ? (
                      <Badge variant="outline">غير محدد</Badge>
                    ) : product.stock_quantity > 10 ? (
                      <Badge variant="success">{product.stock_quantity} قطعة</Badge>
                    ) : product.stock_quantity > 0 ? (
                      <Badge variant="warning">{product.stock_quantity} قطعة</Badge>
                    ) : (
                      <Badge variant="destructive">نفذت الكمية</Badge>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">التصنيف</span>
                  <span>{product.categories ? product.categories.name : "غير مصنف"}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                >
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل المنتج
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>إعدادات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`/products/${product.id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 ml-3" />
                  مشاهدة على المتجر
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
                    toast.success("تم نسخ رابط المنتج");
                  }}
                >
                  <Share className="h-4 w-4 ml-3" />
                  مشاركة المنتج
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsCategoryDialogOpen(true)}
                >
                  <Tag className="h-4 w-4 ml-3" />
                  تغيير التصنيف
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 ml-3" />
                  حذف المنتج
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تغيير تصنيف المنتج</DialogTitle>
            <DialogDescription>
              اختر التصنيف الذي ترغب في نقل المنتج إليه.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <Select 
              value={selectedCategoryId || ""} 
              onValueChange={(value) => setSelectedCategoryId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر تصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون تصنيف</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCategoryDialogOpen(false)}
              disabled={isChangingCategory}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleCategoryChange}
              disabled={isChangingCategory}
            >
              {isChangingCategory ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 ml-2" />
                  تحديث التصنيف
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج "{product.name}" نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 ml-2" />
                  حذف المنتج
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ProductDetail;
