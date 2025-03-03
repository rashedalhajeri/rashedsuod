
import React from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Tag, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url?: string | null;
  stock_quantity?: number | null;
  category?: string | null;
}

interface ProductCardProps {
  product: Product;
  formatCurrency: (price: number) => string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, formatCurrency }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="h-48 bg-gray-100 relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Handle image loading error
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://via.placeholder.com/300x150?text=صورة+غير+متوفرة';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {product.category && (
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {product.category}
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{product.description || "لا يوجد وصف"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-primary-700">{formatCurrency(product.price)}</span>
          {product.stock_quantity !== null && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 
              product.stock_quantity > 0 ? 'bg-orange-100 text-orange-800' : 
              'bg-red-100 text-red-800'
            }`}>
              المخزون: {product.stock_quantity}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t pt-3">
        <Button 
          variant="ghost" 
          className="w-full text-primary-600 hover:text-primary-700 hover:bg-gray-100"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          عرض التفاصيل
          <ChevronRight className="h-4 w-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
