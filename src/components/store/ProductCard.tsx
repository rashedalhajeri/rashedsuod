
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: any;
  storeDomain: string;
  formatCurrency: (price: number, currency?: string) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  storeDomain,
  formatCurrency 
}) => {
  const { addToCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : product.discount_percentage || 0;
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
      <Link to={`/store/${storeDomain}/product/${product.id}`} className="block h-full">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {/* Image with loading state */}
          <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${!isImageLoaded ? 'animate-pulse' : ''}`}>
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                setIsImageLoaded(true);
              }}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy"
            />
          </div>
          
          {/* Out of stock overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-3 py-1">نفدت الكمية</Badge>
            </div>
          )}
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              خصم {discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist button */}
          <button 
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success("تمت إضافة المنتج للمفضلة");
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        <CardContent className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${star <= 4 ? 'fill-current' : ''}`} 
              />
            ))}
            <span className="text-xs text-gray-500 mr-1">(4.0)</span>
          </div>
          
          {/* Product Name */}
          <h3 className="font-bold text-lg hover:text-primary line-clamp-1 transition-colors">
            {product.name}
          </h3>
          
          {/* Product Description */}
          <p className="text-gray-600 my-2 line-clamp-2 text-sm min-h-[40px] overflow-hidden">
            {product.description || ""}
          </p>
          
          {/* Price and Status */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
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
              <Badge variant={product.inventory_status === "in_stock" ? "outline" : "secondary"} className="text-xs">
                {product.inventory_status === "in_stock" ? "متوفر" : "نفذت الكمية"}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart} 
            className="w-full gap-2 hover:shadow-md transition-all bg-primary hover:bg-primary/90"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="h-4 w-4" /> 
            إضافة للسلة
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
