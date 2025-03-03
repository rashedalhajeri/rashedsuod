
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: PlanFeature[];
  highlight?: boolean;
  popular?: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: 90,
      duration: "6 أشهر",
      description: "مناسبة لأصحاب المتاجر الجدد",
      features: [
        { text: "إضافة حتى 50 منتج", included: true },
        { text: "تكامل مع بوابة دفع واحدة", included: true },
        { text: "شركة شحن واحدة", included: true },
        { text: "دعم فني عبر البريد الإلكتروني", included: true },
        { text: "تحليلات أساسية للمبيعات", included: true },
        { text: "عدد غير محدود من الطلبات", included: false },
        { text: "خيارات تصميم متقدمة", included: false },
        { text: "دعم العملاء الفوري", included: false },
      ],
    },
    {
      id: "professional",
      name: "الباقة الاحترافية",
      price: 150,
      duration: "6 أشهر",
      description: "للمتاجر النامية والمحترفة",
      features: [
        { text: "عدد غير محدود من المنتجات", included: true },
        { text: "تكامل مع جميع بوابات الدفع", included: true },
        { text: "جميع شركات الشحن", included: true },
        { text: "دعم فني عبر الهاتف والبريد", included: true },
        { text: "تحليلات متقدمة للمبيعات", included: true },
        { text: "عدد غير محدود من الطلبات", included: true },
        { text: "خيارات تصميم متقدمة", included: true },
        { text: "دعم العملاء الفوري", included: true },
      ],
      highlight: true,
      popular: true,
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast.success("تم اختيار الباقة بنجاح");
  };

  return (
    <div className="rtl w-full mx-auto px-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر باقة اشتراكك</h2>
        <p className="text-gray-600">
          اختر الباقة المناسبة لاحتياجات متجرك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <Card className={cn(
              "h-full border rounded-xl overflow-hidden relative",
              plan.highlight ? "border-primary-300 shadow-md" : "border-gray-200"
            )}>
              {plan.popular && (
                <span className="absolute top-6 left-6">
                  <Badge className="bg-primary-500 hover:bg-primary-600">الأكثر شيوعاً</Badge>
                </span>
              )}
              
              <CardHeader className={cn(
                "pb-8",
                plan.highlight ? "bg-primary-50" : "bg-gray-50"
              )}>
                <CardTitle className="text-xl mb-1">{plan.name}</CardTitle>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 pb-1">د.ك</span>
                  <span className="text-gray-500 pb-1"> / {plan.duration}</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <span className="text-green-500 mt-0.5">
                          <Check size={18} />
                        </span>
                      ) : (
                        <span className="text-gray-300 mt-0.5">
                          <AlertCircle size={18} />
                        </span>
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={cn(
                    "w-full",
                    plan.highlight 
                      ? "bg-primary-500 hover:bg-primary-600" 
                      : "bg-gray-800 hover:bg-gray-900"
                  )}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  اختر هذه الباقة
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
