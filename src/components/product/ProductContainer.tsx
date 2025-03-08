
import React from "react";
import { motion } from "framer-motion";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import ProductImageSkeleton from "@/components/product/ProductImageSkeleton";
import ProductInfoSkeleton from "@/components/product/ProductInfoSkeleton";

interface ProductContainerProps {
  loading: boolean;
  product: any;
  storeData: any;
  formatCurrency: (price: number) => string;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ 
  loading, 
  product, 
  storeData,
  formatCurrency
}) => {
  return (
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
            product={{
              ...product,
              stock_quantity: product.track_inventory ? product.stock_quantity : null
            }} 
            formatCurrency={formatCurrency} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProductContainer;
