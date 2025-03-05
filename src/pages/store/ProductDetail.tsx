
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, getProductById } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";

const StoreProductDetail: React.FC = () => {
  const { storeId, productId } = useParams<{ storeId: string, productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId || !storeId) {
        setError("معلومات المنتج غير متوفرة");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching product ID: ${productId} for store: ${storeId}`);
        
        const { data, error } = await getProductById(productId);
        
        if (error) throw error;
        if (!data) {
          setError("المنتج غير موجود");
          return;
        }
        
        // Verify the product belongs to this store
        if (data.store_id !== storeId) {
          setError("هذا المنتج لا ينتمي إلى هذا المتجر");
          return;
        }
        
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, storeId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // TODO: Implement add to cart functionality
    toast.success(`تم إضافة ${product.name} إلى سلة التسوق`);
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل بيانات المنتج..." />
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

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">لم يتم العثور على المنتج</p>
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate(`/store/${storeId}/products`)}>
                  العودة إلى المنتجات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-md overflow-hidden aspect-square flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <img 
                    src="/placeholder.svg" 
                    alt="Placeholder" 
                    className="w-32 h-32 opacity-50" 
                  />
                )}
              </div>
              
              {/* Product Details */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-xl font-semibold">{product.price} ر.س</p>
                
                {product.stock_quantity > 0 ? (
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm inline-block">
                    متوفر ({product.stock_quantity})
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm inline-block">
                    غير متوفر
                  </div>
                )}
                
                <p className="text-gray-600">{product.description}</p>
                
                <div className="pt-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Button 
                      size="lg" 
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity <= 0}
                    >
                      إضافة إلى السلة
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StorefrontLayout>
  );
};

export default StoreProductDetail;
