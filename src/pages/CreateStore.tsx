import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If domain name, convert to lowercase and remove spaces and special characters
    if (name === "domainName") {
      // Allow only lowercase letters, numbers, and hyphens
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData({
        ...formData,
        [name]: sanitizedValue
      });
      
      // Reset domain availability check when domain name changes
      setDomainAvailable(null);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Check domain availability
  const checkDomainAvailability = async () => {
    if (!formData.domainName.trim()) {
      toast.error("الرجاء إدخال اسم النطاق أولاً");
      return;
    }

    // Validate domain name (alphanumeric and hyphens only)
    const domainRegex = /^[a-z0-9-]+$/;
    if (!domainRegex.test(formData.domainName)) {
      toast.error("اسم النطاق يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط");
      return;
    }

    setCheckingDomain(true);
    try {
      // Check if domain already exists in database (case insensitive)
      const { data, error } = await supabase
        .from('stores')
        .select('domain_name')
        .ilike('domain_name', formData.domainName.toLowerCase())
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

  // Submit form to create a store
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainAvailable) {
      toast.error("الرجاء التحقق من توفر اسم النطاق أولاً");
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) {
        toast.error("الرجاء تسجيل الدخول للمتابعة");
        navigate("/auth");
        return;
      }

      // First check if the user already has a store
      const { count, error: countError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.user.id);
        
      if (countError) throw countError;
      
      // If user already has a store, redirect to dashboard
      // For free plan users, limit to 1 store
      if (count && count > 0) {
        const { data: userStore } = await supabase
          .from('stores')
          .select('subscription_plan')
          .eq('user_id', userData.user.id)
          .limit(1)
          .single();
          
        if (userStore?.subscription_plan === 'free') {
          toast.error("الخطة المجانية تسمح بإنشاء متجر واحد فقط. يرجى الترقية للخطة المدفوعة لإنشاء المزيد من المتاجر.");
          navigate("/dashboard");
          return;
        }
      }

      // Create store with sanitized domain name
      const { data, error } = await supabase
        .from('stores')
        .insert([
          {
            user_id: userData.user.id,
            store_name: formData.storeName,
            domain_name: formData.domainName.toLowerCase().trim(),
            phone_number: formData.phoneNumber,
            country: formData.country,
            currency: formData.currency
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("تم إنشاء المتجر بنجاح");
      navigate("/dashboard");
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
                placeholder="my-store"
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
            <p className="text-gray-500 text-xs">يجب أن يحتوي اسم النطاق على أحرف إنجليزية صغيرة وأرقام وشرطات فقط، مثل: my-store</p>
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
