
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SettingsFormProps {
  storeData: any;
  setStoreName: (name: string) => void;
  setStoreUrl: (url: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phone: string) => void;
  storeName: string;
  storeUrl: string;
  email: string;
  phoneNumber: string;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  storeData,
  setStoreName,
  setStoreUrl,
  setEmail,
  setPhoneNumber,
  storeName,
  storeUrl,
  email,
  phoneNumber
}) => {
  const handleSaveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات المتجر</CardTitle>
        <CardDescription>
          قم بتعديل إعدادات متجرك الأساسية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="store-name">اسم المتجر</Label>
            <Input
              id="store-name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="اسم المتجر"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="store-url">رابط المتجر</Label>
            <div className="flex">
              <Input
                id="store-url"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="rounded-r-none"
                placeholder="رابط-المتجر"
              />
              <div className="bg-gray-100 border border-r-0 border-gray-200 text-gray-500 px-3 py-2 text-sm flex items-center rounded-l-md">
                .linok.me
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="store-email">البريد الإلكتروني</Label>
            <Input
              id="store-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="store-phone">رقم الهاتف</Label>
            <Input
              id="store-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+965 XXXXXXXX"
            />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            حفظ التغييرات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
