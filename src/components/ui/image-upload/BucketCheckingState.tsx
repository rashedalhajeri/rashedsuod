
import React from "react";

const BucketCheckingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mr-3 text-sm text-gray-600">جاري التحقق من إمكانية رفع الصور...</p>
    </div>
  );
};

export default BucketCheckingState;
