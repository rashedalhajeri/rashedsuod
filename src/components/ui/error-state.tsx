
import React from "react";
import { AlertCircle } from "lucide-react";

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
        <AlertCircle className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorState;
