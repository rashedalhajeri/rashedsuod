
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

const Index: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
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
    // This would navigate to a dashboard page (to be implemented)
    toast.info("سيتم التوجيه إلى لوحة التحكم");
    // Implement dashboard navigation when the dashboard page is created
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
              >
                {session ? (
                  <button 
                    onClick={navigateToDashboard} 
                    className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg
                    shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px]
                    inline-block mr-4"
                  >
                    لوحة التحكم
                  </button>
                ) : (
                  <a 
                    href="#start" 
                    id="start"
                    className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg
                    shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px]
                    inline-block"
                  >
                    ابدأ الآن مجانًا
                  </a>
                )}
                {session && (
                  <button 
                    onClick={handleLogout}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg
                    shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]
                    inline-block"
                  >
                    تسجيل الخروج
                  </button>
                )}
              </motion.div>
            </div>
          </section>
          
          {/* Pricing Plans */}
          <PricingPlans />
          
          {/* Footer */}
          <Footer />
        </motion.main>
      </div>
    </AnimatePresence>
  );
};

export default Index;
