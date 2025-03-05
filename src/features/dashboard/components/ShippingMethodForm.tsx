
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, Package, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({ isPaidPlan }) => {
  const [standardShipping, setStandardShipping] = useState(true);
  const [freeShipping, setFreeShipping] = useState(false);
  const [bronzeDelivery, setBronzeDelivery] = useState(false);
  const [customZones, setCustomZones] = useState(false);
  
  // تعطيل خيارات الشحن الأخرى عند تفعيل خدمة برونز
  const handleBronzeDeliveryChange = (checked: boolean) => {
    setBronzeDelivery(checked);
    
    if (checked) {
      // تعطيل جميع طرق الشحن الأخرى عند تفعيل برونز
      setStandardShipping(false);
      setFreeShipping(false);
      setCustomZones(false);
      toast.success("تم تفعيل خدمة توصيل برونز بنجاح");
    }
  };
  
  return (
    <div className="space-y-4">
      {/* خدمة توصيل برونز */}
      <div className="relative rounded-lg border border-amber-200 bg-amber-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="rounded-full bg-amber-100 p-2">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">توصيل فريق برونز</h3>
              <p className="text-sm text-muted-foreground">خدمة توصيل متكاملة تُدار بواسطة فريق برونز</p>
            </div>
          </div>
          <Switch 
            checked={bronzeDelivery} 
            onCheckedChange={handleBronzeDeliveryChange}
            aria-label="تفعيل خدمة برونز"
          />
        </div>
        
        {bronzeDelivery && (
          <div className="border-t bg-white p-4">
            <div className="space-y-3">
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                <p className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  تم تفعيل خدمة توصيل برونز. جميع الطلبات ستُحول تلقائياً إلى لوحة تحكم فريق برونز.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-amber-100">
                  <CardContent className="p-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span>تغطية شاملة لجميع مناطق المملكة</span>
                  </CardContent>
                </Card>
                <Card className="border-amber-100">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>توصيل سريع خلال 24-48 ساعة</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* خيارات الشحن الأخرى - تظهر فقط إذا لم يتم تفعيل برونز */}
      {!bronzeDelivery && (
        <>
          {/* الشحن القياسي */}
          <div className="rounded-lg border shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="rounded-full bg-blue-100 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">الشحن القياسي</h3>
                  <p className="text-sm text-muted-foreground">توصيل الطلبات للعملاء بتكلفة ثابتة</p>
                </div>
              </div>
              <Switch 
                checked={standardShipping} 
                onCheckedChange={setStandardShipping} 
                aria-label="تفعيل الشحن القياسي"
              />
            </div>
            
            {standardShipping && (
              <div className="border-t p-4">
                <div className="space-y-3">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Label htmlFor="shipping-cost">تكلفة الشحن</Label>
                      <Input id="shipping-cost" type="number" className="mt-1" defaultValue="15" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="delivery-time">مدة التوصيل (بالأيام)</Label>
                      <Input id="delivery-time" type="number" className="mt-1" defaultValue="3" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* الشحن المجاني */}
          <div className="rounded-lg border shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="rounded-full bg-green-100 p-2">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">الشحن المجاني</h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">موصى به</Badge>
                </div>
              </div>
              <Switch 
                checked={freeShipping} 
                onCheckedChange={setFreeShipping} 
                aria-label="تفعيل الشحن المجاني"
              />
            </div>
            
            {freeShipping && (
              <div className="border-t p-4">
                <div className="space-y-3">
                  <Label htmlFor="min-order-free-shipping">الحد الأدنى للطلب للشحن المجاني</Label>
                  <Input id="min-order-free-shipping" type="number" defaultValue="100" />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={() => toast.success("تم حفظ إعدادات الشحن بنجاح")}
        >
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;
