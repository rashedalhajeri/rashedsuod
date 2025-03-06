
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Minus, Plus, ShoppingCart, ChevronRight, Heart, Share2, ShieldCheck, Star } from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
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

  // تنسيق العملة
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: storeData?.currency || 'KWD'
    }).format(price);
  };
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to={`/store/${storeDomain}`} className="flex items-center text-sm text-primary hover:underline">
            <ChevronRight className="h-4 w-4 ml-1" />
            <span>العودة للمتجر</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image - تحسين عرض الصور */}
          <div className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
            <div className="relative aspect-square bg-gray-100 animate-pulse flex items-center justify-center">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                  setImageLoaded(true);
                }}
                onLoad={() => {
                  setImageLoaded(true);
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              )}
              {/* Badges & Actions */}
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {product.discount_percentage > 0 && (
                  <Badge className="bg-red-500 text-white">خصم {product.discount_percentage}%</Badge>
                )}
                {product.is_new && (
                  <Badge className="bg-green-500 text-white">جديد</Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm text-gray-500">(15 تقييم)</span>
              </div>
              
              <div className="mb-4 flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
              </div>
              
              {product.stock_quantity !== null && (
                <Badge className={`mb-4 px-3 py-1 ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  متوفر: {product.stock_quantity} قطعة
                </Badge>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-medium mb-2">الوصف</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "لا يوجد وصف متاح لهذا المنتج"}
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>شحن سريع</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>استرجاع سهل</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>دفع آمن</span>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <span className="ml-4 font-medium">الكمية:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full gap-2"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="ml-2 h-5 w-5" /> إضافة إلى السلة
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="w-full border-primary/20 text-primary hover:bg-primary/5"
              >
                <Heart className="ml-2 h-5 w-5" /> أضف للمفضلة
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
