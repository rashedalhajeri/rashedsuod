import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Truck, MapPin, Clock, Info, Package, ChevronDown, ChevronUp } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

interface DeliveryZone {
  id: string;
  name: string;
  cost: number;
  details?: string;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({ isPaidPlan }) => {
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(20);
  const [shippingCost, setShippingCost] = useState(2);
  const [estimatedDelivery, setEstimatedDelivery] = useState("1-2");
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    standard: true,
    talefree: true,
    zones: isPaidPlan
  });

  const toggleSection = (section: 'standard' | 'talefree' | 'zones') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const addDeliveryZone = () => {
    const newZone: DeliveryZone = {
      id: Date.now().toString(),
      name: 'حولي',
      cost: 2,
      details: ''
    };
    setDeliveryZones([...deliveryZones, newZone]);
  };

  const updateDeliveryZone = (id: string, field: keyof DeliveryZone, value: any) => {
    setDeliveryZones(zones => 
      zones.map(zone => 
        zone.id === id ? { ...zone, [field]: value } : zone
      )
    );
  };

  const removeDeliveryZone = (id: string) => {
    setDeliveryZones(zones => zones.filter(zone => zone.id !== id));
  };

  return (
    <div className="space-y-6 py-2 animate-fade-in">
      <Card className="border-primary/10 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-primary-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
             onClick={() => toggleSection('standard')}>
          <div className="flex items-center gap-2">
            <div className="bg-primary-100 p-2 rounded-full">
              <Truck className="h-5 w-5 text-primary-500" />
            </div>
            <h3 className="text-md font-semibold">إعدادات التوصيل القياسي</h3>
          </div>
          {expandedSections.standard ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.standard && (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    تكلفة التوصيل (د.ك)
                    <span className="bg-primary-50 text-primary-600 text-xs px-2 py-0.5 rounded-full">أساسي</span>
                  </Label>
                  <Input 
                    type="number" 
                    placeholder="2" 
                    dir="ltr" 
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="border-primary-200 focus:border-primary-400"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    تكلفة التوصيل الأساسية للطلبات في الكويت
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
              
              <Separator className="my-4" />
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      التوصيل المجاني
                      <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-700">
                        مميز
                      </Badge>
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">تفعيل التوصيل المجاني للطلبات التي تتجاوز مبلغ معين</p>
                  </div>
                  <Switch 
                    checked={freeShipping}
                    onCheckedChange={setFreeShipping}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
                
                <div className={`space-y-2 transition-opacity duration-200 ${freeShipping ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-700">الحد الأدنى للتوصيل المجاني</Label>
                    <Badge variant="outline" className="bg-white">
                      {freeShippingThreshold} د.ك
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <Slider 
                      value={[freeShippingThreshold]} 
                      max={50} 
                      step={1} 
                      onValueChange={(val) => setFreeShippingThreshold(val[0])}
                      disabled={!freeShipping}
                      className="data-[disabled]:opacity-50"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">0 د.ك</span>
                      <Input 
                        type="number" 
                        value={freeShippingThreshold} 
                        onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                        className="w-20 h-8 text-sm text-center border-primary-200 focus:border-primary-400" 
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
        )}
      </Card>
      
      <Card className="border-primary/10 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
             onClick={() => toggleSection('talefree')}>
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-full">
              <div className="h-5 w-5 flex items-center justify-center font-bold text-amber-600">T</div>
            </div>
            <h3 className="text-md font-semibold">توصيل تاليفري</h3>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              متاح في الكويت
            </Badge>
          </div>
          {expandedSections.talefree ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.talefree && (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  عند تفعيل هذه الخدمة، ستتمكن من استخدام خدمات توصيل تاليفري المتاحة في جميع مناطق الكويت. سيتم تحويل الطلبات مباشرة إلى نظام توصيل تاليفري.
                </p>
                
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-amber-100">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">1</div>
                    <div className="text-sm text-gray-700">استلام الطلبات من متجرك مباشرة</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-amber-100">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">2</div>
                    <div className="text-sm text-gray-700">تجهيز الطلب من خلال فريق تاليفري</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-amber-100">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">3</div>
                    <div className="text-sm text-gray-700">توصيل الطلب إلى عميلك بسرعة واحترافية</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-amber-50 p-4 rounded-md">
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-start space-x-2 space-x-reverse mb-3">
                      <RadioGroupItem value="standard" id="standard" className="mt-1 border-amber-400 text-amber-600" />
                      <div className="grid gap-1.5 mr-2">
                        <Label htmlFor="standard" className="text-sm font-medium">الخدمة القياسية</Label>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500 ml-1">
                            توصيل خلال 2-3 ساعات
                          </p>
                          <Badge className="bg-white text-amber-600 border-amber-200">
                            2 د.ك
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <RadioGroupItem 
                        value="express" 
                        id="express" 
                        disabled={!isPaidPlan}
                        className="mt-1 border-amber-400 text-amber-600 disabled:opacity-50"
                      />
                      <div className="grid gap-1.5 mr-2">
                        <div className="flex items-center">
                          <Label htmlFor="express" className={`text-sm font-medium ${!isPaidPlan ? 'text-gray-400' : ''}`}>
                            التوصيل السريع
                          </Label>
                          {!isPaidPlan && (
                            <Badge variant="outline" className="mr-2 text-xs bg-gray-50 text-gray-500 border-gray-200">
                              الباقات المدفوعة فقط
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          <p className={`text-xs ${!isPaidPlan ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                            توصيل خلال ساعة واحدة
                          </p>
                          <Badge className={`${!isPaidPlan ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-amber-600 border-amber-200'}`}>
                            3 د.ك
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">ملاحظة: </span>
                    سيتم فتح حساب خاص بالمتجر على منصة تاليفري للتوصيل. وسيتم التواصل معك من قبل فريق تاليفري لإكمال الإعداد.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {isPaidPlan && (
        <Card className="border-primary/10 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
               onClick={() => toggleSection('zones')}>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-md font-semibold">مناطق التوصيل المخصصة</h3>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                باقة مدفوعة
              </Badge>
            </div>
            {expandedSections.zones ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </div>
          
          {expandedSections.zones && (
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                    <Info className="h-4 w-4" />
                    حدد مناطق توصيل مختلفة وأسعار توصيل مخصصة لكل منطقة في الكويت
                  </p>
                  
                  {deliveryZones.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {deliveryZones.map((zone) => (
                        <div key={zone.id} className="border rounded-md p-4 bg-white hover:border-green-200 transition-colors">
                          <div className="grid gap-4 sm:grid-cols-2 mb-3">
                            <div className="space-y-2">
                              <Label className="text-gray-700">المنطقة</Label>
                              <Select 
                                value={zone.name}
                                onValueChange={(value) => updateDeliveryZone(zone.id, 'name', value)}
                              >
                                <SelectTrigger className="border-green-200 focus:border-green-400">
                                  <SelectValue placeholder="اختر المنطقة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="العاصمة">العاصمة</SelectItem>
                                  <SelectItem value="حولي">حولي</SelectItem>
                                  <SelectItem value="الفروانية">الفروانية</SelectItem>
                                  <SelectItem value="مبارك الكبير">مبارك الكبير</SelectItem>
                                  <SelectItem value="الأحمدي">الأحمدي</SelectItem>
                                  <SelectItem value="الجهراء">الجهراء</SelectItem>
                                  <SelectItem value="السالمية">السالمية</SelectItem>
                                  <SelectItem value="الفنيطيس">الفنيطيس</SelectItem>
                                  <SelectItem value="custom">منطقة مخصصة</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-gray-700">تكلفة التوصيل (د.ك)</Label>
                              <Input 
                                type="number" 
                                placeholder="1.5" 
                                dir="ltr"
                                value={zone.cost}
                                onChange={(e) => updateDeliveryZone(zone.id, 'cost', Number(e.target.value))}
                                className="border-green-200 focus:border-green-400"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-700">تفاصيل المنطقة (اختياري)</Label>
                            <Textarea 
                              placeholder="أضف تفاصيل حول المنطقة أو ملاحظات خاصة بالتوصيل في هذه المنطقة"
                              className="resize-none border-green-200 focus:border-green-400"
                              rows={2}
                              value={zone.details || ''}
                              onChange={(e) => updateDeliveryZone(zone.id, 'details', e.target.value)}
                            />
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => removeDeliveryZone(zone.id)}
                              className="h-8 px-3"
                            >
                              حذف المنطقة
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={addDeliveryZone}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      إضافة منطقة توصيل جديدة
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
      
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" className="border-gray-200">إلغاء</Button>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          حفظ إعدادات الشحن
        </Button>
      </div>
    </div>
  );
};

export default ShippingMethodForm;
