
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "محمد العلي",
      role: "صاحب متجر للأزياء",
      content: "بفضل Linok.me تمكنت من إطلاق متجري الإلكتروني خلال يومين فقط. الواجهة سهلة الاستخدام والدعم الفني ممتاز وسريع الاستجابة.",
      rating: 5,
    },
    {
      id: 2,
      name: "سارة الأحمد",
      role: "مالكة مشروع للعطور",
      content: "أحببت كثيراً سهولة الإعداد وتنوع خيارات التصميم. كان بإمكاني تخصيص كل شيء ليناسب هوية علامتي التجارية.",
      rating: 5,
    },
    {
      id: 3,
      name: "خالد المنصور",
      role: "مدير تنفيذي لعلامة تجارية",
      content: "التكامل مع وسائل الدفع وشركات الشحن كان سلسًا للغاية. ساعدنا على توسيع نطاق أعمالنا بسرعة كبيرة.",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="section bg-gray-50 rtl">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="heading-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            ماذا يقول عملاؤنا
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            نفخر بنجاح آلاف المتاجر على منصتنا
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="card-premium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="mr-3">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
