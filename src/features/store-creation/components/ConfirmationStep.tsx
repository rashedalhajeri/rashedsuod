
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StoreFormData } from "../types";

interface ConfirmationStepProps {
  formData: StoreFormData;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  handleSwitchChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">تأكيد المعلومات</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">اسم المتجر</h3>
                <p>{formData.storeName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">اسم النطاق</h3>
                <p>{formData.domainName}.linok.me</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                <p>{formData.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">الدولة</h3>
                <p>{formData.country}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">العملة</h3>
                <p>{formData.currency}</p>
              </div>
            </div>
            
            {formData.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">وصف المتجر</h3>
                <p>{formData.description}</p>
              </div>
            )}

            {formData.logoUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">شعار المتجر</h3>
                <img src={formData.logoUrl} alt="شعار المتجر" className="h-16 w-16 object-contain" />
              </div>
            )}

            {formData.bannerUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">بنر المتجر</h3>
                <img src={formData.bannerUrl} alt="بنر المتجر" className="h-20 w-full object-cover rounded" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => handleSwitchChange("acceptTerms", checked)}
        />
        <Label htmlFor="acceptTerms" className="mr-2">
          أوافق على <a href="#" className="text-primary hover:underline">شروط الخدمة</a> و
          <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a>
        </Label>
      </div>
    </div>
  );
};

export default ConfirmationStep;
