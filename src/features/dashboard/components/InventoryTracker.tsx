
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, AlertTriangle, ShoppingBag, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: string;
  name: string;
  thumbnail: string | null;
  stock: number;
  stockThreshold: number;
  initialStock: number;
  category: string;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface InventoryTrackerProps {
  products: Product[];
  currency: string;
  formatCurrency: (value: number) => string;
}

const InventoryTracker: React.FC<InventoryTrackerProps> = ({ 
  products,
  currency,
  formatCurrency
}) => {
  // فلترة المنتجات منخفضة المخزون
  const lowStockProducts = products.filter(
    product => product.status === 'low_stock' || product.status === 'out_of_stock'
  );
  
  const getStockColor = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return "bg-green-100 text-green-800 border-green-200";
      case 'low_stock':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'out_of_stock':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStockIcon = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return <Check className="h-3.5 w-3.5" />;
      case 'low_stock':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'out_of_stock':
        return <ShoppingBag className="h-3.5 w-3.5" />;
      default:
        return <Package className="h-3.5 w-3.5" />;
    }
  };
  
  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return "متوفر";
      case 'low_stock':
        return "منخفض المخزون";
      case 'out_of_stock':
        return "نفذ من المخزون";
      default:
        return "";
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <AlertTriangle className="h-4 w-4 inline-block ml-2 text-amber-500" />
          متابعة المخزون
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/products" className="text-sm text-muted-foreground flex items-center gap-1">
            عرض كل المنتجات
            <ArrowRight className="h-4 w-4 mr-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-6">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">جميع المنتجات متوفرة بكميات كافية</p>
            <p className="text-xs text-gray-500 mt-1">لا توجد منتجات بحاجة لإعادة تخزين</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div 
                key={product.id} 
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/dashboard/products/${product.id}`}
                      className="font-medium hover:underline hover:text-primary-600"
                    >
                      {product.name}
                    </Link>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1",
                        getStockColor(product.status)
                      )}
                    >
                      {getStockIcon(product.status)}
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">المخزون: {product.stock} / {product.initialStock}</span>
                    <span className="text-gray-500">
                      {((product.stock / product.initialStock) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={(product.stock / product.initialStock) * 100} 
                    className={cn(
                      "h-1.5",
                      product.status === 'out_of_stock' ? "bg-red-100" :
                      product.status === 'low_stock' ? "bg-yellow-100" : "bg-green-100"
                    )}
                    indicatorClassName={
                      product.status === 'out_of_stock' ? "bg-red-500" :
                      product.status === 'low_stock' ? "bg-yellow-500" : "bg-green-500"
                    }
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    إعادة تعبئة المخزون
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTracker;
