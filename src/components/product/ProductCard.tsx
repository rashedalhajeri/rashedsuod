
import React from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Tag, ChevronRight, Edit, Trash2, Eye, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  onDeleteProduct?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  formatCurrency,
  onDeleteProduct 
}) => {
  const navigate = useNavigate();

  const getStockStatusClasses = (quantity: number | null | undefined) => {
    if (quantity === null || quantity === undefined) return 'bg-gray-100 text-gray-800';
    if (quantity > 10) return 'bg-green-100 text-green-800';
    if (quantity > 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStockText = (quantity: number | null | undefined) => {
    if (quantity === null || quantity === undefined) return 'غير محدد';
    return quantity.toString();
  };

  const handleDelete = () => {
    if (onDeleteProduct) {
      toast.info(
        <div className="flex flex-col gap-2">
          <p>هل أنت متأكد من حذف المنتج؟</p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                onDeleteProduct(product.id);
                toast.success("تم حذف المنتج بنجاح");
              }}
            >
              تأكيد الحذف
            </Button>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 group">
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
        
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <div className="flex gap-2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white hover:bg-white/90"
              onClick={() => navigate(`/dashboard/products/${product.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              عرض
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white hover:bg-white/90"
              onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </div>

        {product.category && (
          <Badge className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm">
            <Tag className="h-3 w-3 mr-1" />
            {product.category}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                <Eye className="h-4 w-4 ml-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}>
                <Edit className="h-4 w-4 ml-2" />
                تعديل المنتج
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 ml-2" />
                حذف المنتج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 h-10">{product.description || "لا يوجد وصف"}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-primary-700">{formatCurrency(product.price)}</span>
          <Badge variant="outline" className={`${getStockStatusClasses(product.stock_quantity)}`}>
            المخزون: {getStockText(product.stock_quantity)}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t pt-3">
        <Button 
          variant="ghost" 
          className="w-full text-primary-600 hover:text-primary-700 hover:bg-gray-100 group"
          onClick={() => navigate(`/dashboard/products/${product.id}`)}
        >
          عرض التفاصيل
          <ChevronRight className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-[-2px]" />
        </Button>
      </CardFooter>
    </Card>
  );
};
