
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, ImageIcon, MoreVertical, Tag, Eye, Edit, Copy, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  store_id: string;
  image_url?: string | null;
  stock_quantity?: number | null;
  created_at: string;
  category_id?: string | null;
  category_name?: string | null;
}

interface ProductListItemProps {
  product: Product;
  formatCurrency: (price: number) => string;
  onSelect: (productId: string, isSelected: boolean) => void;
  isSelected: boolean;
  onDelete: (productId: string) => void;
  onDuplicate: (productId: string) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  formatCurrency,
  onSelect,
  isSelected,
  onDelete,
  onDuplicate
}) => {
  const navigate = useNavigate();
  
  const handleCheckboxChange = (checked: boolean) => {
    onSelect(product.id, checked);
  };

  return (
    <div className="border-b last:border-0 px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-1 flex items-center justify-center">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
        
        <div className="col-span-5 md:col-span-6 flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://via.placeholder.com/48?text=صورة';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {product.category_name || "غير مصنف"}
            </div>
          </div>
        </div>
        
        <div className="col-span-2 text-center font-medium">
          {formatCurrency(product.price)}
        </div>
        
        <div className="col-span-2 text-center">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            product.stock_quantity === null ? 'bg-gray-100 text-gray-600' :
            product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 
            product.stock_quantity > 0 ? 'bg-orange-100 text-orange-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {product.stock_quantity === null ? 'غير محدد' : product.stock_quantity}
          </span>
        </div>
        
        <div className="col-span-2 md:col-span-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                <Eye className="h-4 w-4 ml-2" />
                عرض
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}>
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                <Copy className="h-4 w-4 ml-2" />
                نسخ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                <Trash className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
