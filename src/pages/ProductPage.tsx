
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import StoreHeader from "@/components/store/unified/StoreHeader";
import { motion } from "framer-motion";
import { useProductDetails } from "@/hooks/use-product-details";
import ProductContainer from "@/components/product/ProductContainer";
import ProductOverview from "@/components/product/ProductOverview";
import ProductPriceBar from "@/components/product/ProductPriceBar";

const ProductPage = () => {
  const { productId, storeDomain } = useParams<{ productId: string; storeDomain: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const {
    product,
    storeData,
    loading,
    error,
    showContent,
    formatCurrency,
    isOutOfStock
  } = useProductDetails(productId, storeDomain);
  
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase') {
      if (product?.track_inventory && product?.stock_quantity) {
        if (quantity >= product.stock_quantity) {
          toast.error(`الكمية المتوفرة: ${product.stock_quantity} فقط`);
          return;
        }
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
        {/* Product Container */}
        <ProductContainer 
          loading={loading} 
          product={product} 
          storeData={storeData} 
          formatCurrency={formatCurrency}
        />
        
        {/* Product Overview */}
        {!loading && product && (
          <ProductOverview 
            product={product} 
            showContent={showContent} 
          />
        )}
        
        {/* Price and Add to Cart Bar */}
        {!loading && product && (
          <ProductPriceBar
            formatCurrency={formatCurrency}
            product={product}
            showContent={showContent}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            isOutOfStock={isOutOfStock}
          />
        )}
      </main>
    </div>
  );
};

export default ProductPage;
