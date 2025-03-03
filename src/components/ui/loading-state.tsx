
import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="flex justify-center items-center h-full py-12">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="mr-3 text-primary">{message}</span>
    </div>
  );
};

export default LoadingState;
