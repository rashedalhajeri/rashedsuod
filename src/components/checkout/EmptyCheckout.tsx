
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyCheckoutProps {
  storeDomain: string;
}

const EmptyCheckout: React.FC<EmptyCheckoutProps> = ({ storeDomain }) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold mb-4">السلة فارغة</h2>
        <p className="text-gray-500 mb-6">لا يمكن إتمام الطلب، السلة فارغة</p>
        <Button asChild size="lg" className="gap-2">
          <Link to={`/store/${storeDomain}`}>
            <ArrowLeft className="h-5 w-5" />
            تصفح المنتجات
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCheckout;
