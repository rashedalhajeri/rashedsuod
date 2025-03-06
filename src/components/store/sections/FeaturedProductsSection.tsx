
import React from "react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/store/ProductGrid";

interface FeaturedProductsSectionProps {
  products: any[];
  onViewAll: () => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ 
  products, 
  onViewAll 
}) => {
  if (products.length === 0) return null;
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="store-section-title">منتجات مميزة</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:bg-primary/5"
            onClick={onViewAll}
          >
            عرض الكل
          </Button>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
