
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface OrderSummaryProps {
  totalAmount: number;
  currency: string;
  submitting: boolean;
  storeDomain: string;
  onSubmit: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalAmount,
  currency,
  submitting,
  storeDomain,
  onSubmit,
}) => {
  const formatCurrency = getCurrencyFormatter(currency);

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">المجموع الفرعي</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">الشحن</span>
        <span className="text-green-600">مجاني</span>
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-semibold text-lg">
        <span>الإجمالي</span>
        <span className="text-primary">{formatCurrency(totalAmount)}</span>
      </div>
      
      <Button 
        onClick={onSubmit}
        className="w-full mt-6 py-6 text-base shadow-lg hover:shadow-xl transition-all" 
        size="lg"
        disabled={submitting}
      >
        {submitting ? (
          <span className="animate-pulse">جاري تأكيد الطلب...</span>
        ) : (
          "تأكيد الطلب"
        )}
      </Button>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <Link to={`/store/${storeDomain}/cart`} className="text-primary hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          العودة للسلة
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
