
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoFormProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  notes,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer_name">اسم العميل <span className="text-red-500">*</span></Label>
        <Input
          id="customer_name"
          name="customer_name"
          value={customerName}
          onChange={onChange}
          placeholder="اسم العميل"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_email">البريد الإلكتروني</Label>
          <Input
            id="customer_email"
            name="customer_email"
            type="email"
            value={customerEmail}
            onChange={onChange}
            placeholder="البريد الإلكتروني"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customer_phone">رقم الهاتف</Label>
          <Input
            id="customer_phone"
            name="customer_phone"
            value={customerPhone}
            onChange={onChange}
            placeholder="رقم الهاتف"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shipping_address">عنوان الشحن <span className="text-red-500">*</span></Label>
        <Textarea
          id="shipping_address"
          name="shipping_address"
          value={shippingAddress}
          onChange={onChange}
          placeholder="عنوان الشحن"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={onChange}
          placeholder="ملاحظات إضافية"
          rows={3}
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;
