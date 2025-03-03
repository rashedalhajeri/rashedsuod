
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PricingPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "أساسي",
      description: "للمتاجر الصغيرة ورواد الأعمال",
      monthlyPrice: 9.9,
      yearlyPrice: 99,
      features: [
        "متجر إلكتروني كامل",
        "تصميم مخصص",
        "20 منتج",
        "إدارة الطلبات",
        "تطبيق موبايل للإدارة",
        "دعم فني بالبريد الإلكتروني",
      ],
      cta: "ابدأ الآن",
      popular: false,
      color: "bg-white",
      border: "border-gray-200",
    },
    {
      name: "احترافي",
      description: "للمتاجر المتوسطة والمتنامية",
      monthlyPrice: 29.9,
      yearlyPrice: 299,
      features: [
        "كل مميزات الخطة الأساسية",
        "غير محدود المنتجات",
        "تكامل مع وسائل التواصل",
        "تقارير متقدمة",
        "رمز QR للمتجر",
        "دعم فني على الواتساب",
        "متجر معزز بالذكاء الاصطناعي",
      ],
      cta: "ابدأ الآن",
      popular: true,
      color: "bg-primary-50",
      border: "border-primary-200",
    },
    {
      name: "متقدم",
      description: "للمتاجر الكبيرة والشركات",
      monthlyPrice: 59.9,
      yearlyPrice: 599,
      features: [
        "كل مميزات الخطة الاحترافية",
        "تكامل مع أنظمة المحاسبة",
        "تحليلات متقدمة للمبيعات",
        "مدير حساب مخصص",
        "متجر متعدد اللغات",
        "دعم فني على مدار الساعة",
        "تكامل API مخصص",
      ],
      cta: "تواصل معنا",
      popular: false,
      color: "bg-white",
      border: "border-gray-200",
    },
  ];

  return (
    <section id="pricing" className="section bg-white rtl">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4 font-medium text-sm"
          >
            خطط الأسعار
          </motion.div>
          
          <motion.h2 
            className="heading-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            اختر الخطة المناسبة لمتجرك
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            خطط مرنة تناسب مختلف أحجام المتاجر، مع ميزة الترقية في أي وقت
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center mb-12"
          >
            <span className={`text-lg ${!isYearly ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>شهري</span>
            <label className="inline-flex items-center mx-4 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
                <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${isYearly ? 'transform translate-x-7' : ''}`}></div>
              </div>
            </label>
            <span className={`text-lg ${isYearly ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              سنوي
              <span className="mr-2 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                خصم 20%
              </span>
            </span>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              className={`${plan.color} ${plan.border} border rounded-2xl overflow-hidden relative hover-scale ${
                plan.popular ? 'shadow-lg ring-2 ring-primary' : 'shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  الأكثر شيوعًا
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="flex items-end mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 mr-2 mb-1">
                    د.ك /{isYearly ? ' سنويًا' : ' شهريًا'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => navigate("/auth")}
                  className={`w-full mb-8 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
                
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-0.5 mt-1 ml-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                      
                      {idx === plan.features.length - 1 && plan.name === "احترافي" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="mr-1 cursor-help">
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-white p-3 shadow-lg rounded-lg border max-w-xs z-50">
                              <p className="text-sm">
                                استفد من قوة الذكاء الاصطناعي في توليد وصف المنتجات وتحسين محركات البحث تلقائيًا
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            تحتاج إلى خطة مخصصة؟{" "}
            <a href="#contact" className="text-primary hover:underline font-medium">
              تواصل معنا
            </a>{" "}
            للحصول على عرض خاص يناسب احتياجات عملك
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPlans;
