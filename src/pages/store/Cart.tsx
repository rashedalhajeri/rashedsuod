
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StorefrontLayout from "@/layouts/StorefrontLayout";

const Cart: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  
  // This is a placeholder for a real cart implementation
  const cartItems: any[] = [];
  
  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>منتجاتك</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">سلة التسوق فارغة</p>
                <Button asChild>
                  <Link to={`/store/${storeId}/products`}>تصفح المنتجات</Link>
                </Button>
              </div>
            ) : (
              <div>
                {/* Cart items would be listed here */}
                <p>سيتم عرض المنتجات هنا</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/store/${storeId}/products`}>متابعة التسوق</Link>
            </Button>
            <Button disabled={cartItems.length === 0}>
              إتمام الشراء
            </Button>
          </CardFooter>
        </Card>
      </div>
    </StorefrontLayout>
  );
};

export default Cart;
