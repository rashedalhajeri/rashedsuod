
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PricingPlans from "@/components/PricingPlans";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  // Set the document direction to RTL for Arabic language support
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      // Cleanup if needed
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-white overflow-hidden">
        <Header />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <Hero />
          
          {/* Features Section */}
          <Features />
          
          {/* Call to Action */}
          <section className="py-24 bg-primary-500 rtl">
            <div className="container mx-auto px-6 text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                جاهز لإطلاق متجرك الإلكتروني في الكويت؟
              </motion.h2>
              <motion.p 
                className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                انضم إلى آلاف التجار الناجحين وابدأ رحلتك في عالم التجارة الإلكترونية في السوق الكويتي اليوم
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a 
                  href="#start" 
                  id="start"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg
                  shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px]
                  inline-block"
                >
                  ابدأ الآن مجانًا
                </a>
              </motion.div>
            </div>
          </section>
          
          {/* Pricing Plans */}
          <PricingPlans />
          
          {/* Testimonials */}
          <Testimonials />
          
          {/* Footer */}
          <Footer />
        </motion.main>
      </div>
    </AnimatePresence>
  );
};

export default Index;
