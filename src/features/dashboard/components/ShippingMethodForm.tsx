
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, Package, Clock, MapPin, Info, Zap, CheckCircle, PlusCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

// قائمة المناطق في الكويت
const kuwaitAreas = [
  "العاصمة", "حولي", "الفروانية", "الأحمدي", "الجهراء", "مبارك الكبير"
];

// منطقة مع سعر التوصيل
interface DeliveryArea {
  id: string;
  name: string;
  price: string;
  isEnabled: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({
  isPaidPlan
}) => {
  // حالة نظام التوصيل: إما توصيل المتجر (storeDelivery) أو توصيل فريق برونز (bronzeDelivery)
  const [storeDelivery, setStoreDelivery] = useState(true);
  const [bronzeDelivery, setBronzeDelivery] = useState(false);
  
  // إعدادات توصيل المتجر (الافتراضي)
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeShippingMinOrder, setFreeShippingMinOrder] = useState("100");
  const [standardDeliveryTime, setStandardDeliveryTime] = useState("3");
  
  // إدارة مناطق التوصيل للمتجر
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(
    kuwaitAreas.map((area, index) => ({
      id: `area-${index}`,
      name: area,
      price: "5",
      isEnabled: true
    }))
  );
  
  // حالة توصيل فريق برونز
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState("standard");
  
  // تعامل مع تبديل طريقة التوصيل
  const handleBronzeDeliveryChange = (checked: boolean) => {
    setBronzeDelivery(checked);
    setStoreDelivery(!checked);
    
    if (checked) {
      toast.success("تم تفعيل خدمة توصيل فريق برونز بنجاح");
    } else {
      toast.success("تم العودة إلى نظام توصيل المتجر");
    }
  };
  
  const handleStoreDeliveryChange = (checked: boolean) => {
    setStoreDelivery(checked);
    setBronzeDelivery(!checked);
    
    if (checked) {
      toast.success("تم تفعيل نظام توصيل المتجر بنجاح");
    } else {
      toast.success("تم تفعيل خدمة توصيل فريق برونز");
    }
  };
  
  // إدارة مناطق التوصيل
  const handleAreaPriceChange = (areaId: string, price: string) => {
    setDeliveryAreas(
      deliveryAreas.map(area => 
        area.id === areaId ? { ...area, price } : area
      )
    );
  };
  
  const handleAreaToggle = (areaId: string, isEnabled: boolean) => {
    setDeliveryAreas(
      deliveryAreas.map(area => 
        area.id === areaId ? { ...area, isEnabled } : area
      )
    );
  };
  
