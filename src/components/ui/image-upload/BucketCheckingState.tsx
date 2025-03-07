
import React from "react";

const BucketCheckingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-600">جاري التحقق من إمكانية رفع الصور...</p>
      <p className="text-xs text-gray-500">قد تستغرق هذه العملية بضع ثوان</p>
    </div>
  );
};

export default BucketCheckingState;
