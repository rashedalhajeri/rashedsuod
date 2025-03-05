
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import useStoreData, { getCurrencyFormatter } from '@/hooks/use-store-data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  stock?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  domainName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  imageUrl, 
  description, 
  stock, 
  isNew = false, 
  isOnSale = false, 
  discountPercentage = 0,
  domainName
}) => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency);
  const currentDomain = domainName || storeId;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // الحصول على السلة الحالية أو إنشاء سلة جديدة
    const currentCart = localStorage.getItem('shopping-cart');
    const cart = currentCart ? JSON.parse(currentCart) : [];
    
    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
    const existingItemIndex = cart.findIndex((item: any) => item.id === id);
    
    if (existingItemIndex !== -1) {
      // تحديث الكمية إذا كان المنتج موجودًا بالفعل
      cart[existingItemIndex].quantity += 1;
    } else {
      // إضافة المنتج إلى السلة إذا لم يكن موجودًا
      cart.push({
        id,
        name,
        price,
        quantity: 1,
        image_url: imageUrl,
      });
    }
    
    // حفظ السلة المحدثة
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    
    toast.success('تمت إضافة المنتج إلى السلة');
  };
  
  const handleViewProduct = () => {
    // Update the navigation path to use the new URL structure
    navigate(`/store/${currentDomain}/products/${id}`);
  };
  
  const placeholderImage = '/placeholder.svg';
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer" onClick={handleViewProduct}>
      <div className="relative">
        <div className="overflow-hidden aspect-square">
          <img 
            src={imageUrl || placeholderImage} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-blue-500">جديد</Badge>
          )}
          {isOnSale && (
            <Badge className="bg-red-500">{discountPercentage}% خصم</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg truncate">{name}</h3>
        <div className="flex items-end gap-2 mt-1">
          <div className="text-lg font-bold">{formatCurrency(price)}</div>
          {isOnSale && discountPercentage > 0 && (
            <div className="text-sm line-through text-gray-400">
              {formatCurrency(price + (price * discountPercentage / 100))}
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-gray-500 mt-2 text-sm line-clamp-2">{description}</p>
        )}
        
        {/* Stock status */}
        {stock !== undefined && stock <= 5 && stock > 0 && (
          <div className="text-amber-600 text-sm mt-2">باقي {stock} فقط</div>
        )}
        {stock === 0 && (
          <div className="text-red-600 text-sm mt-2">نفذت الكمية</div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleViewProduct}
        >
          <Eye className="h-4 w-4 ml-1" />
          عرض
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4 ml-1" />
          إضافة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
