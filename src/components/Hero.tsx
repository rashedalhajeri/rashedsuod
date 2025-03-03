
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield, CheckCircle, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const heroFeatures = [
    { icon: <Store className="w-5 h-5" />, text: "إنشاء متجر احترافي في دقائق" },
    { icon: <Shield className="w-5 h-5" />, text: "حماية كاملة للمتجر والمدفوعات" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "بدون عمولات على المبيعات" },
  ];

  return (
    <section className="hero-pattern pt-32 pb-20 md:pb-32 rtl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              أطلق متجرك الإلكتروني في <span className="text-primary inline-block">الكويت</span> اليوم
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mr-0">
              منصة لينوك توفر لك كل ما تحتاجه لإطلاق متجرك الإلكتروني بسهولة وسرعة، مع دعم كامل لكل احتياجات التاجر الكويتي.
            </p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all bg-primary hover:bg-primary/90"
              >
                ابدأ الآن مجانًا
                <ChevronRight className="mr-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("#features")}
                className="text-lg border-gray-300"
              >
                اكتشف المميزات
              </Button>
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              {heroFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-white p-3 rounded-2xl shadow-xl">
                <img 
                  src="/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png" 
                  alt="Linok Store Dashboard" 
                  className="w-full h-auto rounded-xl shadow-sm"
                />
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">تأمين كامل</p>
                  <p className="text-xs text-gray-500">حماية البيانات والمدفوعات</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">+1000</p>
            <p className="text-gray-600 text-sm">متجر نشط</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">+25000</p>
            <p className="text-gray-600 text-sm">طلب شهريًا</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">99.9%</p>
            <p className="text-gray-600 text-sm">وقت تشغيل</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">24/7</p>
            <p className="text-gray-600 text-sm">دعم فني</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
