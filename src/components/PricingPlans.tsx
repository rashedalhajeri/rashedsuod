
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  highlight?: boolean;
}

const PricingPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans: PricingPlan[] = [
    {
      name: "المبتدئ",
      monthlyPrice: 49,
      yearlyPrice: 39,
      description: "مثالي للشركات الناشئة والأفراد",
      features: [
        { text: "مخزون حتى 50 منتج", included: true },
        { text: "تكامل مع بوابة دفع واحدة", included: true },
        { text: "شركة شحن واحدة", included: true },
        { text: "دعم فني بالبريد الإلكتروني", included: true },
        { text: "تصميم قالب واحد", included: true },
        { text: "عدد غير محدود من الطلبات", included: false },
        { text: "تكامل وسائل التواصل الاجتماعي", included: false },
      ],
    },
    {
      name: "الاحترافي",
      monthlyPrice: 99,
      yearlyPrice: 79,
      description: "للشركات المتوسطة والمتاجر المتنامية",
      features: [
        { text: "مخزون حتى 500 منتج", included: true },
        { text: "تكامل مع 3 بوابات دفع", included: true },
        { text: "5 شركات شحن", included: true },
        { text: "دعم فني متميز", included: true },
        { text: "تصاميم قوالب متعددة", included: true },
        { text: "عدد غير محدود من الطلبات", included: true },
        { text: "تكامل وسائل التواصل الاجتماعي", included: true },
      ],
      highlight: true,
    },
    {
      name: "المؤسسات",
      monthlyPrice: 199,
      yearlyPrice: 159,
      description: "للشركات الكبيرة والعلامات التجارية",
      features: [
        { text: "مخزون غير محدود للمنتجات", included: true },
        { text: "تكامل مع جميع بوابات الدفع", included: true },
        { text: "جميع شركات الشحن", included: true },
        { text: "دعم فني VIP", included: true },
        { text: "تصميم مخصص بالكامل", included: true },
        { text: "عدد غير محدود من الطلبات", included: true },
        { text: "تكامل وسائل التواصل الاجتماعي", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="section bg-white rtl">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="heading-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            خطط الأسعار المناسبة لك
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            اختر الخطة التي تناسب احتياجاتك
          </motion.p>
          
          <motion.div 
            className="flex justify-center items-center bg-gray-100 p-1 rounded-full w-fit mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              className={cn(
                "px-6 py-2 rounded-full transition-all duration-300",
                billingCycle === "monthly" ? "bg-white shadow-md" : "bg-transparent"
              )}
              onClick={() => setBillingCycle("monthly")}
            >
              شهري
            </button>
            <button
              className={cn(
                "px-6 py-2 rounded-full transition-all duration-300",
                billingCycle === "yearly" ? "bg-white shadow-md" : "bg-transparent"
              )}
              onClick={() => setBillingCycle("yearly")}
            >
              سنوي <span className="text-primary-500 text-sm">خصم 20%</span>
            </button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={cn(
                "card-premium overflow-hidden flex flex-col h-full",
                plan.highlight && "border-primary-500 shadow-2xl relative"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white py-2 text-center font-medium">
                  الأكثر شيوعاً
                </div>
              )}
              
              <div className={cn("p-8", plan.highlight && "pt-12")}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-600"> ر.س / {billingCycle === "monthly" ? "شهر" : "شهر (سنوياً)"}</span>
                </div>
                
                <a 
                  href="#start"
                  className={cn(
                    "block w-full py-3 rounded-lg text-center font-semibold transition-all",
                    plan.highlight 
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  ابدأ الآن
                </a>
              </div>
              
              <div className="border-t border-gray-100 p-8 flex-grow">
                <p className="font-medium text-gray-900 mb-4">المميزات المشمولة:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <span className="h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-600" />
                        </span>
                      ) : (
                        <span className="h-5 w-5 rounded-full bg-gray-100" />
                      )}
                      <span className={feature.included ? "text-gray-800" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
