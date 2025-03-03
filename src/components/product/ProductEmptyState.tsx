
import React from "react";
import { Package, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductEmptyStateProps {
  onAddProduct: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onAddProduct }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-8 text-center border border-dashed border-gray-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">لا توجد منتجات</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">لم تقم بإضافة أي منتجات بعد. أضف منتجك الأول وابدأ في بناء كتالوج متجرك!</p>
      
      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <Button 
          onClick={onAddProduct}
          className="bg-primary-600 hover:bg-primary-700 gap-2"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          استيراد منتجات
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">نصائح سريعة</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>أضف صورًا عالية الجودة لمنتجاتك</li>
          <li>استخدم أوصافًا تفصيلية وواضحة</li>
          <li>حدد الأسعار والمخزون بدقة</li>
        </ul>
      </div>
    </motion.div>
  );
};
