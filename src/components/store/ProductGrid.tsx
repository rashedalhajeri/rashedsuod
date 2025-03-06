
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0">
          <Link to={`/store/${storeDomain}/product/${product.id}`}>
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover transition-all hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm">نفدت الكمية</Badge>
                </div>
              )}
            </div>
          </Link>
          
          <CardContent className="p-4">
            <div className="flex items-center gap-1 text-yellow-500 mb-1">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
            </div>
            
            <Link 
              to={`/store/${storeDomain}/product/${product.id}`}
              className="font-bold text-lg hover:text-primary line-clamp-1 transition-colors"
            >
              {product.name}
            </Link>
            
            <p className="text-gray-600 my-2 line-clamp-2 text-sm h-10">
              {product.description || ""}
            </p>
            
            <div className="font-bold text-lg mt-2">
              {formatCurrency(product.price, product.currency)}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={() => handleAddToCart(product)} 
              className="w-full"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="ml-2 h-4 w-4" /> 
              إضافة للسلة
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
