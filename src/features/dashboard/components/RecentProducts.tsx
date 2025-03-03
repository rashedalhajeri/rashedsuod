
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface Product {
  id: string;
  name: string;
  thumbnail: string | null;
  price: number;
  stock: number;
  category: string;
}

interface RecentProductsProps {
  products: Product[];
  currency?: string;
}

const RecentProducts: React.FC<RecentProductsProps> = ({ 
  products, 
  currency = "SAR" 
}) => {
  const getStockColor = (stock: number) => {
    if (stock > 10) return "bg-green-100 text-green-800 border-green-200";
    if (stock > 0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  // استخدام منسق العملة من الهوك
  const formatCurrency = getCurrencyFormatter(currency);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <Package className="h-4 w-4 inline-block ml-2" />
          أحدث المنتجات
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/products" className="text-sm text-muted-foreground">
            عرض الكل
            <ArrowRight className="h-4 w-4 mr-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">لا توجد منتجات حديثة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {product.thumbnail ? (
                      <img 
                        src={product.thumbnail} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Link 
                      to={`/dashboard/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {product.category}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={getStockColor(product.stock)}
                  >
                    {product.stock} متوفر
                  </Badge>
                  <div className="font-medium text-sm">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProducts;
