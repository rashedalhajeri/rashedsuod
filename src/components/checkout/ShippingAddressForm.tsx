
import React from "react";
import { HomeIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ShippingAddressFormProps {
  formData: {
    shippingAddress: string;
    notes: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shippingAddress">العنوان التفصيلي <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            required
            rows={3}
            placeholder="المنطقة، الشارع، البناية، الطابق، رقم الشقة"
            className="resize-none pr-10 pt-3"
          />
          <HomeIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات للطلب</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="أي تعليمات إضافية للتوصيل أو الطلب؟"
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default ShippingAddressForm;
