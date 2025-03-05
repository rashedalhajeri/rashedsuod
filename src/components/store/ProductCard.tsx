
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock_quantity?: number;
  };
  storeId: string;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  storeId, 
  currency = "SAR" 
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

  return (
    <Link to={`/store/${storeId}/products/${product.id}`} className="group block">
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
        <div className="aspect-square bg-gray-100 relative">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <img 
                src="/placeholder.svg" 
                alt="Placeholder" 
                className="w-16 h-16 opacity-50" 
              />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                غير متوفر
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-900 font-bold">{formatCurrency(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
