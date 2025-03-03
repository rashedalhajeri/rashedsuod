
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto" />
        <p className="mt-4 text-lg text-gray-600">جاري تحميل البيانات...</p>
      </div>
    </div>
  );
};

export default LoadingState;
