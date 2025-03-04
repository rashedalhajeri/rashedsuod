
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Info } from "lucide-react";
import { useState } from "react";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({ isPaidPlan }) => {
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(20);
  const [shippingCost, setShippingCost] = useState(2);
  const [estimatedDelivery, setEstimatedDelivery] = useState("1-2");
  
  return (
    <div className="space-y-6 py-2 animate-fade-in">
      {/* توصيل قياسي */}
      <Card className="border-primary/10 bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary-500" />
                <h3 className="text-md font-semibold">إعدادات التوصيل القياسي</h3>
              </div>
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">تكلفة التوصيل (د.ك)</Label>
                <Input 
                  type="number" 
                  placeholder="2" 
                  dir="ltr" 
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  تكلفة التوصيل الأساسية للطلبات في الكويت
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">مدة التوصيل المقدرة</Label>
                <div className="flex items-center gap-2">
                  <Select 
                    value={estimatedDelivery}
                    onValueChange={setEstimatedDelivery}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مدة التوصيل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 أيام عمل</SelectItem>
                      <SelectItem value="2-3">2-3 أيام عمل</SelectItem>
                      <SelectItem value="same-day">توصيل في نفس اليوم</SelectItem>
                      <SelectItem value="express">توصيل سريع (3-6 ساعات)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">التوصيل المجاني</Label>
                  <p className="text-xs text-gray-500 mt-1">تفعيل التوصيل المجاني للطلبات التي تتجاوز مبلغ معين</p>
                </div>
                <Switch 
                  checked={freeShipping}
                  onCheckedChange={setFreeShipping}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">الحد الأدنى للتوصيل المجاني (د.ك)</Label>
                <div className="space-y-3">
                  <Slider 
                    value={[freeShippingThreshold]} 
                    max={50} 
                    step={1} 
                    onValueChange={(val) => setFreeShippingThreshold(val[0])}
                    disabled={!freeShipping}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">0 د.ك</span>
                    <Input 
                      type="number" 
                      value={freeShippingThreshold} 
                      onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                      className="w-20 h-8 text-sm text-center" 
                      dir="ltr"
                      disabled={!freeShipping}
                    />
                    <span className="text-xs text-gray-500">50 د.ك</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* نظام توصيل تاليفري */}
      <Card className="border-primary/10 bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 flex items-center justify-center font-bold text-primary-600">T</div>
                <h3 className="text-md font-semibold">توصيل تاليفري</h3>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">متاح للمتاجر في جميع مناطق الكويت</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                عند تفعيل هذه الخدمة، ستتمكن من استخدام خدمات توصيل تاليفري المتاحة في جميع مناطق الكويت. سيتم تحويل الطلبات مباشرة إلى نظام توصيل تاليفري.
              </p>
              
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">1</div>
                  <div className="text-sm text-gray-700">استلام الطلبات من متجرك مباشرة</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">2</div>
                  <div className="text-sm text-gray-700">تجهيز الطلب من خلال فريق تاليفري</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">3</div>
                  <div className="text-sm text-gray-700">توصيل الطلب إلى عميلك بسرعة واحترافية</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-primary-50 p-3 rounded-md">
                <RadioGroup defaultValue="standard">
                  <div className="flex items-start space-x-2 space-x-reverse mb-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="grid gap-1.5 mr-2">
                      <Label htmlFor="standard" className="text-sm font-medium">الخدمة القياسية</Label>
                      <p className="text-xs text-gray-500">
                        توصيل خلال 2-3 ساعات (2 د.ك)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <RadioGroupItem value="express" id="express" disabled={!isPaidPlan} />
                    <div className="grid gap-1.5 mr-2">
                      <div className="flex items-center">
                        <Label htmlFor="express" className="text-sm font-medium">التوصيل السريع</Label>
                        {!isPaidPlan && (
                          <Badge variant="outline" className="mr-2 text-xs bg-gray-50 text-gray-500 border-gray-200">
                            الباقات المدفوعة فقط
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        توصيل خلال ساعة واحدة (3 د.ك)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
              <span className="font-medium">ملاحظة: </span>
              سيتم فتح حساب خاص بالمتجر على منصة تاليفري للتوصيل. وسيتم التواصل معك من قبل فريق تاليفري لإكمال الإعداد.
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* مناطق التوصيل - متاح فقط للباقات المدفوعة */}
      {isPaidPlan && (
        <Card className="border-primary/10 bg-white">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  <h3 className="text-md font-semibold">مناطق التوصيل المخصصة</h3>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  حدد مناطق توصيل مختلفة وأسعار توصيل مخصصة لكل منطقة في الكويت
                </p>
                
                <div className="border rounded-md p-4 mt-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-gray-700">المنطقة</Label>
                      <Select defaultValue="hawalli">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hawalli">حولي</SelectItem>
                          <SelectItem value="salmiya">السالمية</SelectItem>
                          <SelectItem value="kuwait-city">مدينة الكويت</SelectItem>
                          <SelectItem value="farwaniya">الفروانية</SelectItem>
                          <SelectItem value="jahra">الجهراء</SelectItem>
                          <SelectItem value="ahmadi">الأحمدي</SelectItem>
                          <SelectItem value="custom">منطقة مخصصة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-700">تكلفة التوصيل (د.ك)</Label>
                      <Input type="number" placeholder="1.5" dir="ltr" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700">تفاصيل المنطقة (اختياري)</Label>
                    <Textarea 
                      placeholder="أضف تفاصيل حول المنطقة أو ملاحظات خاصة بالتوصيل في هذه المنطقة"
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="ml-2">إلغاء</Button>
                    <Button size="sm">إضافة منطقة</Button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    إضافة منطقة توصيل جديدة +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="ml-2">إلغاء</Button>
        <Button size="sm">حفظ الإعدادات</Button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;
