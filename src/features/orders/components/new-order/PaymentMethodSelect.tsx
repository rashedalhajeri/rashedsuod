
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="اختر طريقة الدفع" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash_on_delivery">الدفع عند الاستلام</SelectItem>
        <SelectItem value="online_payment">الدفع الإلكتروني</SelectItem>
        <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
        <SelectItem value="knet">K-NET</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentMethodSelect;
