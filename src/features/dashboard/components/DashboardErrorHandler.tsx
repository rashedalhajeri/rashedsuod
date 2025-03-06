
import React from "react";
import ErrorState from "@/components/ui/error-state";

interface DashboardErrorHandlerProps {
  storeError: unknown;
  statsError?: unknown;
  salesError?: unknown;
  ordersError?: unknown;
  productsError?: unknown;
}

const DashboardErrorHandler: React.FC<DashboardErrorHandlerProps> = ({
  storeError,
  statsError,
  salesError,
  ordersError,
  productsError
}) => {
  // Handling store errors specifically
  if (storeError) {
    let errorDetails = "تفاصيل الخطأ غير متوفرة";
    
    try {
      if (typeof storeError === 'object' && storeError !== null) {
        // Try to extract a meaningful error message
        const errorObj = storeError as any;
        errorDetails = errorObj.message || 
                      (errorObj.error && errorObj.error.message) || 
                      JSON.stringify(storeError);
                      
        // For common Supabase errors about multiple rows
        if (errorDetails.includes("multiple (or no) rows returned")) {
          errorDetails = "هناك أكثر من متجر مرتبط بحسابك. يرجى الاتصال بالدعم الفني.";
        }
      }
    } catch (e) {
      console.error("Error parsing error object:", e);
    }
    
    return (
      <ErrorState 
        title="تعذر تحميل بيانات المتجر"
        message="لم نتمكن من تحميل بيانات لوحة التحكم"
        details={errorDetails}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // Handle other errors
  if (statsError || salesError || ordersError || productsError) {
    const activeError = statsError || salesError || ordersError || productsError;
    let errorMessage = "لم نتمكن من تحميل بعض البيانات. يرجى المحاولة مرة أخرى.";
    
    return (
      <ErrorState 
        title="حدث خطأ"
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // No errors to handle
  return null;
};

export default DashboardErrorHandler;
