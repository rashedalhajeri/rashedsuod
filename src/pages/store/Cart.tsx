
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronRight, Plus, Minus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { useStoreDetection } from "@/hooks/use-store-detection";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

const Cart: React.FC = () => {
  // Use the store detection hook
  const { store, loading, error } = useStoreDetection();
  
  // Mock cart items for now - will be replaced with actual cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      productId: "p1",
      name: "آيفون 15 برو",
      price: 4999,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1696446701726-76835104c3f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "2",
      productId: "p2",
      name: "سماعات آيربودز برو",
      price: 999,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]);
  
  // Calculate cart total
  const [cartTotal, setCartTotal] = useState(0);
  
  // Format currency based on store settings
  const formatCurrency = (price: number) => {
    return getCurrencyFormatter(store?.currency)(price);
  };
  
  // Base URL for links
  const baseUrl = store ? `/store/${store.id}` : '';
  
  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    toast.success("تم تحديث الكمية");
  };
  
  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("تم إزالة المنتج من السلة");
  };
  
  // Calculate cart total on cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);
  
  // Cart item component
  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-4 border-b last:border-b-0"
    >
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <img src="/placeholder.svg" alt="placeholder" className="h-8 w-8 opacity-50" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-primary-600 font-bold">{formatCurrency(item.price)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="flex items-center space-x-1 space-x-reverse border rounded-md">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
  
  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="flex items-center mb-6">
            <Link 
              to={`${baseUrl}/products`} 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              <span>العودة للمتجر</span>
            </Link>
          </div>
          
          <div className="flex items-center mb-6">
            <ShoppingCart className="h-6 w-6 ml-2 text-primary-500" />
            <h1 className="text-2xl font-bold">سلة التسوق</h1>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="mr-2 bg-primary-50 text-primary-700 hover:bg-primary-100">
                {cartItems.length} منتجات
              </Badge>
            )}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">سلة التسوق فارغة</p>
                    <Button asChild>
                      <Link to={`${baseUrl}/products`}>تصفح المنتجات</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <CartItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </CardContent>
              {cartItems.length > 0 && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`${baseUrl}/products`}>متابعة التسوق</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي المنتجات</span>
                      <span className="font-medium">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="font-medium">مجاني</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>الإجمالي النهائي</span>
                      <span className="text-primary-600">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    إتمام الشراء
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Cart;
