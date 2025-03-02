
import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialsProps {}

const Testimonials: React.FC<TestimonialsProps> = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ماذا يقول عملاؤنا</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">آراء التجار الذين يستخدمون منصتنا في الكويت</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="flex-1 text-gray-700 leading-relaxed mb-4 text-right">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="mt-auto">
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [{
  name: "أحمد محمد",
  position: "صاحب متجر للإلكترونيات",
  text: "ساعدتنا المنصة على زيادة مبيعاتنا بنسبة 40% خلال الشهر الأول فقط. الدعم الفني ممتاز والميزات سهلة الاستخدام."
}, {
  name: "سارة عبدالله",
  position: "مديرة متجر أزياء",
  text: "أفضل استثمار قمت به لمتجري. واجهة سهلة الاستخدام وتكامل ممتاز مع وسائل الدفع المحلية في الكويت."
}, {
  name: "محمد العلي",
  position: "صاحب مطعم",
  text: "تمكنا من إطلاق خدمة التوصيل الخاصة بنا في غضون أيام فقط. النظام سهل الاستخدام والعملاء يحبون تجربة الطلب."
}, {
  name: "نورة الفهد",
  position: "صاحبة متجر هدايا",
  text: "المنصة سهلت علينا إدارة المخزون وتتبع الطلبات. أصبح لدينا الآن وقت أكبر للتركيز على تطوير منتجاتنا."
}, {
  name: "عبدالله الخالد",
  position: "مدير تسويق",
  text: "الأدوات التسويقية المدمجة ساعدتنا على زيادة معدل التحويل وتحسين استراتيجيتنا التسويقية بشكل كبير."
}, {
  name: "فاطمة العنزي",
  position: "صاحبة متجر مستحضرات تجميل",
  text: "بفضل المنصة، تمكنت من تحويل هوايتي إلى مشروع تجاري ناجح. الدعم الفني متميز والميزات تلبي جميع احتياجاتي."
}];

export default Testimonials;
