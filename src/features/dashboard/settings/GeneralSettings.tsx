
import React from "react";
import SaveButton from "@/components/ui/save-button";
import StoreInfoForm from "@/features/dashboard/components/settings/StoreInfoForm";
import ContactInfoForm from "@/features/dashboard/components/settings/ContactInfoForm";
import CurrencyLanguageForm from "@/features/dashboard/components/settings/CurrencyLanguageForm";
import { useStoreSettings } from "@/features/dashboard/hooks/use-store-settings";

interface GeneralSettingsProps {
  storeData: any;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ storeData }) => {
  const {
    storeValues,
    logoUrl,
    isSaving,
    handleLogoUpdate,
    handleStoreValueChange,
    handleSaveGeneralSettings
  } = useStoreSettings(storeData);
  
  // Extract contact values from storeValues
  const contactValues = {
    email: storeValues.email,
    phone: storeValues.phone,
    address: storeValues.address
  };
  
  // Extract currency and language values from storeValues
  const currencyLanguageValues = {
    currency: storeValues.currency,
    language: storeValues.language
  };
  
  const handleContactValueChange = (field: string, value: string) => {
    handleStoreValueChange(field, value);
  };
  
  return (
    <div className="space-y-4">
      <StoreInfoForm 
        storeValues={storeValues}
        logoUrl={logoUrl}
        onLogoUpdate={handleLogoUpdate}
        onStoreValueChange={handleStoreValueChange}
        storeId={storeData?.id}
      />
      
      <ContactInfoForm 
        contactValues={contactValues}
        onContactValueChange={handleContactValueChange}
      />
      
      <CurrencyLanguageForm 
        currencyLanguageValues={currencyLanguageValues}
      />
      
      <SaveButton onClick={handleSaveGeneralSettings} isSaving={isSaving} />
    </div>
  );
};

export default GeneralSettings;
