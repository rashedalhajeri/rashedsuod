import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
const Hero: React.FC = () => {
  const [isRTL, setIsRTL] = useState(true); // true for Arabic direction

  // This would be connected to your actual language state in a real app
  useEffect(() => {
    // Example to detect language and set direction
    const html = document.querySelector('html');
    setIsRTL(html?.dir === 'rtl' || true); // Default to RTL for this demo
  }, []);
  return <section className={`min-h-screen flex items-center pt-20 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="/lovable-uploads/ecommerce-video-bg.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img src="/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png" alt="E-commerce background" className="w-full h-full object-cover" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-opacity-50 z-10 bg-slate-50"></div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 relative z-20">
        <div className={`flex flex-col justify-center ${isRTL ? 'order-1 lg:order-1' : 'order-1 lg:order-0'}`}>
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }} className="md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-950 text-3xl">
            متجر إلكتروني في كل 
            <br />
            <span className="text-primary-500">إحتياجاتك</span> لزيادة مبيعاتك
          </motion.h1>
          
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} className="text-xl mb-8 text-slate-950">
            متجر متكامل لطلبات الاستلام و التوصيل، بدون عمولة على الطلبات
          </motion.p>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.4
        }} className="flex flex-wrap gap-4 mb-8 bg-black/0">
            <a href="#start" className="btn-primary">
              ابدأ الآن
            </a>
            <a href="#learn-more" className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
              shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">شاهد المزيد..</a>
          </motion.div>
          
          <motion.div className="flex flex-wrap items-center gap-6" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.7,
          delay: 0.6
        }}>
            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {[1, 2, 3, 4].map(index => <div key={index} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" style={{
              zIndex: 5 - index
            }} />)}
            </div>
            <p className="text-white">
              أكثر من <span className="font-bold text-primary-500">5000+</span> عميل راضٍ
            </p>
          </motion.div>
        </div>
        
        <div className={`flex justify-center items-center relative z-20 ${isRTL ? 'order-0 lg:order-0' : 'order-0 lg:order-1'}`}>
          <motion.div className="relative w-full max-w-md" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7
        }}>
            <motion.div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-primary-500/30 rounded-3xl blur-3xl" animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }} />
            
            <motion.img src="/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png" alt="Linok.me Mobile Store Preview" className="w-full h-auto rounded-3xl shadow-2xl relative z-10" initial={{
            y: 20
          }} animate={{
            y: [0, -10, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }} />
            
            <motion.div className="absolute -bottom-5 -right-5 w-24 h-24 bg-primary-500 rounded-2xl z-0" animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }} />
            
            <motion.div className="absolute -top-3 -left-3 w-16 h-16 bg-white/80 backdrop-blur-md rounded-xl shadow-xl z-20" animate={{
            rotate: [0, -10, 0],
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}>
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-primary-500 font-bold text-xl">Linok</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;