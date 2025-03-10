
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getFullStoreUrl } from "@/utils/url-helpers";

interface StoreTabProps {
  storeData: any;
}

const StoreTab: React.FC<StoreTabProps> = ({ storeData }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const storeDomain = storeData?.domain_name || '';
  const defaultStoreUrl = getFullStoreUrl(`/store/${storeDomain}`);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">اسم المتجر</Label>
            <Input id="storeName" value={storeData?.store_name || ''} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeSubdomain">رابط المتجر</Label>
            <div className="flex">
              <Input 
                id="storeSubdomain" 
                value={storeDomain || ''} 
                disabled 
                className="rounded-r-none"
              />
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-l border-gray-300 rounded-l-md text-gray-600 h-10">
                /store/
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              هذا هو الرابط لمتجرك: {defaultStoreUrl}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeDescription">وصف المتجر</Label>
            <Textarea 
              id="storeDescription" 
              rows={3} 
              placeholder="أدخل وصفًا للمتجر..." 
              defaultValue={storeData?.description || ''}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled>حفظ التغييرات</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>مميزات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800">مميزات متجرك</h4>
            <ul className="list-disc list-inside mt-2 text-sm text-blue-700 space-y-1">
              <li>سهولة مشاركة رابط المتجر</li>
              <li>تحسين ظهور متجرك في محركات البحث</li>
              <li>سرعة تحميل المتجر</li>
              <li>تجربة مستخدم سلسة ومتناسقة</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreTab;
