
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { toast } from "sonner";

// Import refactored components
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import ProductActions from "@/components/product/ProductActions";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";

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
      style: 'currency',
      currency: storeData?.currency || 'KWD'
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
      <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <ProductBreadcrumb storeDomain={storeDomain || ''} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <ProductImage 
            imageUrl={product.image_url} 
            name={product.name}
            discount_percentage={product.discount_percentage}
            is_new={product.is_new}
          />
          
          {/* Product Info */}
          <div className="space-y-6">
            <ProductInfo 
              product={product} 
              formatCurrency={formatCurrency} 
            />
            
            <ProductActions 
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isOutOfStock={product.stock_quantity === 0}
            />
          </div>
        </div>
      </main>
      
      <StoreFooter storeName={storeData?.store_name} />
    </div>
  );
};

export default ProductPage;
