
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, Package, Clock, MapPin, Info, Zap, CheckCircle } from "lucide-react";
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
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState("standard");
  const [standardShippingCost, setStandardShippingCost] = useState("15");
  const [standardDeliveryTime, setStandardDeliveryTime] = useState("3");
  const [freeShippingMinOrder, setFreeShippingMinOrder] = useState("100");
  
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
    <div className="space-y-6">
      {/* خدمة توصيل برونز */}
      <div className="relative rounded-lg border border-green-300 bg-green-50 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="rounded-full bg-green-100 p-3">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">توصيل فريق برونز</h3>
              <p className="text-sm text-green-700">خدمة توصيل متكاملة تُدار بواسطة فريق برونز</p>
            </div>
          </div>
          <Switch 
            checked={bronzeDelivery} 
            onCheckedChange={handleBronzeDeliveryChange}
            aria-label="تفعيل خدمة برونز"
            activeColor="bg-green-500"
            className="scale-110"
          />
        </div>
        
        {bronzeDelivery && (
          <div className="border-t border-green-200 bg-white p-5 rounded-b-lg">
            <div className="space-y-5">
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200">
                <p className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-green-600" />
                  جميع الطلبات ستُحول تلقائياً إلى لوحة تحكم فريق برونز
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="text-base font-medium mb-2 text-green-800">سرعة التوصيل:</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card 
                    className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "standard" ? "bg-green-50 ring-2 ring-green-500" : ""}`}
                    onClick={() => setSelectedDeliverySpeed("standard")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">توصيل قياسي</span>
                        <span className="text-green-700 font-bold">
                          <span className="text-xl ltr:inline-block">2-3</span> أيام
                        </span>
                      </div>
                      {selectedDeliverySpeed === "standard" && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "express" ? "bg-green-50 ring-2 ring-green-500" : ""}`}
                    onClick={() => setSelectedDeliverySpeed("express")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Zap className="h-5 w-5 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">توصيل سريع</span>
                        <span className="text-green-700 font-bold">
                          <span className="text-xl ltr:inline-block">24</span> ساعة
                        </span>
                      </div>
                      {selectedDeliverySpeed === "express" && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "same_day" ? "bg-green-50 ring-2 ring-green-500" : ""}`}
                    onClick={() => setSelectedDeliverySpeed("same_day")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Zap className="h-5 w-5 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">توصيل في نفس اليوم</span>
                        <span className="text-green-700 font-bold">
                          <span className="text-xl ltr:inline-block">3-5</span> ساعات
                        </span>
                      </div>
                      {selectedDeliverySpeed === "same_day" && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-green-200 mt-2">
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="font-medium">تغطية شاملة لجميع مناطق الكويت</span>
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
          <div className="rounded-lg border border-blue-200 bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="rounded-full bg-blue-100 p-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">الشحن القياسي</h3>
                  <p className="text-sm text-blue-700">توصيل الطلبات للعملاء بتكلفة ثابتة</p>
                </div>
              </div>
              <Switch 
                checked={standardShipping} 
                onCheckedChange={setStandardShipping} 
                aria-label="تفعيل الشحن القياسي"
                activeColor="bg-blue-500"
                className="scale-110"
              />
            </div>
            
            {standardShipping && (
              <div className="border-t border-blue-200 bg-white p-5 rounded-b-lg">
                <div className="space-y-5">
                  <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200 mb-4">
                    <p className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      تطبيق رسوم شحن ثابتة على جميع الطلبات
                    </p>
                  </div>
                
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-cost" className="text-blue-800 font-medium">تكلفة الشحن (KWD)</Label>
                      <div className="relative">
                        <Input 
                          id="shipping-cost" 
                          type="number" 
                          className="pl-12 text-xl font-semibold dir-ltr" 
                          value={standardShippingCost}
                          onChange={(e) => setStandardShippingCost(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          KWD
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="delivery-time" className="text-blue-800 font-medium">مدة التوصيل (بالأيام)</Label>
                      <div className="relative">
                        <Input 
                          id="delivery-time" 
                          type="number" 
                          className="pl-12 text-xl font-semibold dir-ltr" 
                          value={standardDeliveryTime}
                          onChange={(e) => setStandardDeliveryTime(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          أيام
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Card className="border-blue-200">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">تغطية لمناطق محددة في الكويت</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* الشحن المجاني */}
          <div className="rounded-lg border border-green-200 bg-green-50 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="rounded-full bg-green-100 p-3">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-green-800">الشحن المجاني</h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">موصى به</Badge>
                </div>
              </div>
              <Switch 
                checked={freeShipping} 
                onCheckedChange={setFreeShipping} 
                aria-label="تفعيل الشحن المجاني"
                activeColor="bg-green-500"
                className="scale-110"
              />
            </div>
            
            {freeShipping && (
              <div className="border-t border-green-200 bg-white p-5 rounded-b-lg">
                <div className="space-y-5">
                  <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200 mb-4">
                    <p className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-green-600" />
                      عزز مبيعاتك بتقديم شحن مجاني للطلبات التي تتجاوز قيمة معينة
                    </p>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="min-order-free-shipping" className="text-green-800 font-medium">الحد الأدنى للطلب للشحن المجاني (KWD)</Label>
                    <div className="relative">
                      <Input 
                        id="min-order-free-shipping" 
                        type="number" 
                        className="pl-12 text-xl font-semibold dir-ltr" 
                        value={freeShippingMinOrder}
                        onChange={(e) => setFreeShippingMinOrder(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        KWD
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Card className="border-green-200">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span className="font-medium">تغطية محدودة لمناطق الكويت</span>
                      </CardContent>
                    </Card>
                  </div>
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
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;
