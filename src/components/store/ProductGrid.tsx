
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { addToCart } = useCart();
  
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      store_id: product.store_id
    });
    toast.success("تمت إضافة المنتج إلى السلة");
  };
  
  const formatCurrency = (price: number, currency = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 mb-4">لا توجد منتجات متاحة حالياً</p>
        <p className="text-sm text-gray-400">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
          <Link to={`/store/${storeDomain}/product/${product.id}`}>
            <div className="aspect-square overflow-hidden bg-gray-50 relative">
              {/* تحسين عرض الصور مع fallback آمن */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                <img 
                  src={product.image_url || "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null; // منع تكرار الخطأ
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                  onLoad={(e) => {
                    // عند تحميل الصورة بنجاح، نزيل تأثير النبض
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.classList.remove('animate-pulse', 'bg-gray-100');
                    }
                  }}
                  loading="lazy"
                />
              </div>
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm px-3 py-1">نفدت الكمية</Badge>
                </div>
              )}
              {product.discount_percentage > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  خصم {product.discount_percentage}%
                </Badge>
              )}
              <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </Link>
          
          <CardContent className="p-4">
            <div className="flex items-center gap-1 text-yellow-500 mb-1">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
              <span className="text-xs text-gray-500 mr-1">(4.0)</span>
            </div>
            
            <Link 
              to={`/store/${storeDomain}/product/${product.id}`}
              className="font-bold text-lg hover:text-primary line-clamp-1 transition-colors block"
            >
              {product.name}
            </Link>
            
            <p className="text-gray-600 my-2 line-clamp-2 text-sm h-10 overflow-hidden">
              {product.description || ""}
            </p>
            
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-bold text-lg text-primary">
                  {formatCurrency(product.price, product.currency)}
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.original_price, product.currency)}
                  </div>
                )}
              </div>
              {product.inventory_status && (
                <Badge variant="outline" className="text-xs">
                  {product.inventory_status === "in_stock" ? "متوفر" : "نفذت الكمية"}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={() => handleAddToCart(product)} 
              className="w-full gap-2 hover:shadow-md transition-all"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4" /> 
              إضافة للسلة
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
