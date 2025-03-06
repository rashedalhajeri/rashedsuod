
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import StoreHeader from "@/components/store/unified/StoreHeader";
import { motion } from "framer-motion";

import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import ProductActions from "@/components/product/ProductActions";
import ProductImageSkeleton from "@/components/product/ProductImageSkeleton";
import ProductInfoSkeleton from "@/components/product/ProductInfoSkeleton";

const ProductPage = () => {
  const { productId, storeDomain } = useParams<{ productId: string; storeDomain: string }>();
  const [product, setProduct] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
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
        // Add delay for smoother transitions
        setTimeout(() => {
          setLoading(false);
          // Short delay before showing content for smooth transition
          setTimeout(() => {
            setShowContent(true);
          }, 100);
        }, 300);
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
      toast.success("تمت الإضافة", {
        duration: 1000,
        className: "text-sm py-1 px-2 max-w-[150px]",
        position: "top-center"
      });
    }
  };
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ErrorState title="خطأ" message={error} />
      </motion.div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreHeader
        title="تفاصيل المنتج"
        storeDomain={storeDomain}
        showBackButton={true}
      />
      
      <main className="flex-grow bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-sm mx-4 -mt-4 overflow-hidden"
        >
          {loading ? (
            <ProductImageSkeleton />
          ) : (
            <ProductImage 
              imageUrl={product.image_url} 
              name={product.name}
              discount_percentage={product.discount_percentage}
              is_new={product.is_new}
              storeLogo={storeData?.logo_url}
              storeName={storeData?.store_name}
            />
          )}
          
          <div className="p-4">
            {loading ? (
              <ProductInfoSkeleton />
            ) : (
              <ProductInfo 
                product={product} 
                formatCurrency={formatCurrency} 
              />
            )}
          </div>
        </motion.div>
        
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 mx-4 bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100">
              <h2 className="text-xl font-bold p-4">نظرة عامة</h2>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-2">وصف المنتج</h3>
              <p className="text-gray-700">
                {product.description || "لا يوجد وصف متاح لهذا المنتج"}
              </p>
              
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
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center"
        >
          {!loading && (
            <>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(product.price)} <span className="text-sm font-normal">KWD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mr-2">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  إضافة للسلة
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProductPage;
