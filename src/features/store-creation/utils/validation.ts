
import { toast } from "sonner";
import { StoreFormData } from "../types";

/**
 * Validates the current step of the store creation form
 */
export const validateStep = (step: number, formData: StoreFormData, domainAvailable: boolean | null): boolean => {
  if (step === 1) {
    if (!formData.storeName) {
      toast.error("الرجاء إدخال اسم المتجر");
      return false;
    }
    if (!formData.domainName) {
      toast.error("الرجاء إدخال اسم النطاق");
      return false;
    }
    if (domainAvailable !== true) {
      toast.error("اسم النطاق غير متاح أو لم يتم التحقق منه");
      return false;
    }
    if (!formData.phoneNumber) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return false;
    }
  } else if (step === 2) {
    if (!formData.country) {
      toast.error("الرجاء اختيار الدولة");
      return false;
    }
    if (!formData.currency) {
      toast.error("الرجاء اختيار العملة");
      return false;
    }
  } else if (step === 3) {
    if (!formData.acceptTerms) {
      toast.error("الرجاء الموافقة على شروط الخدمة");
      return false;
    }
  }
  return true;
};
