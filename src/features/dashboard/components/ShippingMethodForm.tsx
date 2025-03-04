
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
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

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({ isPaidPlan }) => {
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
              <FormItem>
                <FormLabel className="text-gray-700">تكلفة التوصيل (ريال)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15" dir="ltr" />
                </FormControl>
                <FormDescription className="text-xs">
                  تكلفة التوصيل الأساسية للطلبات
                </FormDescription>
              </FormItem>
              
              <FormItem>
                <FormLabel className="text-gray-700">مدة التوصيل المقدرة</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Select defaultValue="3-5">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر مدة التوصيل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 أيام عمل</SelectItem>
                        <SelectItem value="2-3">2-3 أيام عمل</SelectItem>
                        <SelectItem value="3-5">3-5 أيام عمل</SelectItem>
                        <SelectItem value="5-7">5-7 أيام عمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </FormItem>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">التوصيل المجاني</Label>
                  <p className="text-xs text-gray-500 mt-1">تفعيل التوصيل المجاني للطلبات التي تتجاوز مبلغ معين</p>
                </div>
                <Switch />
              </div>
              
              <FormItem>
                <FormLabel className="text-gray-700">الحد الأدنى للتوصيل المجاني (ريال)</FormLabel>
                <div className="space-y-3">
                  <FormControl>
                    <Slider defaultValue={[200]} max={500} step={10} />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">0 ريال</span>
                    <Input type="number" value="200" className="w-20 h-8 text-sm text-center" dir="ltr" />
                    <span className="text-xs text-gray-500">500 ريال</span>
                  </div>
                </div>
              </FormItem>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* نظام توصيل Linok */}
      <Card className="border-primary/10 bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 flex items-center justify-center font-bold text-primary-600">L</div>
                <h3 className="text-md font-semibold">توصيل Linok</h3>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">متاح للمتاجر في المدن الرئيسية</span>
              </div>
            </div>
            
            <FormItem className="flex flex-col gap-2">
              <FormDescription className="text-sm text-gray-600">
                عند تفعيل هذه الخدمة، ستتمكن من استخدام خدمات توصيل Linok المتاحة في العديد من المدن بالمملكة. سيتم تحويل الطلبات مباشرة إلى نظام توصيل Linok.
              </FormDescription>
              
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">1</div>
                  <div className="text-sm text-gray-700">استلام الطلبات من متجرك مباشرة</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">2</div>
                  <div className="text-sm text-gray-700">تجهيز الطلب من خلال فريق Linok</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mt-0.5">3</div>
                  <div className="text-sm text-gray-700">توصيل الطلب إلى عميلك بسرعة واحترافية</div>
                </div>
              </div>
            </FormItem>
            
            <FormItem>
              <div className="bg-primary-50 p-3 rounded-md">
                <RadioGroup defaultValue="standard">
                  <div className="flex items-start space-x-2 space-x-reverse mb-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="grid gap-1.5 mr-2">
                      <Label htmlFor="standard" className="text-sm font-medium">الخدمة القياسية</Label>
                      <p className="text-xs text-gray-500">
                        توصيل خلال 3-5 أيام عمل (15 ريال)
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
                        توصيل خلال 24 ساعة (30 ريال)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </FormItem>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
              <span className="font-medium">ملاحظة: </span>
              سيتم فتح حساب خاص بالمتجر على منصة Linok للتوصيل. وسيتم التواصل معك من قبل فريق Linok لإكمال الإعداد.
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
              
              <FormItem>
                <FormDescription className="text-sm text-gray-600">
                  حدد مناطق توصيل مختلفة وأسعار توصيل مخصصة لكل منطقة
                </FormDescription>
                
                <div className="border rounded-md p-4 mt-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormItem>
                      <FormLabel className="text-gray-700">المنطقة</FormLabel>
                      <FormControl>
                        <Select defaultValue="riyadh">
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنطقة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riyadh">الرياض</SelectItem>
                            <SelectItem value="jeddah">جدة</SelectItem>
                            <SelectItem value="dammam">الدمام</SelectItem>
                            <SelectItem value="custom">منطقة مخصصة</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel className="text-gray-700">تكلفة التوصيل (ريال)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" dir="ltr" />
                      </FormControl>
                    </FormItem>
                  </div>
                  
                  <FormItem>
                    <FormLabel className="text-gray-700">تفاصيل المنطقة (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أضف تفاصيل حول المنطقة أو ملاحظات خاصة بالتوصيل في هذه المنطقة"
                        className="resize-none"
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                  
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
              </FormItem>
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
