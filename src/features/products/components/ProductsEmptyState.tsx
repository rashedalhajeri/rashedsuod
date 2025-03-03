
import React from "react";
import { motion } from "framer-motion";
import { Package, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsEmptyStateProps {
  onAdd: () => void;
}

const ProductsEmptyState: React.FC<ProductsEmptyStateProps> = ({ onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-medium text-foreground mb-2">
        لا توجد منتجات بعد
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        لم تقم بإضافة أي منتجات إلى متجرك. أضف منتجك الأول الآن أو قم باستيراد منتجات من ملف.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج جديد
        </Button>
        
        <Button variant="outline">
          <Upload className="h-4 w-4 ml-2" />
          استيراد منتجات
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductsEmptyState;
