
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StoreFormData } from "@/features/store-creation/types";
import { validateStep } from "@/features/store-creation/utils/validation";
import { createStore } from "@/features/store-creation/utils/store-api";
import StepIndicator from "@/features/store-creation/components/StepIndicator";
import BasicInfoStep from "@/features/store-creation/components/BasicInfoStep";
import StoreSettingsStep from "@/features/store-creation/components/StoreSettingsStep";
import ConfirmationStep from "@/features/store-creation/components/ConfirmationStep";

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StoreFormData>({
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

  // Go to next step
  const nextStep = () => {
    if (validateStep(currentStep, formData, domainAvailable)) {
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
    
    if (!validateStep(currentStep, formData, domainAvailable)) {
      return;
    }

    setLoading(true);
    try {
      const success = await createStore(formData);
      
      if (success) {
        toast.success("تم إنشاء المتجر بنجاح");
        navigate("/dashboard");
      } else {
        toast.error("حدث خطأ أثناء إنشاء المتجر");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-2">إنشاء متجر جديد</h1>
        <p className="text-gray-500 text-center mb-6">أنشئ متجرك الإلكتروني بخطوات بسيطة</p>
        
        <StepIndicator currentStep={currentStep} totalSteps={3} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <BasicInfoStep 
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              domainAvailable={domainAvailable}
              setDomainAvailable={setDomainAvailable}
              checkingDomain={checkingDomain}
              setCheckingDomain={setCheckingDomain}
            />
          )}
          
          {currentStep === 2 && (
            <StoreSettingsStep 
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
              handleChange={handleChange}
            />
          )}
          
          {currentStep === 3 && (
            <ConfirmationStep 
              formData={formData}
              handleSwitchChange={handleSwitchChange}
            />
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
