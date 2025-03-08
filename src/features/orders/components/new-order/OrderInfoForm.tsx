
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/types/orders";

interface OrderInfoFormProps {
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: string;
  totalAmount: number;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

const OrderInfoForm: React.FC<OrderInfoFormProps> = ({
  orderNumber,
  status,
  paymentMethod,
  totalAmount,
  onStatusChange,
  onPaymentMethodChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order_number">رقم الطلب (تلقائي)</Label>
          <Input
            id="order_number"
            name="order_number"
            value={orderNumber}
            readOnly
            className="bg-muted"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">حالة الطلب</Label>
          <Select
            value={status}
            onValueChange={onStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر حالة الطلب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">قيد المعالجة</SelectItem>
              <SelectItem value="delivered">تم التوصيل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_method">طريقة الدفع</Label>
          <Select
            value={paymentMethod}
            onValueChange={onPaymentMethodChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر طريقة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">الدفع عند الاستلام</SelectItem>
              <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
              <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
              <SelectItem value="online_payment">دفع إلكتروني</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">إجمالي المبلغ (تلقائي)</Label>
          <Input
            id="total"
            name="total"
            value={totalAmount.toFixed(2)}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInfoForm;
