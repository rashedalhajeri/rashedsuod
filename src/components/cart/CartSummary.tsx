
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  totalPrice: number;
  currency: string;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  totalPrice, 
  currency, 
  onCheckout 
}) => {
  return (
    <Card className="border-0 shadow-md sticky top-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6 border-b pb-3">ملخص الطلب</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">المجموع الفرعي</span>
            <span className="font-medium">{totalPrice.toFixed(2)} {currency}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">الشحن</span>
            <span className="text-green-600 font-medium">مجاني</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg">
            <span className="font-bold">الإجمالي</span>
            <span className="font-bold text-primary">{totalPrice.toFixed(2)} {currency}</span>
          </div>
          
          <div className="pt-3">
            <Button 
              className="w-full py-6 text-base shadow-lg hover:shadow-xl transition-all" 
              size="lg"
              onClick={onCheckout}
            >
              إتمام الطلب
            </Button>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <img src="/payment-icons/visa-master.png" alt="Visa/Mastercard" className="h-6" />
              <img src="/payment-icons/mada.png" alt="Mada" className="h-5" />
              <img src="/payment-icons/knet.png" alt="KNet" className="h-5" />
              <img src="/payment-icons/benefit.png" alt="Benefit" className="h-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
