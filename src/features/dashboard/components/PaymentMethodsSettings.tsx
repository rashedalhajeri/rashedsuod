
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, CreditCard, HelpCircle, CheckCircle2, Settings, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useStoreData, isPaidPlan } from "@/hooks/use-store-data";

const PaymentMethodsSettings: React.FC = () => {
  const { data: storeData, isLoading } = useStoreData();
  const subscriptionPlan = storeData?.subscription_plan || "free";
  const isPaid = isPaidPlan(subscriptionPlan);
  
  // Payment method states
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [visaMastercard, setVisaMastercard] = useState(false);
  const [knet, setKnet] = useState(false);
  const [mada, setMada] = useState(false);
  const [benefit, setBenefit] = useState(false);
  
  // API configuration states
  const [visaApiConfigured, setVisaApiConfigured] = useState(false);
  const [knetApiConfigured, setKnetApiConfigured] = useState(false);
  const [madaApiConfigured, setMadaApiConfigured] = useState(false);
  const [benefitApiConfigured, setBenefitApiConfigured] = useState(false);
  
  const handleApiConfiguration = (gateway: string) => {
    toast.success(`تم فتح صفحة إعداد ${gateway}`);
  };
  
  const handlePaymentMethodToggle = (method: string, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!isPaid && method !== "cashOnDelivery") {
      toast.error("يتطلب تفعيل طرق الدفع الإلكتروني الاشتراك في باقة مدفوعة");
      return;
    }
    
    setState(!state);
    toast.success(`تم ${state ? 'تعطيل' : 'تفعيل'} ${method === "cashOnDelivery" ? 'الدفع عند الاستلام' : method}`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-500" />
          طرق الدفع
        </CardTitle>
        <CardDescription>
          قم بإعداد وإدارة طرق الدفع المتاحة في متجرك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cash on Delivery */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <CreditCard className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium">الدفع عند الاستلام</h4>
                <p className="text-sm text-gray-500">إتاحة خيار الدفع النقدي عند استلام الطلب</p>
              </div>
            </div>
            <Switch 
              checked={cashOnDelivery} 
              onCheckedChange={() => handlePaymentMethodToggle("cashOnDelivery", cashOnDelivery, setCashOnDelivery)}
            />
          </div>
          
          {/* Visa/Mastercard */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center">
                <img 
                  src="/payment-icons/visa-master.png" 
                  alt="Visa/Mastercard" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">فيزا / ماستركارد</h4>
                  {!visaApiConfigured && isPaid && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      بحاجة للإعداد
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">دعم بطاقات الائتمان والخصم</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPaid && !visaApiConfigured ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApiConfiguration("فيزا / ماستركارد")}
                >
                  <Settings className="h-4 w-4 ml-1" />
                  إعداد
                </Button>
              ) : null}
              <Switch 
                checked={visaMastercard} 
                onCheckedChange={() => handlePaymentMethodToggle("فيزا / ماستركارد", visaMastercard, setVisaMastercard)}
                disabled={!isPaid || !visaApiConfigured}
              />
            </div>
          </div>
          
          {/* KNET */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-white">
                <img 
                  src="/payment-icons/knet.png" 
                  alt="KNET" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">كي نت</h4>
                  {!knetApiConfigured && isPaid && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      بحاجة للإعداد
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">الشبكة الكويتية للمدفوعات الإلكترونية</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPaid && !knetApiConfigured ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApiConfiguration("كي نت")}
                >
                  <Settings className="h-4 w-4 ml-1" />
                  إعداد
                </Button>
              ) : null}
              <Switch 
                checked={knet} 
                onCheckedChange={() => handlePaymentMethodToggle("كي نت", knet, setKnet)}
                disabled={!isPaid || !knetApiConfigured}
              />
            </div>
          </div>
          
          {/* MADA */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-white">
                <img 
                  src="/payment-icons/mada.png" 
                  alt="MADA" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">مدى</h4>
                  {!madaApiConfigured && isPaid && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      بحاجة للإعداد
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">شبكة المدفوعات السعودية</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPaid && !madaApiConfigured ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApiConfiguration("مدى")}
                >
                  <Settings className="h-4 w-4 ml-1" />
                  إعداد
                </Button>
              ) : null}
              <Switch 
                checked={mada} 
                onCheckedChange={() => handlePaymentMethodToggle("مدى", mada, setMada)}
                disabled={!isPaid || !madaApiConfigured}
              />
            </div>
          </div>
          
          {/* Benefit */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-white">
                <img 
                  src="/payment-icons/benefit.png" 
                  alt="Benefit" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">بنفت</h4>
                  {!benefitApiConfigured && isPaid && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      بحاجة للإعداد
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">شبكة المدفوعات البحرينية</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPaid && !benefitApiConfigured ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApiConfiguration("بنفت")}
                >
                  <Settings className="h-4 w-4 ml-1" />
                  إعداد
                </Button>
              ) : null}
              <Switch 
                checked={benefit} 
                onCheckedChange={() => handlePaymentMethodToggle("بنفت", benefit, setBenefit)}
                disabled={!isPaid || !benefitApiConfigured}
              />
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-700">تحتاج مساعدة في إعداد بوابات الدفع؟</h4>
                <p className="text-sm text-blue-600 mt-1">
                  يمكنك الاطلاع على دليل إعداد بوابات الدفع لمعرفة كيفية ربط متجرك ببوابات الدفع المختلفة
                </p>
                <Button variant="link" className="text-blue-700 p-0 h-auto mt-1 flex items-center">
                  عرض الدليل
                  <ExternalLink className="h-3 w-3 mr-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsSettings;