  return (
    <div className="space-y-6">
      {/* نظام التوصيل الرئيسي - اختيار بين توصيل المتجر أو فريق برونز */}
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span>اختر نظام التوصيل</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* توصيل المتجر (الافتراضي) */}
            <Card className={`relative cursor-pointer transition-all duration-300 p-1 ${storeDelivery ? "ring-2 ring-blue-500 bg-blue-50" : "opacity-80 hover:opacity-100"}`}
              onClick={() => handleStoreDeliveryChange(true)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800">نظام توصيل المتجر</h3>
                  </div>
                  <Switch 
                    checked={storeDelivery} 
                    onCheckedChange={handleStoreDeliveryChange}
                    aria-label="تفعيل نظام توصيل المتجر" 
                    activeColor="bg-blue-500" 
                  />
                </div>
                <p className="text-sm text-blue-700 mb-2">تحكم كامل في عمليات التوصيل وتحديد المناطق والأسعار</p>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">الوضع الافتراضي</Badge>
              </CardContent>
            </Card>
            
            {/* توصيل فريق برونز */}
            <Card className={`relative cursor-pointer transition-all duration-300 p-1 ${bronzeDelivery ? "ring-2 ring-green-500 bg-green-50" : "opacity-80 hover:opacity-100"}`}
              onClick={() => handleBronzeDeliveryChange(true)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">توصيل فريق برونز</h3>
                  </div>
                  <Switch 
                    checked={bronzeDelivery} 
                    onCheckedChange={handleBronzeDeliveryChange}
                    aria-label="تفعيل خدمة برونز" 
                    activeColor="bg-green-500" 
                  />
                </div>
                <p className="text-sm text-green-700 mb-2">خدمة توصيل متكاملة تُدار بواسطة فريق برونز</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">موصى به</Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* تفاصيل نظام التوصيل المختار */}
      {/* نظام توصيل المتجر */}
      {storeDelivery && (
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-white shadow-md">
            <div className="p-5 border-b border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">إعدادات توصيل المتجر</h3>
              <p className="text-blue-700">تحكم في أسعار ومناطق التوصيل الخاصة بمتجرك</p>
            </div>
            
            <div className="p-5 space-y-6">
              {/* التوصيل المجاني */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">التوصيل المجاني</h4>
                    <p className="text-sm text-blue-600">تقديم توصيل مجاني للطلبات التي تتجاوز قيمة معينة</p>
                  </div>
                </div>
                <Switch
                  checked={freeShipping}
                  onCheckedChange={setFreeShipping}
                  aria-label="تفعيل الشحن المجاني"
                  activeColor="bg-blue-500"
                />
              </div>
              
              {freeShipping && (
                <div className="border border-blue-100 rounded-lg p-4 bg-white">
                  <Label htmlFor="min-order-free-shipping" className="text-blue-800 font-medium mb-2 block">
                    الحد الأدنى للطلب للشحن المجاني (KWD)
                  </Label>
                  <div className="relative">
                    <Input
                      id="min-order-free-shipping"
                      type="number"
                      className="pl-12 text-xl font-semibold dir-ltr"
                      value={freeShippingMinOrder}
                      onChange={e => setFreeShippingMinOrder(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      KWD
                    </div>
                  </div>
                </div>
              )}
              
              {/* وقت التوصيل */}
              <div className="border border-blue-100 rounded-lg p-4 bg-white">
                <Label htmlFor="delivery-time" className="text-blue-800 font-medium mb-2 block">
                  مدة التوصيل (بالأيام)
                </Label>
                <div className="relative">
                  <Input
                    id="delivery-time"
                    type="number"
                    className="pl-12 text-xl font-semibold dir-ltr"
                    value={standardDeliveryTime}
                    onChange={e => setStandardDeliveryTime(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    أيام
                  </div>
                </div>
              </div>
              
              {/* مناطق التوصيل */}
              <div className="border border-blue-100 rounded-lg bg-white">
                <div className="p-4 border-b border-blue-100">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>مناطق التوصيل</span>
                  </h4>
                </div>
                
                <div className="p-3">
                  <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                    {deliveryAreas.map(area => (
                      <div key={area.id} className="flex items-center justify-between p-3 rounded-lg border border-blue-50 bg-blue-25">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={area.isEnabled}
                            onCheckedChange={checked => handleAreaToggle(area.id, checked === true)}
                            id={`area-${area.id}`}
                          />
                          <Label htmlFor={`area-${area.id}`} className={`font-medium ${area.isEnabled ? 'text-blue-800' : 'text-gray-500'}`}>
                            {area.name}
                          </Label>
                        </div>
                        
                        <div className="w-28">
                          <div className="relative">
                            <Input
                              type="number"
                              className="pl-10 text-base font-semibold dir-ltr"
                              value={area.price}
                              onChange={e => handleAreaPriceChange(area.id, e.target.value)}
                              disabled={!area.isEnabled}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">
                              KWD
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* توصيل فريق برونز */}
      {bronzeDelivery && (
        <div className="rounded-lg border border-green-300 bg-white shadow-md">
          <div className="p-5 border-b border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-2">خدمة توصيل فريق برونز</h3>
            <p className="text-green-700">خدمة متكاملة لتوصيل طلبات متجرك بواسطة فريق برونز</p>
          </div>
          
          <div className="p-5">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200 mb-6">
              <p className="flex items-center gap-2">
                <Info className="h-5 w-5 text-green-600" />
                جميع الطلبات ستُحول تلقائياً إلى لوحة تحكم فريق برونز
              </p>
            </div>
            
            <div className="space-y-5">
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
                    {selectedDeliverySpeed === "standard" && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
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
                    {selectedDeliverySpeed === "express" && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
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
                    {selectedDeliverySpeed === "same_day" && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-green-200 mt-4">
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-medium">تغطية شاملة لجميع مناطق الكويت</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
