
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PricingPlans from "@/components/PricingPlans";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Shield, CheckCircle, Gift, ChevronUp } from "lucide-react";

const Index: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

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

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (event === "SIGNED_IN") {
          toast.success("تم تسجيل الدخول بنجاح");
        } else if (event === "SIGNED_OUT") {
          toast.info("تم تسجيل الخروج بنجاح");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  // Function to navigate to dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };
  
  // Function to navigate to auth
  const navigateToAuth = () => {
    navigate("/auth");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-white overflow-hidden">
        <Header session={session} onLogout={handleLogout} />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <Hero />
          
          {/* Clients/trusted by */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-8">
                <p className="text-gray-500 font-medium">يثق بنا أكثر من +١٠٠٠ تاجر في الكويت</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                <img src="https://flowbite.com/docs/images/logo.svg" alt="Client 1" className="h-8" />
                <img src="https://daisyui.com/logos/daisyUI.svg" alt="Client 2" className="h-8" />
                <img src="https://flowbite.com/docs/images/logo.svg" alt="Client 3" className="h-8" />
                <img src="https://daisyui.com/logos/daisyUI.svg" alt="Client 4" className="h-8" />
                <img src="https://flowbite.com/docs/images/logo.svg" alt="Client 5" className="h-8" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <Features />
          
          {/* Why Choose Us Section */}
          <section className="section bg-white rtl">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <motion.div 
                  className="lg:w-1/2"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4 font-medium text-sm">
                    لماذا تختار Linok.me؟
                  </div>
                  <h2 className="heading-lg text-gray-900 mb-6">احصل على متجر متكامل يناسب احتياجاتك</h2>
                  <p className="paragraph mb-8">
                    نقدم حلاً متكاملاً يشمل كل ما تحتاجه لإطلاق متجرك الإلكتروني وإدارته بكفاءة. سواء كنت تبدأ مشروعك الأول أو تنقل متجرك الحالي، فنحن هنا لمساعدتك على النجاح في عالم التجارة الإلكترونية.
                  </p>
                  
                  <ul className="space-y-4">
                    {[
                      { icon: <Shield className="h-5 w-5 text-primary" />, text: "حماية كاملة للبيانات والمدفوعات" },
                      { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "واجهة سهلة الاستخدام لإدارة متجرك" },
                      { icon: <Gift className="h-5 w-5 text-primary" />, text: "تكلفة منخفضة وعوائد أعلى من المنافسين" },
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          {item.icon}
                        </div>
                        <span className="text-gray-700">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="lg:w-1/2"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl transform -rotate-3 scale-105 -z-10"></div>
                    <img 
                      src="/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg" 
                      alt="Linok Store" 
                      className="w-full h-auto rounded-2xl shadow-lg"
                    />
                    
                    <div className="absolute -bottom-5 -left-5 bg-white py-3 px-5 rounded-lg shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((_, i) => (
                            <div key={i} className={`w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-white`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">+1000 عميل</p>
                          <div className="flex text-yellow-400 text-xs">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                            <span className="text-gray-600 mr-1">5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Pricing Plans */}
          <PricingPlans />
          
          {/* Call to Action */}
          <section className="py-24 bg-gradient-to-br from-primary-500 to-primary-700 rtl">
            <div className="container mx-auto px-6 text-center">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {session ? "مرحباً بك في متجرك" : "جاهز لإطلاق متجرك الإلكتروني في الكويت؟"}
              </motion.h2>
              <motion.p 
                className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {session 
                  ? "إدارة متجرك أصبحت أسهل. انتقل إلى لوحة التحكم للبدء" 
                  : "انضم إلى آلاف التجار الناجحين وابدأ رحلتك في عالم التجارة الإلكترونية في السوق الكويتي اليوم"}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                {session ? (
                  <Button 
                    onClick={navigateToDashboard} 
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
                  >
                    لوحة التحكم
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={navigateToAuth}
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
                    >
                      <UserPlus className="ml-2 h-5 w-5" />
                      إنشاء متجر جديد
                    </Button>
                    <Button 
                      onClick={navigateToAuth}
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 font-semibold shadow-md"
                    >
                      <LogIn className="ml-2 h-5 w-5" />
                      تسجيل الدخول
                    </Button>
                  </>
                )}
                {session && (
                  <Button 
                    onClick={handleLogout}
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 font-semibold shadow-md"
                  >
                    تسجيل الخروج
                  </Button>
                )}
              </motion.div>
            </div>
          </section>
          
          {/* Footer */}
          <Footer />
          
          {/* Scroll to top button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-50 hover:bg-primary-600 transition-all"
              >
                <ChevronUp size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </AnimatePresence>
  );
};

export default Index;
