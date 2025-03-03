
import React from "react";
import { Loader2 } from "lucide-react";

interface EnhancedLoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullPage?: boolean;
}

const EnhancedLoadingState: React.FC<EnhancedLoadingStateProps> = ({ 
  message = "جاري التحميل...", 
  size = "medium",
  fullPage = false
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };
  
  const containerClasses = fullPage 
    ? "min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-gray-50" 
    : "w-full py-12 flex justify-center";
  
  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative mx-auto mb-3">
          <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
          <Loader2 className={`${sizeClasses[size]} absolute inset-0 text-primary-400 animate-pulse opacity-75`} />
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default EnhancedLoadingState;
