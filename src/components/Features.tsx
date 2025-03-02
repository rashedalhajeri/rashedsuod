
import React from "react";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag, Truck, Settings } from "lucide-react";

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="card-premium hover-scale"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="h-16 w-16 mb-6 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
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
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "أدوات التسويق",
      description: "أدوات تساعدك على استهداف عملائك و التفاعل معهم",
      delay: 0.1,
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "إدارة العمليات",
      description: "شاشة تحكم متكاملة لإدارة تفاصيل عمليات متجرك",
      delay: 0.2,
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "إعدادات مرنة",
      description: "تحكم بإعدادات متجرك مثل الثيمات، المناطق و تفاصيل أخرى",
      delay: 0.3,
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "وفر التكاليف",
      description: "طلباتك بدون عمولة - وفر لغاية ٣٠٪ من تكاليف الطلب",
      delay: 0.4,
    },
  ];

  return (
    <section id="features" className="section bg-gray-50 rtl">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="heading-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            فوائد المتجر الإلكتروني
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            كل المميزات التي تحتاجها بمتجرك
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
