
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CartItem from "./CartItem";
import { toast } from "sonner";

interface CartItemsListProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string | null;
    store_id: string;
  }>;
  storeDomain: string;
  currency: string;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  items,
  storeDomain,
  currency,
  updateItemQuantity,
  removeFromCart,
  clearCart,
}) => {
  const handleClearCart = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إفراغ السلة؟")) {
      clearCart();
      toast.info("تم إفراغ السلة");
    }
  };

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="bg-primary/5 px-6 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          المنتجات ({items.reduce((acc, item) => acc + item.quantity, 0)})
        </h2>
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-red-500 transition-colors gap-1"
          onClick={handleClearCart}
        >
          <Trash className="h-4 w-4" />
          <span className="text-sm">إفراغ السلة</span>
        </Button>
      </div>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {items.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              storeDomain={storeDomain}
              currency={currency}
              onUpdateQuantity={updateItemQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between">
        <Button 
          variant="outline"
          size="sm"
          className="gap-2"
          asChild
        >
          <Link to={`/store/${storeDomain}`}>
            <ArrowLeft className="h-4 w-4" />
            متابعة التسوق
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartItemsList;
