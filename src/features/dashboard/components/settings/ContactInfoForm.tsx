
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoFormProps {
  contactValues: {
    email: string;
    phone: string;
    address: string;
  };
  onContactValueChange: (field: string, value: string) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  contactValues,
  onContactValueChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الاتصال</CardTitle>
        <CardDescription>تعديل معلومات الاتصال الخاصة بالمتجر</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="store-email">البريد الإلكتروني</Label>
            <Input 
              type="email" 
              id="store-email" 
              value={contactValues.email} 
              onChange={(e) => onContactValueChange('email', e.target.value)}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="store-phone">رقم الهاتف</Label>
            <Input 
              type="tel" 
              id="store-phone" 
              value={contactValues.phone} 
              onChange={(e) => onContactValueChange('phone', e.target.value)}
              className="mt-1 dir-ltr" 
            />
          </div>
        </div>
        <div>
          <Label htmlFor="store-address">العنوان</Label>
          <Input 
            id="store-address" 
            value={contactValues.address} 
            onChange={(e) => onContactValueChange('address', e.target.value)}
            className="mt-1" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
