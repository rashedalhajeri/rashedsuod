
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, Package, Clock, MapPin, Zap, CheckCircle, PlusCircle, Trash2, Save, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  StoreShippingSettings, 
  DeliveryArea, 
  getShippingSettings, 
  saveShippingSettings, 
  getDeliveryAreas, 
  saveDeliveryAreas,
  getKuwaitGovernorates,
  applyPriceToSelectedGovernorates,
  toggleSelectedGovernorates
} from "@/services/shipping-service";
import useStoreData from "@/hooks/use-store-data";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShippingMethodFormProps {
  isPaidPlan: boolean;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({
  isPaidPlan
}) => {
  const { data: storeData } = useStoreData();

  // حالة نظام التوصيل: إما توصيل المتجر (storeDelivery) أو توصيل فريق برونز (bronzeDelivery)
  const [storeDelivery, setStoreDelivery] = useState(true);
  const [bronzeDelivery, setBronzeDelivery] = useState(false);

  // إعدادات توصيل المتجر (الافتراضي)
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeShippingMinOrder, setFreeShippingMinOrder] = useState("100");
  const [standardDeliveryTime, setStandardDeliveryTime] = useState("2-3");
  const [deliveryTimeUnit, setDeliveryTimeUnit] = useState("days");

  // إدارة مناطق التوصيل للمتجر
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  
  // محافظات الكويت
  const [selectedGovernorateTab, setSelectedGovernorateTab] = useState("all");
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([]);
  const [governoratePrice, setGovernoratePrice] = useState("3");
  
  // إضافة مناطق خاصة
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPrice, setNewAreaPrice] = useState("5");
  const [activeAreaTab, setActiveAreaTab] = useState("governorates");

  // حالة توصيل فريق برونز
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState("standard");

  // حالة التحميل
  const [isLoading, setIsLoading] = useState(false);

  // جلب الإعدادات عند تحميل المكون
  useEffect(() => {
    const fetchSettings = async () => {
      if (storeData?.id) {
        setIsLoading(true);

        // جلب إعدادات الشحن
        const settings = await getShippingSettings(storeData.id);
        if (settings) {
          setStoreDelivery(settings.shipping_method === 'store_delivery');
          setBronzeDelivery(settings.shipping_method === 'bronze_delivery');
          setFreeShipping(settings.free_shipping);
          setFreeShippingMinOrder(settings.free_shipping_min_order.toString());
          setStandardDeliveryTime(settings.standard_delivery_time);
          setDeliveryTimeUnit(settings.delivery_time_unit);
          setSelectedDeliverySpeed(settings.bronze_delivery_speed);
        }

        // جلب مناطق التوصيل
        const areas = await getDeliveryAreas(storeData.id);
        if (areas.length > 0) {
          // تحديد المناطق الموجودة
          setDeliveryAreas(areas);
        } else {
          // إنشاء محافظات افتراضية إذا لم تكن موجودة
          setDeliveryAreas(getKuwaitGovernorates().map(gov => ({
            ...gov,
            store_id: storeData.id
          })));
        }
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [storeData?.id]);

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

  // إدارة المحافظات
  const handleGovernorateSelection = (governorateName: string) => {
    setSelectedGovernorates(prev => {
      if (prev.includes(governorateName)) {
        return prev.filter(gov => gov !== governorateName);
      } else {
        return [...prev, governorateName];
      }
    });
  };
  
  const handleSelectAllGovernorates = () => {
    if (selectedGovernorates.length === getKuwaitGovernorates().length) {
      setSelectedGovernorates([]);
    } else {
      setSelectedGovernorates(getKuwaitGovernorates().map(gov => gov.name));
    }
  };
  
  const handleApplyPriceToSelectedGovernorates = () => {
    if (selectedGovernorates.length === 0) {
      toast.error("يرجى اختيار محافظة واحدة على الأقل");
      return;
    }
    
    const price = parseFloat(governoratePrice);
    if (isNaN(price) || price < 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }
    
    setDeliveryAreas(prev => applyPriceToSelectedGovernorates(prev, selectedGovernorates, price));
    toast.success(`تم تعيين سعر ${price} دينار للمحافظات المحددة`);
  };
  
  const handleEnableSelectedGovernorates = (enabled: boolean) => {
    if (selectedGovernorates.length === 0) {
      toast.error("يرجى اختيار محافظة واحدة على الأقل");
      return;
    }
    
    setDeliveryAreas(prev => toggleSelectedGovernorates(prev, selectedGovernorates, enabled));
    toast.success(enabled ? "تم تفعيل المحافظات المحددة" : "تم تعطيل المحافظات المحددة");
  };
  
  // إدارة مناطق التوصيل الإضافية
  const handleAreaPriceChange = (areaId: string, price: string) => {
    setDeliveryAreas(deliveryAreas.map(area => area.id === areaId || (!area.id && area.name === areaId) ? {
      ...area,
      price: parseFloat(price) || 0
    } : area));
  };
  
  const handleAreaToggle = (areaId: string, isEnabled: boolean) => {
    setDeliveryAreas(deliveryAreas.map(area => area.id === areaId || (!area.id && area.name === areaId) ? {
      ...area,
      enabled: isEnabled
    } : area));
  };
  
  const handleAddNewArea = () => {
    if (!newAreaName.trim()) {
      toast.error("يرجى إدخال اسم المنطقة");
      return;
    }

    // التحقق من وجود المنطقة مسبقًا
    const areaExists = deliveryAreas.some(area => area.name.trim().toLowerCase() === newAreaName.trim().toLowerCase());
    if (areaExists) {
      toast.error("هذه المنطقة موجودة بالفعل");
      return;
    }
    
    const newArea: DeliveryArea = {
      store_id: storeData?.id || "",
      name: newAreaName.trim(),
      price: parseFloat(newAreaPrice) || 0,
      enabled: true,
      is_governorate: false
    };
    
    setDeliveryAreas([...deliveryAreas, newArea]);
    setNewAreaName("");
    setNewAreaPrice("5");
    toast.success("تمت إضافة المنطقة بنجاح");
  };
  
  const handleRemoveArea = (areaName: string) => {
    setDeliveryAreas(deliveryAreas.filter(area => !area.is_governorate && area.name !== areaName));
    toast.success("تم حذف المنطقة بنجاح");
  };

  // حفظ الإعدادات
  const handleSaveSettings = async () => {
    if (!storeData?.id) {
      toast.error("لم يتم العثور على معرف المتجر");
      return;
    }
    setIsLoading(true);
    try {
      // تجهيز إعدادات الشحن
      const shippingSettings: StoreShippingSettings = {
        store_id: storeData.id,
        shipping_method: storeDelivery ? 'store_delivery' : 'bronze_delivery',
        free_shipping: freeShipping,
        free_shipping_min_order: parseFloat(freeShippingMinOrder) || 0,
        standard_delivery_time: standardDeliveryTime,
        delivery_time_unit: deliveryTimeUnit as 'hours' | 'days',
        bronze_delivery_speed: selectedDeliverySpeed as 'standard' | 'express' | 'same_day'
      };

      // حفظ إعدادات الشحن
      const settingsSaved = await saveShippingSettings(shippingSettings);
      if (settingsSaved && storeDelivery) {
        // إذا كان توصيل المتجر مفعل، نقوم بحفظ مناطق التوصيل
        const areasWithStoreId = deliveryAreas.map(area => ({
          ...area,
          store_id: storeData.id
        }));
        await saveDeliveryAreas(areasWithStoreId);
      }
      toast.success("تم حفظ إعدادات الشحن بنجاح");
    } catch (error) {
      console.error("خطأ في حفظ الإعدادات:", error);
      toast.error("حدث خطأ في حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-2">جاري تحميل الإعدادات...</span>
      </div>;
  }

  // الحصول على المحافظات المفعلة فقط
  const enabledGovernorates = deliveryAreas.filter(area => area.is_governorate && area.enabled);
  // الحصول على المناطق الإضافية
  const customAreas = deliveryAreas.filter(area => !area.is_governorate);
  
  return <div className="space-y-6">
      {/* نظام التوصيل الرئيسي - اختيار بين توصيل المتجر أو فريق برونز */}
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* توصيل المتجر (الافتراضي) */}
            <Card className={`relative cursor-pointer transition-all duration-300 p-1 ${storeDelivery ? "ring-2 ring-blue-500 bg-blue-50" : "opacity-80 hover:opacity-100"}`} onClick={() => handleStoreDeliveryChange(true)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800">نظام توصيل المتجر</h3>
                  </div>
                  <Switch checked={storeDelivery} onCheckedChange={handleStoreDeliveryChange} aria-label="تفعيل نظام توصيل المتجر" />
                </div>
                <p className="text-sm text-blue-700 mb-2">تحكم كامل في عمليات التوصيل وتحديد المناطق والأسعار</p>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">الوضع الافتراضي</Badge>
              </CardContent>
            </Card>
            
            {/* توصيل فريق برونز */}
            <Card className={`relative cursor-pointer transition-all duration-300 p-1 ${bronzeDelivery ? "ring-2 ring-green-500 bg-green-50" : "opacity-80 hover:opacity-100"}`} onClick={() => handleBronzeDeliveryChange(true)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">توصيل فريق برونز</h3>
                  </div>
                  <Switch checked={bronzeDelivery} onCheckedChange={handleBronzeDeliveryChange} aria-label="تفعيل خدمة برونز" />
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
      {storeDelivery && <div className="space-y-5">
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
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">التوصيل المجاني</h4>
                    <p className="text-sm text-blue-600">تقديم توصيل مجاني للطلبات التي تتجاوز قيمة معينة</p>
                  </div>
                </div>
                <Switch checked={freeShipping} onCheckedChange={setFreeShipping} aria-label="تفعيل الشحن المجاني" />
              </div>
              
              {freeShipping && <div className="border border-blue-100 rounded-lg p-4 bg-white">
                  <Label htmlFor="min-order-free-shipping" className="text-blue-800 font-medium mb-2 block">
                    الحد الأدنى للطلب للشحن المجاني (KWD)
                  </Label>
                  <div className="relative">
                    <Input id="min-order-free-shipping" type="number" className="pl-12 text-xl font-semibold dir-ltr" value={freeShippingMinOrder} onChange={e => setFreeShippingMinOrder(e.target.value)} />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      KWD
                    </div>
                  </div>
                </div>}
              
              {/* وقت التوصيل */}
              <div className="border border-blue-100 rounded-lg p-4 bg-white">
                <Label htmlFor="delivery-time" className="text-blue-800 font-medium mb-2 block">
                  مدة التوصيل
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input id="delivery-time" type="text" className="pl-4 text-xl font-semibold" value={standardDeliveryTime} onChange={e => setStandardDeliveryTime(e.target.value)} placeholder="1-2" />
                  </div>
                  <div className="w-1/3">
                    <Select value={deliveryTimeUnit} onValueChange={setDeliveryTimeUnit}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="وحدة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">أيام</SelectItem>
                        <SelectItem value="hours">ساعات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  يمكنك استخدام نطاق مثل "1-2" أو "2-3" أو قيمة محددة مثل "24" أو "اليوم" حسب احتياجك
                </p>
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
                  <Tabs value={activeAreaTab} onValueChange={setActiveAreaTab}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="governorates">المحافظات</TabsTrigger>
                      <TabsTrigger value="custom-areas">مناطق إضافية</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="governorates" className="mt-4">
                      <div className="space-y-4">
                        {/* شريط التحكم بالمحافظات */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-blue-800">تحديد المحافظات</h5>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-600 border-blue-200"
                              onClick={handleSelectAllGovernorates}
                            >
                              {selectedGovernorates.length === getKuwaitGovernorates().length ? "إلغاء تحديد الكل" : "تحديد الكل"}
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {getKuwaitGovernorates().map(gov => (
                              <div 
                                key={gov.name}
                                className={`p-2 rounded-lg cursor-pointer border ${selectedGovernorates.includes(gov.name) ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'}`}
                                onClick={() => handleGovernorateSelection(gov.name)}
                              >
                                <div className="flex items-center">
                                  <Checkbox 
                                    checked={selectedGovernorates.includes(gov.name)} 
                                    onCheckedChange={() => handleGovernorateSelection(gov.name)} 
                                    className="ml-2" 
                                  />
                                  <span className="font-medium">{gov.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {selectedGovernorates.length > 0 && (
                          <div className="border border-blue-100 rounded-lg p-3 bg-white">
                            <h5 className="font-medium text-blue-800 mb-3">إجراءات على المحافظات المحددة</h5>
                            
                            <div className="space-y-3">
                              <div className="flex items-end gap-3">
                                <div className="flex-1">
                                  <Label htmlFor="governorate-price" className="block text-sm font-medium text-gray-700 mb-1">
                                    تعيين سعر (KWD)
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="governorate-price"
                                      type="number"
                                      className="pl-10 text-base font-semibold dir-ltr"
                                      value={governoratePrice}
                                      onChange={e => setGovernoratePrice(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">
                                      KWD
                                    </div>
                                  </div>
                                </div>
                                
                                <Button
                                  type="button"
                                  className="bg-blue-500 hover:bg-blue-600"
                                  onClick={handleApplyPriceToSelectedGovernorates}
                                >
                                  <Check className="h-4 w-4 ml-1" /> تطبيق السعر
                                </Button>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                  onClick={() => handleEnableSelectedGovernorates(true)}
                                >
                                  <Check className="h-4 w-4 ml-1" /> تفعيل المناطق
                                </Button>
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleEnableSelectedGovernorates(false)}
                                >
                                  <Trash2 className="h-4 w-4 ml-1" /> تعطيل المناطق
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-3 border border-blue-100 rounded-lg bg-white">
                          <h5 className="font-medium text-blue-800 mb-3">قائمة المحافظات والأسعار</h5>
                          
                          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                            {deliveryAreas.filter(area => area.is_governorate).map(gov => (
                              <div 
                                key={gov.name}
                                className={`flex justify-between items-center p-3 rounded-lg border ${gov.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    checked={gov.enabled} 
                                    onCheckedChange={checked => handleAreaToggle(gov.name, checked === true)} 
                                  />
                                  <span className={`font-medium ${gov.enabled ? 'text-blue-800' : 'text-gray-500'}`}>
                                    {gov.name}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-28">
                                    <div className="relative">
                                      <Input 
                                        type="number" 
                                        className="pl-10 text-base font-semibold dir-ltr" 
                                        value={gov.price.toString()} 
                                        onChange={e => handleAreaPriceChange(gov.name, e.target.value)} 
                                        disabled={!gov.enabled} 
                                      />
                                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">
                                        KWD
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom-areas" className="mt-4">
                      <div className="space-y-4">
                        {/* إضافة منطقة جديدة */}
                        <div className="border border-blue-100 rounded-lg p-4 bg-white">
                          <h5 className="font-medium text-blue-800 mb-3">إضافة منطقة جديدة</h5>
                          <div className="grid gap-3">
                            <div>
                              <Label htmlFor="new-area-name" className="block text-sm font-medium text-gray-700 mb-1">
                                اسم المنطقة
                              </Label>
                              <Input 
                                id="new-area-name" 
                                value={newAreaName} 
                                onChange={e => setNewAreaName(e.target.value)} 
                                placeholder="أدخل اسم المنطقة" 
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="new-area-price" className="block text-sm font-medium text-gray-700 mb-1">
                                سعر التوصيل (KWD)
                              </Label>
                              <div className="relative">
                                <Input 
                                  id="new-area-price" 
                                  type="number" 
                                  className="pl-10 text-base font-semibold dir-ltr" 
                                  value={newAreaPrice} 
                                  onChange={e => setNewAreaPrice(e.target.value)} 
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">
                                  KWD
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              type="button" 
                              onClick={handleAddNewArea} 
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <PlusCircle className="h-4 w-4 ml-1" /> إضافة المنطقة
                            </Button>
                          </div>
                        </div>
                        
                        {/* المناطق الإضافية */}
                        {customAreas.length > 0 ? (
                          <div className="border border-blue-100 rounded-lg p-4 bg-white">
                            <h5 className="font-medium text-blue-800 mb-3">المناطق الإضافية</h5>
                            <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                              {customAreas.map((area, index) => (
                                <div 
                                  key={area.id || `custom-area-${index}`}
                                  className={`flex justify-between items-center p-3 rounded-lg border ${area.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox 
                                      checked={area.enabled} 
                                      onCheckedChange={checked => handleAreaToggle(area.id || area.name, checked === true)} 
                                    />
                                    <span className={`font-medium ${area.enabled ? 'text-blue-800' : 'text-gray-500'}`}>
                                      {area.name}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <div className="w-28">
                                      <div className="relative">
                                        <Input 
                                          type="number" 
                                          className="pl-10 text-base font-semibold dir-ltr" 
                                          value={area.price.toString()} 
                                          onChange={e => handleAreaPriceChange(area.id || area.name, e.target.value)} 
                                          disabled={!area.enabled} 
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">
                                          KWD
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                                      onClick={() => handleRemoveArea(area.name)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-5 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            لا توجد مناطق إضافية حتى الآن
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>}
      
      {/* توصيل فريق برونز */}
      {bronzeDelivery && <div className="rounded-lg border border-green-300 bg-white shadow-md">
          <div className="p-5 border-b border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-2">خدمة توصيل فريق برونز</h3>
            <p className="text-green-700">خدمة متكاملة لتوصيل طلبات متجرك بواسطة فريق برونز</p>
          </div>
          
          <div className="p-5">
            <Alert className="bg-green-50 border-green-200 mb-6">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">معلومات هامة</AlertTitle>
              <AlertDescription className="text-green-700">
                جميع الطلبات ستُحول تلقائياً إلى لوحة تحكم فريق برونز
              </AlertDescription>
            </Alert>
            
            <div className="space-y-5">
              <div className="text-base font-medium mb-2 text-green-800">سرعة التوصيل:</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "standard" ? "bg-green-50 ring-2 ring-green-500" : ""}`} onClick={() => setSelectedDeliverySpeed("standard")}>
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
                
                <Card className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "express" ? "bg-green-50 ring-2 ring-green-500" : ""}`} onClick={() => setSelectedDeliverySpeed("express")}>
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
                
                <Card className={`border-green-200 transition-all cursor-pointer hover:shadow-md ${selectedDeliverySpeed === "same_day" ? "bg-green-50 ring-2 ring-green-500" : ""}`} onClick={() => setSelectedDeliverySpeed("same_day")}>
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
        </div>}
      
      <div className="flex justify-end">
        <Button type="button" onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700" size="lg" disabled={isLoading}>
          {isLoading ? <>
              <span className="animate-spin mr-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
              جاري الحفظ...
            </> : <>
              <Save className="h-4 w-4 ml-1" />
              حفظ التغييرات
            </>}
        </Button>
      </div>
    </div>;
};

export default ShippingMethodForm;
