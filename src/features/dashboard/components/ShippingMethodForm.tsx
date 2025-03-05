
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({ isPaidPlan }) => {
  // Main delivery method state
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "bronze">("standard");
  
  // Standard shipping options
  const [standardShippingEnabled, setStandardShippingEnabled] = useState(true);
  const [shippingCost, setShippingCost] = useState(2);
  const [estimatedDelivery, setEstimatedDelivery] = useState("1-2");
  
  // Free shipping threshold
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(20);
  
  // Bronze delivery options
  const [bronzeServiceLevel, setBronzeServiceLevel] = useState<"standard" | "express">("standard");
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);

  // Handle saving shipping settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ إعدادات الشحن بنجاح");
    }, 800);
  };

  return (
    <div className="space-y-6 py-2">
      <Tabs defaultValue={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "standard" | "bronze")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standard" className="py-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>التوصيل القياسي</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="bronze" className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>توصيل فريق برونز</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Standard Delivery Content */}
        <TabsContent value="standard" className="mt-0 space-y-4">
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-primary-500" />
                إعدادات التوصيل القياسي
              </CardTitle>
              <CardDescription>
                قم بتخصيص إعدادات التوصيل الأساسية لمتجرك
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Enable/Disable Standard Shipping */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">تفعيل التوصيل القياسي</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      عند تعطيل هذا الخيار، لن يتمكن العملاء من طلب التوصيل القياسي
                    </p>
                  </div>
                  <Switch 
                    checked={standardShippingEnabled}
                    onCheckedChange={setStandardShippingEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-700">تكلفة التوصيل (د.ك)</Label>
                    <Input 
                      type="number" 
                      placeholder="2" 
                      dir="ltr" 
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="border-primary-200 focus:border-primary-400"
                      disabled={!standardShippingEnabled}
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      تكلفة التوصيل الأساسية للطلبات
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 flex items-center gap-2">
                      مدة التوصيل المقدرة
                      <Clock className="h-4 w-4 text-gray-400" />
                    </Label>
                    <Select 
                      value={estimatedDelivery}
                      onValueChange={setEstimatedDelivery}
                      disabled={!standardShippingEnabled}
                    >
                      <SelectTrigger className="border-primary-200 focus:border-primary-400">
                        <SelectValue placeholder="اختر مدة التوصيل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 أيام عمل</SelectItem>
                        <SelectItem value="2-3">2-3 أيام عمل</SelectItem>
                        <SelectItem value="same-day">توصيل في نفس اليوم</SelectItem>
                        <SelectItem value="express">توصيل سريع (3-6 ساعات)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      الوقت المتوقع لتوصيل الطلبات للعملاء
                    </p>
                  </div>
                </div>
                
                {/* Free Shipping Section */}
                <div className={`p-4 rounded-lg border ${freeShipping ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label className="text-gray-700 font-medium flex items-center gap-2">
                        التوصيل المجاني
                        <Badge variant="outline" className={freeShipping ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-700'}>
                          ميزة تسويقية
                        </Badge>
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">تفعيل التوصيل المجاني للطلبات التي تتجاوز مبلغ معين</p>
                    </div>
                    <Switch 
                      checked={freeShipping}
                      onCheckedChange={setFreeShipping}
                      disabled={!standardShippingEnabled}
                      className={freeShipping ? "data-[state=checked]:bg-blue-500" : ""}
                    />
                  </div>
                  
                  <div className={`space-y-2 transition-opacity duration-200 ${freeShipping && standardShippingEnabled ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700">الحد الأدنى للتوصيل المجاني</Label>
                      <Badge variant="outline" className={freeShipping ? 'bg-white border-blue-200' : 'bg-white border-gray-200'}>
                        {freeShippingThreshold} د.ك
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <Slider 
                        value={[freeShippingThreshold]} 
                        max={50} 
                        step={1} 
                        onValueChange={(val) => setFreeShippingThreshold(val[0])}
                        disabled={!freeShipping || !standardShippingEnabled}
                        className="data-[disabled]:opacity-50"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">0 د.ك</span>
                        <Input 
                          type="number" 
                          value={freeShippingThreshold} 
                          onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                          className="w-20 h-8 text-sm text-center" 
                          dir="ltr"
                          disabled={!freeShipping || !standardShippingEnabled}
                        />
                        <span className="text-xs text-gray-500">50 د.ك</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">ملاحظة: </span>
                    عند تفعيل "توصيل فريق برونز"، سيتم تعطيل خيارات التوصيل القياسي وستتم إدارة جميع عمليات التوصيل بواسطة فريق برونز.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bronze Delivery Content */}
        <TabsContent value="bronze" className="mt-0 space-y-4">
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-amber-600" />
                    توصيل فريق برونز
                  </CardTitle>
                  <CardDescription>
                    خدمة توصيل متخصصة تُدار بالكامل من قبل فريق برونز المحترف
                  </CardDescription>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
                  خدمة متكاملة
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Bronze Key Features */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <CheckCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium mb-1">إدارة كاملة</h3>
                    <p className="text-sm text-muted-foreground">يتولى فريق برونز إدارة كل جوانب التوصيل</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium mb-1">توصيل سريع</h3>
                    <p className="text-sm text-muted-foreground">توصيل الطلبات بكفاءة عالية وفي أسرع وقت</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-100 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium mb-1">تغطية شاملة</h3>
                    <p className="text-sm text-muted-foreground">خدمة توصيل تغطي جميع مناطق الكويت</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                  <h3 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    مميزات خدمة برونز للتوصيل
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">إدارة تلقائية للطلبات ونقلها مباشرة إلى نظام برونز</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">تتبع الطلبات في الوقت الفعلي عبر لوحة تحكم برونز</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">فريق متخصص للتعامل مع العملاء وحل أي مشكلات تتعلق بالتوصيل</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">تغليف احترافي للمنتجات وضمان وصولها بحالة ممتازة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">تقارير أسبوعية مفصلة عن أداء التوصيل والملاحظات</span>
                    </li>
                  </ul>
                </div>
                
                {/* Bronze Service Levels */}
                <div>
                  <Label className="text-base font-medium mb-3 block">اختر مستوى الخدمة</Label>
                  
                  <RadioGroup 
                    value={bronzeServiceLevel} 
                    onValueChange={(value) => setBronzeServiceLevel(value as "standard" | "express")}
                    className="space-y-3"
                  >
                    <div className={`flex items-start gap-4 p-4 rounded-lg border ${bronzeServiceLevel === 'standard' ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value="standard" id="bronze-standard" className="mt-1 border-amber-400 text-amber-600" />
                      <div className="space-y-1">
                        <Label htmlFor="bronze-standard" className="text-base font-medium">الباقة القياسية</Label>
                        <p className="text-sm text-muted-foreground">توصيل منتظم لجميع الطلبات خلال 2-3 ساعات</p>
                        <Badge className="bg-white text-amber-700 border-amber-200 mt-1">
                          2 د.ك لكل طلب
                        </Badge>
                      </div>
                    </div>
                    
                    <div className={`flex items-start gap-4 p-4 rounded-lg border ${bronzeServiceLevel === 'express' ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                      <RadioGroupItem 
                        value="express" 
                        id="bronze-express" 
                        disabled={!isPaidPlan}
                        className="mt-1 border-amber-400 text-amber-600 disabled:opacity-50"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="bronze-express" className={`text-base font-medium ${!isPaidPlan ? 'text-gray-400' : ''}`}>
                            الباقة السريعة
                          </Label>
                          {!isPaidPlan && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                              الباقات المدفوعة فقط
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${!isPaidPlan ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          توصيل سريع للطلبات المستعجلة خلال ساعة واحدة
                        </p>
                        <Badge className={`mt-1 ${!isPaidPlan ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-amber-700 border-amber-200'}`}>
                          3 د.ك لكل طلب
                        </Badge>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Bronze Integration Alert */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-700">معلومات التكامل</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      عند تفعيل خدمة توصيل برونز، سيتم إنشاء حساب خاص بمتجرك في نظام برونز للتوصيل. 
                      وسيتم التواصل معك من قبل فريق برونز لإكمال عملية الإعداد والتدريب على استخدام لوحة التحكم.
                    </p>
                  </div>
                </div>
                
                {/* What Happens When Enabling Bronze */}
                <div className="border border-amber-200 rounded-lg overflow-hidden">
                  <div className="bg-amber-50 px-4 py-3">
                    <h3 className="font-medium text-amber-800">عند تفعيل خدمة توصيل برونز</h3>
                  </div>
                  <div className="px-4 py-3 bg-white">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>سيتم تعطيل إعدادات التوصيل القياسي تلقائيًا</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>ستتم إدارة جميع عمليات التوصيل بواسطة فريق برونز</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>ستظهر رسوم التوصيل للعملاء حسب الباقة المختارة</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          {isSaving ? (
            <>
              <span className="mr-2">جاري الحفظ...</span>
              <span className="animate-spin">⏳</span>
            </>
          ) : (
            "حفظ إعدادات الشحن"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;
