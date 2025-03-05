import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase, getProductById } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ChevronRight, ChevronLeft, ShoppingCart, ArrowLeft } from "lucide-react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { toast } from "sonner";

const ProductDetail: React.FC = () => {
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const formatCurrency = getCurrencyFormatter("SAR");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("معرف المنتج غير متوفر");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getProductById(productId);

        if (error) throw error;
        if (!data) {
          setError("المنتج غير موجود");
          return;
        }

        setProduct(data);
        setActiveImage(data.image_url);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    toast.success("تمت إضافة المنتج إلى سلة التسوق");
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product?.stock_quantity || 10, value));
    setQuantity(newQuantity);
  };

  const handleImageChange = (image: string) => {
    setActiveImage(image);
  };

  const getAllImages = () => {
    if (!product) return [];
    
    const images = [];
    if (product.image_url) images.push(product.image_url);
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    
    return images;
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل المنتج..." />
      </StorefrontLayout>
    );
  }

  if (error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في تحميل المنتج"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  const allImages = getAllImages();

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to={`/store/${storeId}/products`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة إلى المنتجات
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* صور المنتج */}
          <div className="space-y-4">
            {/* عرض الصورة النشطة */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img src="/placeholder.svg" alt="Placeholder" className="w-16 h-16 opacity-50" />
                </div>
              )}
            </div>

            {/* معرض الصور المصغرة */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2 px-1">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(image)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border transition-all ${
                      activeImage === image ? "border-primary ring-2 ring-primary ring-opacity-30" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* معلومات المنتج */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.stock_quantity <= 0 && (
                  <Badge variant="destructive">غير متوفر</Badge>
                )}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    كمية محدودة
                  </Badge>
                )}
              </div>
            </div>

            {product.description && (
              <div className="py-4 border-t border-b border-gray-100">
                <h2 className="text-lg font-medium mb-2">الوصف</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {product.stock_quantity > 0 && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium ml-2">الكمية:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 border-l text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 border-r text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 mr-2">
                    {product.stock_quantity} قطعة متوفرة
                  </span>
                </div>

                <Button className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  إضافة إلى السلة
                </Button>
              </div>
            )}

            {product.stock_quantity <= 0 && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">هذا المنتج غير متوفر حالياً</p>
                    <Button variant="outline" asChild>
                      <Link to={`/store/${storeId}/products`}>
                        تصفح منتجات أخرى
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
