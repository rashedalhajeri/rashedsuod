
import React from "react";
import { CreditCard, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (value: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={onMethodChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3 space-x-reverse border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
          <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
            <div className="bg-green-100 p-2 rounded-full ml-3">
              <Banknote className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <span className="font-medium">الدفع عند الاستلام</span>
              <p className="text-sm text-gray-500">ادفع نقداً عند استلام الطلب</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <RadioGroupItem value="card_payment" id="card_payment" />
          <Label htmlFor="card_payment" className="flex items-center cursor-pointer">
            <div className="bg-blue-100 p-2 rounded-full ml-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-medium">بطاقة ائتمان أو بطاقة مدى</span>
              <p className="text-sm text-gray-500">سيتم توجيهك لبوابة الدفع بعد تأكيد الطلب</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      <div className="flex items-center justify-center gap-3 mt-6">
        <img src="/payment-icons/visa-master.png" alt="Visa/Mastercard" className="h-8" />
        <img src="/payment-icons/mada.png" alt="Mada" className="h-7" />
        <img src="/payment-icons/knet.png" alt="KNet" className="h-7" />
        <img src="/payment-icons/benefit.png" alt="Benefit" className="h-6" />
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
