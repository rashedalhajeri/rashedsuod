
import React from "react";
import { motion } from "framer-motion";

interface ProductOverviewProps {
  product: any;
  showContent: boolean;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product, showContent }) => {
  return (
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
  );
};

export default ProductOverview;
