
import React from "react";
import { Star, Calendar, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInformationProps {
  product: any;
  currency: string;
}

const ProductInformation: React.FC<ProductInformationProps> = ({ product, currency }) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency || 'KWD'
    }).format(price);
  };
  
  // تنسيق التاريخ بشكل مقروء
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      
      <div className="flex items-center">
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(product.price)}
        </p>
      </div>
      
      {product.description && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">الوصف</h3>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
      )}
      
      {product.stock_quantity !== null && (
        <div className="mt-2 flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${
            product.stock_quantity > 10 ? 'bg-green-500' : 
            product.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {product.stock_quantity > 10 ? 'متوفر' : 
             product.stock_quantity > 0 ? `متبقي ${product.stock_quantity} فقط` : 'غير متوفر'}
          </span>
        </div>
      )}
      
      {/* معلومات إضافية عن المنتج */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product.created_at && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 ml-2" />
              <span>تاريخ الإضافة: {formatDate(product.created_at)}</span>
            </div>
          )}
          
          {product.category && (
            <div className="flex items-center">
              <Badge variant="outline" className="rounded-full">
                {product.category}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
