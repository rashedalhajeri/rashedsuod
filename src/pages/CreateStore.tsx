
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    domainName: "",
    phoneNumber: "",
    country: "Kuwait",
    currency: "KWD",
    description: "",
    shippingMethod: "store_delivery",
    freeShipping: false,
    freeShippingMinOrder: 0,
    storeTheme: "modern",
    acceptTerms: false
  });
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset domain availability check when domain name changes
    if (name === "domainName") {
      setDomainAvailable(null);
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Check domain availability
  const checkDomainAvailability = async () => {
    if (!formData.domainName.trim()) {
      toast.error("الرجاء إدخال اسم النطاق أولاً");
      return;
    }

    // Validate domain name (alphanumeric and hyphens only)
    const domainRegex = /^[a-zA-Z0-9-]+$/;
    if (!domainRegex.test(formData.domainName)) {
      toast.error("اسم النطاق يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط");
      return;
    }

    setCheckingDomain(true);
    try {
      // Check if domain already exists in database
      const { data, error } = await supabase
        .from('stores')
        .select('domain_name')
        .eq('domain_name', formData.domainName)
        .maybeSingle();

      if (error) throw error;

      // If data is null, domain is available
      setDomainAvailable(!data);
      if (!data) {
        toast.success("اسم النطاق متاح");
      } else {
        toast.error("اسم النطاق غير متاح، الرجاء اختيار اسم آخر");
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      toast.error("حدث خطأ أثناء التحقق من توفر اسم النطاق");
    } finally {
      setCheckingDomain(false);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.storeName) {
        toast.error("الرجاء إدخال اسم المتجر");
        return false;
      }
      if (!formData.domainName) {
        toast.error("الرجاء إدخال اسم النطاق");
        return false;
      }
      if (!domainAvailable) {
        toast.error("الرجاء التحقق من توفر اسم النطاق أولاً");
        return false;
      }
      if (!formData.phoneNumber) {
        toast.error("الرجاء إدخال رقم الهاتف");
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.acceptTerms) {
        toast.error("الرجاء الموافقة على شروط الخدمة");
        return false;
      }
    }
    return true;
  };

  // Go to next step
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Go to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit form to create a store
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) {
        toast.error("الرجاء تسجيل الدخول للمتابعة");
        navigate("/");
        return;
      }

      // Create store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert([
          {
            user_id: userData.user.id,
            store_name: formData.storeName,
            domain_name: formData.domainName,
            phone_number: formData.phoneNumber,
            country: formData.country,
            currency: formData.currency,
            description: formData.description
          }
        ])
        .select()
        .single();

      if (storeError) throw storeError;

      // Create store settings
      const { error: settingsError } = await supabase
        .from('store_settings')
        .insert([
          {
            store_id: storeData.id,
            shipping_method: formData.shippingMethod,
            free_shipping: formData.freeShipping,
            free_shipping_min_order: formData.freeShippingMinOrder
          }
        ]);

      if (settingsError) throw settingsError;

      // Create store theme settings
      const { error: themeError } = await supabase
        .from('store_theme_settings')
        .insert([
          {
            store_id: storeData.id,
            theme_id: formData.storeTheme
          }
        ]);

      if (themeError) throw themeError;

      toast.success("تم إنشاء المتجر بنجاح");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("حدث خطأ أثناء إنشاء المتجر");
    } finally {
      setLoading(false);
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep === step
                  ? "border-primary bg-primary text-white"
                  : currentStep > step
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 3 && (
              <div 
                className={`h-1 w-16 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-2">إنشاء متجر جديد</h1>
        <p className="text-gray-500 text-center mb-6">أنشئ متجرك الإلكتروني بخطوات بسيطة</p>
        
        {renderStepIndicators()}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">المعلومات الأساسية</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">اسم المتجر <span className="text-red-500">*</span></Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="أدخل اسم المتجر"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="domainName">اسم النطاق <span className="text-red-500">*</span></Label>
                  <div className="flex space-x-2 items-center">
                    <Input
                      id="domainName"
                      name="domainName"
                      value={formData.domainName}
                      onChange={handleChange}
                      placeholder="example"
                      className="flex-1 ml-2"
                      required
                    />
                    <span className="text-gray-500 whitespace-nowrap">.linok.me</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={checkDomainAvailability}
                      disabled={checkingDomain || !formData.domainName}
                      className="whitespace-nowrap"
                    >
                      {checkingDomain ? "جاري التحقق..." : "تحقق من التوفر"}
                    </Button>
                  </div>
                  {domainAvailable === true && (
                    <p className="text-green-600 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> اسم النطاق متاح
                    </p>
                  )}
                  {domainAvailable === false && (
                    <p className="text-red-600 text-sm">✗ اسم النطاق غير متاح</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">رقم الهاتف <span className="text-red-500">*</span></Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+965 xxxxxxxx"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">الدولة</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleSelectChange("country", value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kuwait">الكويت</SelectItem>
                        <SelectItem value="Saudi Arabia">السعودية</SelectItem>
                        <SelectItem value="UAE">الإمارات</SelectItem>
                        <SelectItem value="Qatar">قطر</SelectItem>
                        <SelectItem value="Bahrain">البحرين</SelectItem>
                        <SelectItem value="Oman">عمان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange("currency", value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KWD">دينار كويتي (KWD)</SelectItem>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                        <SelectItem value="QAR">ريال قطري (QAR)</SelectItem>
                        <SelectItem value="BHD">دينار بحريني (BHD)</SelectItem>
                        <SelectItem value="OMR">ريال عماني (OMR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">وصف المتجر</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="أدخل وصفاً مختصراً لمتجرك"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">إعدادات المتجر</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">إعدادات الشحن</h3>
                  <Card>
                    <CardContent className="pt-6 pb-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="shippingMethod">طريقة الشحن</Label>
                          <Select
                            value={formData.shippingMethod}
                            onValueChange={(value) => handleSelectChange("shippingMethod", value)}
                          >
                            <SelectTrigger id="shippingMethod">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="store_delivery">توصيل المتجر</SelectItem>
                              <SelectItem value="courier">شركة شحن</SelectItem>
                              <SelectItem value="pickup">استلام من المتجر</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="freeShipping"
                            checked={formData.freeShipping}
                            onCheckedChange={(checked) => handleSwitchChange("freeShipping", checked)}
                          />
                          <Label htmlFor="freeShipping" className="mr-2">توصيل مجاني</Label>
                        </div>
                        
                        {formData.freeShipping && (
                          <div className="space-y-2">
                            <Label htmlFor="freeShippingMinOrder">الحد الأدنى للطلب للتوصيل المجاني</Label>
                            <Input
                              id="freeShippingMinOrder"
                              name="freeShippingMinOrder"
                              type="number"
                              value={formData.freeShippingMinOrder.toString()}
                              onChange={handleChange}
                              placeholder="0"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">مظهر المتجر</h3>
                  <Tabs defaultValue={formData.storeTheme} onValueChange={(value) => handleSelectChange("storeTheme", value)}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="modern">عصري</TabsTrigger>
                      <TabsTrigger value="minimal">بسيط</TabsTrigger>
                      <TabsTrigger value="classic">كلاسيكي</TabsTrigger>
                      <TabsTrigger value="business">أعمال</TabsTrigger>
                    </TabsList>
                    <div className="grid md:grid-cols-2 gap-4">
                      {["modern", "minimal", "classic", "business"].map((theme) => (
                        <Card key={theme} className={`overflow-hidden ${formData.storeTheme === theme ? "ring-2 ring-primary" : ""}`}>
                          <img 
                            src={`/themes/${theme}.jpg`} 
                            alt={theme} 
                            className="h-40 w-full object-cover"
                          />
                          <CardFooter className="p-2 flex justify-center">
                            <span className="text-sm">
                              {theme === "modern" && "عصري"}
                              {theme === "minimal" && "بسيط"}
                              {theme === "classic" && "كلاسيكي"}
                              {theme === "business" && "أعمال"}
                            </span>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">تأكيد المعلومات</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">اسم المتجر</h3>
                        <p>{formData.storeName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">اسم النطاق</h3>
                        <p>{formData.domainName}.linok.me</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                        <p>{formData.phoneNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">الدولة</h3>
                        <p>{formData.country}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">العملة</h3>
                        <p>{formData.currency}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">طريقة الشحن</h3>
                        <p>
                          {formData.shippingMethod === "store_delivery" && "توصيل المتجر"}
                          {formData.shippingMethod === "courier" && "شركة شحن"}
                          {formData.shippingMethod === "pickup" && "استلام من المتجر"}
                        </p>
                      </div>
                    </div>
                    
                    {formData.description && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">وصف المتجر</h3>
                        <p>{formData.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleSwitchChange("acceptTerms", checked)}
                />
                <Label htmlFor="acceptTerms" className="mr-2">أوافق على <a href="#" className="text-primary hover:underline">شروط الخدمة</a> و<a href="#" className="text-primary hover:underline">سياسة الخصوصية</a></Label>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                السابق
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                إلغاء
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                التالي
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "جاري الإنشاء..." : "إنشاء المتجر"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
