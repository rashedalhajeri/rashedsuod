
import React, { useState } from "react";
import { Wallet, CreditCard } from "lucide-react";
import { toast } from "sonner";
import PaymentMethodItem from "@/features/dashboard/components/PaymentMethodItem";

interface PaymentSettingsProps {
  storeData: any;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ storeData }) => {
  const [paymentMethods, setPaymentMethods] = useState({
    "cash-on-delivery": true,
    "credit-card": false,
    "apple-pay": false,
    "mada": false,
  });
  
  const subscriptionType = storeData?.subscription_plan || "free";
  const isPaidPlan = subscriptionType !== "free";
  
  const handlePaymentMethodChange = (id: string, checked: boolean) => {
    setPaymentMethods(prev => ({
      ...prev,
      [id]: checked
    }));
    
    toast.success(checked ? "تم تفعيل طريقة الدفع بنجاح" : "تم تعطيل طريقة الدفع");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <PaymentMethodItem
          id="cash-on-delivery"
          title="الدفع عند الاستلام"
          description="السماح للعملاء بالدفع نقدًا عند استلام الطلب"
          checked={paymentMethods["cash-on-delivery"]}
          onCheckedChange={(checked) => handlePaymentMethodChange("cash-on-delivery", checked)}
          isPaidPlan={true}
          icon={<Wallet className="h-5 w-5" />}
          color="bg-primary-500"
          tooltipContent="عند تفعيل هذا الخيار، سيتمكن العملاء من الدفع نقدًا عند استلام الطلب"
        />
        
        <PaymentMethodItem
          id="credit-card"
          title="بطاقات الائتمان"
          description="قبول الدفع عبر بطاقات فيزا وماستركارد"
          checked={paymentMethods["credit-card"]}
          onCheckedChange={(checked) => handlePaymentMethodChange("credit-card", checked)}
          disabled={!isPaidPlan}
          isPaidPlan={isPaidPlan}
          icon={<CreditCard className="h-5 w-5" />}
          color="bg-blue-500"
          tooltipContent="قبول الدفع عبر بطاقات الائتمان العالمية"
          badges={[
            { text: "رسوم 2.9% لكل عملية", color: "bg-blue-50 text-blue-700" }
          ]}
        />
        
        <PaymentMethodItem
          id="mada"
          title="مدى"
          description="قبول الدفع عبر بطاقات مدى المحلية"
          checked={paymentMethods["mada"]}
          onCheckedChange={(checked) => handlePaymentMethodChange("mada", checked)}
          disabled={!isPaidPlan}
          isPaidPlan={isPaidPlan}
          icon={<img src="/payment-icons/mada.png" alt="Mada" className="h-5 w-5 object-contain" />}
          color="bg-green-500"
          tooltipContent="قبول الدفع عبر بطاقات مدى المحلية"
          badges={[
            { text: "رسوم 2.5% لكل عملية", color: "bg-green-50 text-green-700" }
          ]}
        />
        
        <PaymentMethodItem
          id="apple-pay"
          title="Apple Pay"
          description="قبول الدفع عبر خدمة Apple Pay"
          checked={paymentMethods["apple-pay"]}
          onCheckedChange={(checked) => handlePaymentMethodChange("apple-pay", checked)}
          disabled={!isPaidPlan}
          isPaidPlan={isPaidPlan}
          icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.72 6.72c-1.967 0-2.825 1.388-4.205 1.388-1.413 0-2.495-1.388-4.204-1.388-1.677 0-3.459 1.023-4.556 2.988-1.568 2.977-.41 7.367 1.116 9.79.742 1.083 1.624 2.296 2.781 2.258 1.116-.041 1.536-.727 2.879-.727 1.341 0 1.726.727 2.88.702 1.198-.023 1.96-1.08 2.7-2.164.847-1.235 1.194-2.445 1.22-2.51-.026-.025-2.345-.904-2.37-3.582-.02-2.234 1.82-3.306 1.904-3.356-.727-1.235-2.426-1.379-3.015-1.41l-.13.01zM15.29.028C13.752.704 12.704 2.03 12.28 3.33c1.391.11 2.83-.797 3.72-1.796.8-.921 1.416-2.206 1.229-3.506h.062z"></path></svg>}
          color="bg-black"
          tooltipContent="قبول الدفع عبر خدمة Apple Pay"
          badges={[
            { text: "رسوم 2.5% لكل عملية", color: "bg-gray-100 text-gray-700" }
          ]}
        />
      </div>
    </div>
  );
};

export default PaymentSettings;
