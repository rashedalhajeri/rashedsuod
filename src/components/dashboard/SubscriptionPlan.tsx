
import React from "react";
import { Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionPlanProps {
  currentPlan: string;
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ currentPlan }) => {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border border-primary-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center",
            currentPlan === "premium" 
              ? "bg-gradient-to-br from-yellow-300 to-yellow-500" 
              : "bg-gradient-to-br from-gray-300 to-gray-400"
          )}>
            <Crown className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">
            الباقة الحالية: {currentPlan === "premium" ? "المميزة" : "المجانية"}
          </span>
        </div>
        
        {currentPlan === "premium" && (
          <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full border border-green-200">
            مفعلة
          </span>
        )}
      </div>
      
      {currentPlan === "premium" ? (
        <div className="mb-2">
          <p className="text-xs text-gray-600">تستمتع حالياً بجميع المميزات المتاحة في متجرك!</p>
        </div>
      ) : (
        <div className="mb-2">
          <p className="text-xs text-gray-600">قم بترقية متجرك للحصول على ميزات إضافية!</p>
        </div>
      )}
      
      <button className={cn(
        "w-full text-xs py-1.5 rounded border transition-colors flex items-center justify-center gap-1.5",
        currentPlan === "premium"
          ? "bg-white text-gray-600 hover:text-gray-700 border-gray-200"
          : "bg-white text-primary-600 hover:text-primary-700 border-primary-100 hover:bg-primary-50"
      )}>
        {currentPlan === "premium" ? (
          <>
            <span>تفاصيل الاشتراك</span>
          </>
        ) : (
          <>
            <Zap className="h-3.5 w-3.5" />
            <span>ترقية للباقة المميزة</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubscriptionPlan;
