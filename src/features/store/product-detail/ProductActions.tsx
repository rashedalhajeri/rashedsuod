
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductActionsProps {
  product: any;
  storeId: string;
  quantity: number;
  onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  storeId, 
  quantity, 
  onAddToCart 
}) => {
  if (product.stock_quantity <= 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 mb-2">هذا المنتج غير متوفر حالياً</p>
            <Button variant="outline" asChild>
              <Link to={`/store/${storeId}/products`}>
                تصفح منتجات أخرى
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button className="w-full" onClick={onAddToCart}>
      <ShoppingCart className="h-4 w-4 ml-2" />
      إضافة إلى السلة
    </Button>
  );
};

export default ProductActions;
