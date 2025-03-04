
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PromotionAlertProps {
  type: "free" | "basic" | "premium";
  section?: "payment" | "shipping" | "general";
}

const PromotionAlert: React.FC<PromotionAlertProps> = ({ type, section = "general" }) => {
  // Only show promotion for free plan users
  if (type !== "free") return null;
  
  const messages = {
    payment: {
      title: "أنت تستخدم الباقة المجانية",
      description: "قم بترقية متجرك إلى باقة مدفوعة للحصول على المزيد من المميزات مثل بوابات الدفع الإلكتروني",
    },
    shipping: {
      title: "ترقية لخيارات شحن متقدمة",
      description: "قم بالترقية للحصول على خيارات شحن متقدمة مثل مناطق شحن مخصصة وتكامل مع شركات الشحن",
    },
    general: {
      title: "أنت تستخدم الباقة المجانية",
      description: "قم بترقية متجرك إلى باقة مدفوعة للحصول على المزيد من المميزات والإمكانيات",
    }
  };
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-amber-800">
          {messages[section].title}
        </h4>
        <p className="text-sm text-amber-700 mt-1">
          {messages[section].description}
        </p>
        <div className="mt-2">
          <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
            <Link to="/dashboard/settings?tab=billing">ترقية الباقة</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionAlert;
