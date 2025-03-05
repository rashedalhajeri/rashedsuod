
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Minus, Plus } from "lucide-react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

const Cart: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const formatCurrency = getCurrencyFormatter("SAR");
  
  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>منتجاتك</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">سلة التسوق فارغة</p>
                <Button asChild>
                  <Link to={`/store/${storeId}/products`}>تصفح المنتجات</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <img src="/placeholder.svg" alt="Placeholder" className="w-8 h-8 opacity-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-between items-center">
                  <span className="font-bold">المجموع:</span>
                  <span className="font-bold text-lg">{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/store/${storeId}/products`}>متابعة التسوق</Link>
            </Button>
            <Button disabled={items.length === 0}>
              إتمام الشراء
            </Button>
          </CardFooter>
        </Card>
      </div>
    </StorefrontLayout>
  );
};

export default Cart;
