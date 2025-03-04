
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PromotionAlertProps {
  type: "basic" | "premium";
}

const PromotionAlert: React.FC<PromotionAlertProps> = ({ type }) => {
  const isBasicPlan = type === "basic";
  
  if (!isBasicPlan) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-medium text-amber-800">أنت تستخدم الباقة الأساسية</h4>
        <p className="text-sm text-amber-700 mt-1">
          قم بترقية متجرك إلى الباقة الاحترافية للحصول على المزيد من المميزات المتقدمة
        </p>
        <div className="mt-2">
          <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
            <Link to="/dashboard/settings">ترقية الباقة</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionAlert;
