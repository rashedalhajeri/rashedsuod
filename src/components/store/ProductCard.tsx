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
  
  // Fake brand data for demo
  const brandLogo = "/placeholder.svg";
  const brandName = product.id % 3 === 0 ? "توني فايف" : 
                   product.id % 3 === 1 ? "مازدا" : 
                   "شركة جينيريشن ليمتد";
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
      <Link to={`/store/${storeDomain}/product/${product.id}`} className="block h-full">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
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
          
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-3 py-1">نفدت الكمية</Badge>
            </div>
          )}
          
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              خصم {discountPercentage}%
            </Badge>
          )}
          
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
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(product.price, product.currency)} <span className="text-xs text-gray-500">KWD</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src={brandLogo} alt="Brand" className="h-5 w-5 object-contain" />
              </div>
            </div>
          </div>
          
          <div className="text-gray-600 text-sm mb-1 text-right">{brandName}</div>
          
          <h3 className="font-bold text-lg hover:text-blue-600 line-clamp-2 transition-colors text-right">
            {product.name}
          </h3>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
