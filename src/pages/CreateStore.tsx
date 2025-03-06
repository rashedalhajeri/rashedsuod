
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isValidDomainName, formatStoreUrl } from "@/utils/url-utils";

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    domainName: "",
    phoneNumber: "",
    country: "Kuwait",
    currency: "KWD"
  });
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    if (formData.domainName && isValidDomainName(formData.domainName)) {
      setStoreUrl(formatStoreUrl(formData.domainName));
    } else {
      setStoreUrl(null);
    }
  }, [formData.domainName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "domainName") {
      setDomainAvailable(null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const checkDomainAvailability = async () => {
    if (!formData.domainName.trim()) {
      toast.error("الرجاء إدخال اسم النطاق أولاً");
      return;
    }

    if (!isValidDomainName(formData.domainName)) {
      toast.error("اسم النطاق يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط");
      return;
    }

    setCheckingDomain(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('domain_name')
        .eq('domain_name', formData.domainName)
        .maybeSingle();

      if (error) throw error;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainAvailable) {
      toast.error("الرجاء التحقق من توفر اسم النطاق أولاً");
      return;
    }

    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) {
        toast.error("الرجاء تسجيل الدخول للمتابعة");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('stores')
        .insert([
          {
            user_id: userData.user.id,
            store_name: formData.storeName,
            domain_name: formData.domainName,
            phone_number: formData.phoneNumber,
            country: formData.country,
            currency: formData.currency
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log("Store created successfully:", data);
      toast.success("تم إنشاء المتجر بنجاح، جاري تحويلك للوحة التحكم");
      
      // Always redirect to dashboard after creating store
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("حدث خطأ أثناء إنشاء المتجر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">إنشاء متجر جديد</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">اسم المتجر</Label>
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
            <Label htmlFor="domainName">اسم النطاق</Label>
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
              <p className="text-green-600 text-sm">✓ اسم النطاق متاح</p>
            )}
            {domainAvailable === false && (
              <p className="text-red-600 text-sm">✗ اسم النطاق غير متاح</p>
            )}
            {storeUrl && (
              <p className="text-sm text-muted-foreground mt-1">
                <b>رابط المتجر:</b> {storeUrl}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+965 xxxxxxxx"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">الدولة</Label>
            <Select
              defaultValue={formData.country}
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
              defaultValue={formData.currency}
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
          
          {storeUrl && (
            <Alert className="bg-blue-50 text-blue-700 border-blue-100">
              <AlertDescription>
                سيكون رابط متجرك: <strong>{storeUrl}</strong>
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={loading || !domainAvailable}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء المتجر"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            العودة
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
