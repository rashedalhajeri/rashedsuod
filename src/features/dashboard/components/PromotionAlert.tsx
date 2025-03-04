
import React from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
      description: "قم بالترقية للحصول على خيارات شحن متقدمة مثل مناطق شحن مخصصة وتكامل مع شركات الشحن والتوصيل السريع",
    },
    general: {
      title: "أنت تستخدم الباقة المجانية",
      description: "قم بترقية متجرك إلى باقة مدفوعة للحصول على المزيد من المميزات والإمكانيات",
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3 shadow-sm"
    >
      <div className="bg-amber-200 rounded-full p-1.5 mt-0.5">
        <Sparkles className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-amber-800">
          {messages[section].title}
        </h4>
        <p className="text-sm text-amber-700 mt-1">
          {messages[section].description}
        </p>
        <div className="mt-2">
          <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none">
            <Link to="/dashboard/settings?tab=billing">ترقية الباقة</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionAlert;
