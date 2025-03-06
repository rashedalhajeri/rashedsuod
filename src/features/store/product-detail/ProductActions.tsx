
import React from "react";
import { MinusCircle, PlusCircle, ShoppingCart, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductActionsProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;
  isAddingToCart: boolean;
  currency: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  quantity,
  setQuantity,
  addToCart,
  isAddingToCart,
  currency
}) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  const totalPrice = product.price * quantity;
  
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `تفاصيل المنتج ${product.name}`,
        url: window.location.href
      })
      .then(() => console.log('تمت مشاركة المنتج بنجاح'))
      .catch((error) => console.log('حدث خطأ أثناء مشاركة المنتج:', error));
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success('تم نسخ رابط المنتج');
        })
        .catch((error) => {
          console.error('حدث خطأ أثناء نسخ الرابط:', error);
        });
    }
  };
  
  const handleAddToWishlist = () => {
    toast.success('تمت إضافة المنتج للمفضلة');
    // هنا يمكن إضافة المنتج للمفضلة
  };
  
  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0;
  
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="h-8 w-8 rounded-full"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          
          <span className="w-8 text-center font-medium">{quantity}</span>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrement}
            disabled={isOutOfStock}
            className="h-8 w-8 rounded-full"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-lg font-bold text-blue-600">
          {formatCurrency(totalPrice)}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Button 
          className="w-full"
          onClick={addToCart}
          disabled={isAddingToCart || isOutOfStock}
        >
          <ShoppingCart className="ml-2 h-4 w-4" />
          {isOutOfStock ? 'غير متوفر حالياً' : 'إضافة إلى السلة'}
        </Button>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* إضافة بعض المعلومات المفيدة */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
        <p>الشحن السريع متوفر لهذا المنتج</p>
      </div>
    </div>
  );
};

export default ProductActions;
