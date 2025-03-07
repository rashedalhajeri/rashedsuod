
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "حدث خطأ", 
  message = "لم نتمكن من تحميل البيانات المطلوبة", 
  details,
  onRetry 
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-10">
      <div className="bg-red-50 text-red-500 p-3 rounded-full mb-4 shadow-sm">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-2 text-center max-w-md">{message}</p>
      {details && (
        <div className="text-sm text-gray-500 mb-4 max-w-md text-center p-3 bg-gray-50 rounded-md border border-gray-100">
          {details}
        </div>
      )}
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="mt-3 shadow-sm gap-2 bg-black hover:bg-gray-800 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
