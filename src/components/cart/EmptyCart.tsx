
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyCartProps {
  storeDomain: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ storeDomain }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-primary/70" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">السلة فارغة</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. استعرض المنتجات وأضف ما يناسبك.
        </p>
        <Button asChild size="lg" className="gap-2 font-medium">
          <Link to={`/store/${storeDomain}`}>
            <ArrowLeft className="h-5 w-5" />
            تصفح المنتجات
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCart;
