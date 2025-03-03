
import React from "react";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag, Truck, Settings, BarChart2, Globe, Shield, Gift } from "lucide-react";

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, color }) => {
  return (
    <motion.div 
      className="card-premium hover-lift"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`h-16 w-16 mb-6 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="heading-md mb-3 text-gray-900">{title}</h3>
        <p className="paragraph">{description}</p>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      title: "أدوات تسويق متكاملة",
      description: "أدوات احترافية تساعدك على استهداف عملائك والتفاعل معهم بفعالية لزيادة المبيعات",
      delay: 0.1,
      color: "bg-primary/10"
    },
    {
      icon: <Settings className="h-8 w-8 text-indigo-500" />,
      title: "إدارة متطورة للمتجر",
      description: "لوحة تحكم شاملة لإدارة كافة تفاصيل عمليات متجرك بكفاءة وسهولة",
      delay: 0.2,
      color: "bg-indigo-100"
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      title: "تقارير وإحصائيات",
      description: "رؤية تحليلية شاملة لأداء متجرك مع إحصائيات مفصلة لاتخاذ القرارات الصحيحة",
      delay: 0.3,
      color: "bg-blue-100"
    },
    {
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      title: "تخصيص كامل",
      description: "تحكم بجميع تفاصيل متجرك من الثيمات والألوان إلى المناطق وطرق الدفع",
      delay: 0.4,
      color: "bg-amber-100"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-rose-500" />,
      title: "طرق دفع متعددة",
      description: "دعم لجميع وسائل الدفع الإلكتروني المعتمدة في الكويت لتسهيل عملية الشراء",
      delay: 0.5,
      color: "bg-rose-100"
    },
    {
      icon: <Truck className="h-8 w-8 text-emerald-500" />,
      title: "إدارة الشحن",
      description: "خيارات متعددة للشحن والتوصيل مع إمكانية تتبع الطلبات في الوقت الفعلي",
      delay: 0.6,
      color: "bg-emerald-100"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "حماية وأمان",
      description: "أنظمة حماية متطورة لتأمين بيانات متجرك وعملائك ومعاملاتك المالية",
      delay: 0.7,
      color: "bg-purple-100"
    },
    {
      icon: <Gift className="h-8 w-8 text-orange-500" />,
      title: "بدون عمولات",
      description: "وفر حتى ٣٠٪ من تكاليف المبيعات مع نظام بدون عمولات على الطلبات",
      delay: 0.8,
      color: "bg-orange-100"
    },
  ];

  return (
    <section id="features" className="section bg-gray-50 rtl">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4 font-medium text-sm"
          >
            لماذا اختيار Linok.me؟
          </motion.div>
          
          <motion.h2 
            className="heading-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            كل ما تحتاجه لإدارة متجرك الإلكتروني
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            مميزات متكاملة مصممة خصيصًا لاحتياجات السوق الكويتي
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
