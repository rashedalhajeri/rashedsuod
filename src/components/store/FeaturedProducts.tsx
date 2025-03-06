
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { toast } from "sonner";

interface FeaturedProductsProps {
  products: any[];
  isLoading: boolean;
  storeId: string;
  currency: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading,
  storeId,
  currency
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.preventDefault(); // منع الانتقال للمنتج عند النقر على الزر
    toast.success(`تم إضافة ${productName} إلى سلة التسوق`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton className="h-56 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-xl font-medium mb-2">لا توجد منتجات مميزة</h3>
        <p className="text-gray-500">
          لم يتم تمييز أي منتجات حتى الآن
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link 
          to={`/store/${storeId}/products/${product.id}`} 
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative"
        >
          <div className="h-56 bg-gray-100 overflow-hidden relative">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* علامة منتج مميز */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              <span>مميز</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description || ""}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-blue-600 font-bold">
                {formatCurrency(product.price)}
              </span>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={(e) => handleAddToCart(e, product.name)}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة للسلة</span>
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedProducts;
