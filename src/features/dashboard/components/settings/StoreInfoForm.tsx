
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import { formatStoreUrl, isValidDomainName } from "@/utils/url-utils";

interface StoreInfoFormProps {
  storeValues: {
    storeName: string;
    domainName: string;
  };
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
  onStoreValueChange: (field: string, value: string) => void;
  storeId?: string;
}

const StoreInfoForm: React.FC<StoreInfoFormProps> = ({
  storeValues,
  logoUrl,
  onLogoUpdate,
  onStoreValueChange,
  storeId
}) => {
  // Display formatted domain for user
  const formattedDomainUrl = storeValues.domainName ? formatStoreUrl(storeValues.domainName) : '';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات المتجر</CardTitle>
        <CardDescription>تعديل اسم المتجر والشعار والوصف</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="store-name">اسم المتجر</Label>
            <Input 
              id="store-name" 
              value={storeValues.storeName} 
              onChange={(e) => onStoreValueChange('storeName', e.target.value)}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="store-logo">شعار المتجر</Label>
            <LogoUploader 
              logoUrl={logoUrl} 
              onLogoUpdate={onLogoUpdate} 
              storeId={storeId}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="store-domain">اسم النطاق</Label>
          <div className="flex items-center mt-1">
            <Input 
              id="store-domain" 
              value={storeValues.domainName} 
              onChange={(e) => onStoreValueChange('domainName', e.target.value)}
              className="flex-1" 
              placeholder="example"
            />
            <span className="text-gray-500 mr-2">.linok.me</span>
          </div>
          {formattedDomainUrl && (
            <p className="text-sm text-muted-foreground mt-1">
              عنوان المتجر: {formattedDomainUrl}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="store-description">وصف المتجر</Label>
          <Textarea 
            id="store-description" 
            defaultValue={`متجر ${storeValues.storeName} الإلكتروني`} 
            className="mt-1 resize-none" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreInfoForm;
