
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Share } from "lucide-react";
import { Link } from "react-router-dom";

// Import refactored components
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import ProductActions from "@/components/product/ProductActions";

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
  
  // تنسيق العملة
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  if (loading) {
    return <LoadingState message="جاري تحميل المنتج..." />;
  }
  
  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white p-4 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link to={`/store/${storeDomain}`} className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-center">تفاصيل المنتج</h1>
          <Link to={`/store/${storeDomain}/cart`} className="text-white">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-50">
        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-sm mx-4 -mt-4 overflow-hidden">
          {/* Product Image */}
          <ProductImage 
            imageUrl={product.image_url} 
            name={product.name}
            discount_percentage={product.discount_percentage}
            is_new={product.is_new}
            storeLogo={storeData?.logo_url}
            storeName={storeData?.store_name}
          />
          
          {/* Product Info */}
          <ProductInfo 
            product={product} 
            formatCurrency={formatCurrency} 
            storeData={storeData}
          />
        </div>
        
        {/* Product Overview Section */}
        <div className="mt-4 mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <h2 className="text-xl font-bold p-4">نظرة عامة</h2>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-2">وصف المنتج</h3>
            <p className="text-gray-700">
              {product.description || "لا يوجد وصف متاح لهذا المنتج"}
            </p>
            
            {/* Additional product details bullets */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-4">
                <ul className="space-y-2">
                  {product.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed bottom bar for add to cart */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(product.price)} <span className="text-sm font-normal">KWD</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            إضافة للسلة
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
