
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "حدث خطأ", 
  message = "لم نتمكن من تحميل البيانات المطلوبة", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="text-red-500 mb-4">
        <AlertTriangle size={48} className="mx-auto" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
