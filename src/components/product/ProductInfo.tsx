
import React from "react";
import { Star, Share2, ShieldCheck, Truck, Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    original_price?: number;
    description?: string;
    stock_quantity?: number | null;
    track_inventory?: boolean;
  };
  formatCurrency?: (price: number) => string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  formatCurrency: propFormatCurrency
}) => {
  // Use the provided formatter or fall back to our own
  const formatCurrency = propFormatCurrency || getCurrencyFormatter();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" />
          </div>
          <span className="text-sm text-gray-500">(15 تقييم)</span>
        </div>
        
        <div className="mb-4 flex items-center gap-4">
          <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-lg text-gray-400 line-through">
              {formatCurrency(product.original_price)}
            </span>
          )}
          
          {product.original_price && product.original_price > product.price && (
            <Badge className="bg-red-100 text-red-800 px-2 py-1">
              خصم {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
            </Badge>
          )}
        </div>
        
        {/* Only show stock badge when track_inventory is true */}
        {product.track_inventory && product.stock_quantity !== null && (
          <Badge className={`mb-4 px-3 py-1 ${
            product.stock_quantity > 10 
              ? 'bg-green-100 text-green-800' 
              : product.stock_quantity > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {product.stock_quantity > 0 
              ? `متوفر: ${product.stock_quantity} قطعة` 
              : 'غير متوفر حالياً'}
          </Badge>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-lg font-medium mb-3">الوصف</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.description || "لا يوجد وصف متاح لهذا المنتج"}
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 my-6">
        <h3 className="text-lg font-medium mb-3">مميزات المنتج</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <span>ضمان الجودة</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-primary/10 rounded-full">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <span>شحن سريع</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-primary/10 rounded-full">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <span>استرجاع سهل</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span>دفع آمن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
