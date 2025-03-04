
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";
import { toast } from "sonner";

interface PaymentMethodProps {
  onSuccess?: () => void;
}

const PaymentMethods: React.FC<PaymentMethodProps> = ({ onSuccess }) => {
  const { data: storeData } = useStoreData();
  const [selectedMethod, setSelectedMethod] = React.useState<string>("knet");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would connect to a payment gateway in production
    toast.success("تم إرسال طلب الدفع", {
      description: "سيتم تحويلك إلى بوابة الدفع..."
    });
    
    // Simulate payment success after 2 seconds
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 2000);
  };
  
  const paymentMethods = [
    { id: "knet", name: "بطاقة K-NET", icon: "/payment-icons/knet.png" },
    { id: "visa", name: "بطاقة Visa / MasterCard", icon: "/payment-icons/visa-master.png" },
    { id: "benefit", name: "بطاقة Benefit", icon: "/payment-icons/benefit.png" },
    { id: "mada", name: "بطاقة مدى", icon: "/payment-icons/mada.png" }
  ];
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">اختر طريقة الدفع</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-3 cursor-pointer flex items-center transition-colors ${
                  selectedMethod === method.id 
                    ? "border-primary bg-primary-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white p-1 flex items-center justify-center rounded-md mr-3">
                  {method.icon ? (
                    <img src={method.icon} alt={method.name} className="max-w-full max-h-full" />
                  ) : (
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm">{method.name}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          
          <Button type="submit" className="w-full">
            متابعة الدفع
          </Button>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            المدفوعات مؤمنة ومشفرة بواسطة أحدث تقنيات الأمان
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
