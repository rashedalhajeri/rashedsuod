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
  const testimonials: Testimonial[] = [{
    id: 1,
    name: "محمد العلي",
    role: "صاحب متجر للأزياء",
    content: "بفضل Linok.me تمكنت من إطلاق متجري الإلكتروني خلال يومين فقط. الواجهة سهلة الاستخدام والدعم الفني ممتاز وسريع الاستجابة.",
    rating: 5
  }, {
    id: 2,
    name: "سارة الأحمد",
    role: "مالكة مشروع للعطور",
    content: "أحببت كثيراً سهولة الإعداد وتنوع خيارات التصميم. كان بإمكاني تخصيص كل شيء ليناسب هوية علامتي التجارية.",
    rating: 5
  }, {
    id: 3,
    name: "خالد المنصور",
    role: "مدير تنفيذي لعلامة تجارية",
    content: "التكامل مع وسائل الدفع وشركات الشحن كان سلسًا للغاية. ساعدنا على توسيع نطاق أعمالنا بسرعة كبيرة.",
    rating: 4
  }];
  return;
};
export default Testimonials;