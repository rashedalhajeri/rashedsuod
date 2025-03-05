
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Share2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import StorefrontLayout from "@/layouts/StorefrontLayout";

const ProductDetail: React.FC = () => {
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // Fetch store data
  const { data: storeData, isLoading: isLoadingStore, error: storeError } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("domain_name", storeId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });
  
  // Fetch product data
  const { 
    data: product, 
    isLoading: isLoadingProduct, 
    error: productError 
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
  
  // Set RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    // Get existing cart items or initialize an empty array
    const existingCartItems = JSON.parse(localStorage.getItem("cart-items") || "[]");
    
    // Check if product is already in cart
    const existingItemIndex = existingCartItems.findIndex(
      (item: any) => item.id === product.id
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists in cart
      existingCartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url,
        store_id: product.store_id
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart-items", JSON.stringify(existingCartItems));
    
    // Dispatch custom event to notify other components of cart update
    window.dispatchEvent(new Event("cart-updated"));
    
    toast.success("تمت إضافة المنتج إلى السلة");
  };
  
  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };
  
  if (isLoadingStore || isLoadingProduct) {
    return <LoadingState message="جاري تحميل المنتج..." />;
  }
  
  if (storeError || !storeData) {
    return (
      <ErrorState
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب"
      />
    );
  }
  
  if (productError || !product) {
    return (
      <ErrorState
        title="لم يتم العثور على المنتج"
        message="تعذر العثور على المنتج المطلوب"
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button onClick={() => navigate(`/store/${storeId}`)} className="hover:text-primary">
            الرئيسية
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
          <button onClick={() => navigate(`/store/${storeId}/products`)} className="hover:text-primary">
            المنتجات
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="aspect-square relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">لا توجد صورة</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-primary">{product.price} ر.س</div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {product.stock_quantity !== null && product.stock_quantity > 0 ? (
              <Badge className="bg-green-500 mb-4">متوفر في المخزون</Badge>
            ) : (
              <Badge variant="destructive" className="mb-4">غير متوفر حاليًا</Badge>
            )}
            
            <div className="mb-6">
              <p className="text-gray-600">{product.description || "لا يوجد وصف متاح لهذا المنتج."}</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">الكمية</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-md"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="h-10 w-16 flex items-center justify-center border-y border-gray-200">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-md"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              className="w-full mb-4"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock_quantity !== null && product.stock_quantity <= 0}
            >
              <ShoppingBag className="ml-2 h-5 w-5" />
              إضافة إلى السلة
            </Button>
          </div>
        </div>
        
        {/* Product Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="details">التفاصيل</TabsTrigger>
            <TabsTrigger value="specifications">المواصفات</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">تفاصيل المنتج</h3>
            <p className="text-gray-600">
              {product.description || "لا توجد تفاصيل إضافية لهذا المنتج."}
            </p>
          </TabsContent>
          
          <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">مواصفات المنتج</h3>
            <p className="text-gray-600">لا توجد مواصفات إضافية لهذا المنتج.</p>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">تقييمات العملاء</h3>
            <p className="text-gray-600">لا توجد تقييمات لهذا المنتج حتى الآن.</p>
          </TabsContent>
        </Tabs>
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
