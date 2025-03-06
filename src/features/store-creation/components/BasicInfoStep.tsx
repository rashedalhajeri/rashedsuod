
import React from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { StoreFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface BasicInfoStepProps {
  formData: StoreFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  domainAvailable: boolean | null;
  checkingDomain: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  domainAvailable,
  checkingDomain,
}) => {
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

    toast.loading("جاري التحقق من توفر اسم النطاق...");
    try {
      // Check if domain already exists in database
      const { data, error } = await supabase
        .from('stores')
        .select('domain_name')
        .eq('domain_name', formData.domainName)
        .maybeSingle();

      if (error) throw error;

      // If data is null, domain is available
      if (!data) {
        toast.success("اسم النطاق متاح");
      } else {
        toast.error("اسم النطاق غير متاح، الرجاء اختيار اسم آخر");
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      toast.error("حدث خطأ أثناء التحقق من توفر اسم النطاق");
    }
  };

  return (
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
  );
};

export default BasicInfoStep;
