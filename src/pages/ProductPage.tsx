
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { toast } from "sonner";

const ProductPage = () => {
  const { productId, storeDomain } = useParams<{ productId: string; storeDomain: string }>();
  const [product, setProduct] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Get store by domain name
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeDomain)
          .single();
        
        if (storeError) throw storeError;
        if (!store) {
          setError("لم يتم العثور على المتجر");
          return;
        }
        
        setStoreData(store);
        
        // Get product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('store_id', store.id)
          .single();
        
        if (productError) throw productError;
        if (!productData) {
          setError("لم يتم العثور على المنتج");
          return;
        }
        
        setProduct(productData);
        
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    if (productId && storeDomain) {
      fetchProductData();
    }
  }, [productId, storeDomain]);
  
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase') {
      // Check stock if available
      const stockLimit = product?.stock_quantity;
      if (stockLimit && quantity >= stockLimit) {
        toast.error(`الكمية المتوفرة: ${stockLimit} فقط`);
        return;
      }
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url,
        store_id: product.store_id
      });
      toast.success("تمت إضافة المنتج إلى السلة");
    }
  };
  
  if (loading) {
    return <LoadingState message="جاري تحميل المنتج..." />;
  }
  
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to={`/store/${storeDomain}`} className="flex items-center text-sm text-blue-600 hover:underline">
            <ChevronRight className="h-4 w-4 ml-1" />
            <span>العودة للمتجر</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden border">
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-contain aspect-square"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="mb-4">
              <span className="text-2xl font-bold">{product.price} {storeData?.currency || "KWD"}</span>
            </div>
            
            {product.stock_quantity !== null && (
              <Badge className="mb-4">
                متوفر: {product.stock_quantity} قطعة
              </Badge>
            )}
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">الوصف</h3>
              <p className="text-gray-600">{product.description || "لا يوجد وصف متاح"}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <span className="ml-4">الكمية:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="ml-2 h-5 w-5" /> إضافة إلى السلة
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default ProductPage;
