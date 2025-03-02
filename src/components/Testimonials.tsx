import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialsProps {}

const Testimonials: React.FC<TestimonialsProps> = () => {
  return (
    <section className="py-24 bg-gray-50 rtl">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ماذا يقول عملاؤنا</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نفتخر بخدمة آلاف العملاء الراضين الذين يثقون بنا لإدارة متاجرهم الإلكترونية
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 text-xl font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.position}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{testimonial.text}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    name: "أحمد محمد",
    position: "صاحب متجر للإلكترونيات",
    text: "ساعدتنا المنصة على زيادة مبيعاتنا بنسبة 40% خلال الشهر الأول فقط. الدعم الفني ممتاز والميزات سهلة الاستخدام."
  },
  {
    name: "سارة عبدالله",
    position: "مديرة متجر أزياء",
    text: "أفضل استثمار قمت به لمتجري. واجهة سهلة الاستخدام وتكامل ممتاز مع وسائل الدفع المحلية في الكويت."
  },
  {
    name: "محمد العلي",
    position: "صاحب مطعم",
    text: "تمكنا من إطلاق خدمة التوصيل الخاصة بنا في غضون أيام فقط. النظام سهل الاستخدام والعملاء يحبون تجربة الطلب."
  },
  {
    name: "نورة الفهد",
    position: "صاحبة متجر هدايا",
    text: "المنصة سهلت علينا إدارة المخزون وتتبع الطلبات. أصبح لدينا الآن وقت أكبر للتركيز على تطوير منتجاتنا."
  },
  {
    name: "عبدالله الخالد",
    position: "مدير تسويق",
    text: "الأدوات التسويقية المدمجة ساعدتنا على زيادة معدل التحويل وتحسين استراتيجيتنا التسويقية بشكل كبير."
  },
  {
    name: "فاطمة العنزي",
    position: "صاحبة متجر مستحضرات تجميل",
    text: "بفضل المنصة، تمكنت من تحويل هوايتي إلى مشروع تجاري ناجح. الدعم الفني متميز والميزات تلبي جميع احتياجاتي."
  }
];

export default Testimonials;
