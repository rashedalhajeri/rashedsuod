
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden">
          <Link to={`/store/${storeDomain}/product/${product.id}`}>
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover transition-all hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </Link>
          
          <CardContent className="p-4">
            <Link 
              to={`/store/${storeDomain}/product/${product.id}`}
              className="font-medium text-lg hover:text-blue-600 line-clamp-1"
            >
              {product.name}
            </Link>
            
            <p className="text-gray-600 my-2 line-clamp-2 text-sm">
              {product.description || ""}
            </p>
            
            <div className="font-bold text-lg mt-1">
              {product.price} {product.currency || "KWD"}
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
