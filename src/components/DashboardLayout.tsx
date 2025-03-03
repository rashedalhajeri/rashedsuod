import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

// Import component files
import MobileHeader from "./dashboard/MobileHeader";
import MobileNavBar from "./dashboard/MobileNavBar";
import SidebarNavigation from "./dashboard/SidebarNavigation";
import SidebarHeaderContent from "./dashboard/SidebarHeader";
import SubscriptionPlan from "./dashboard/SubscriptionPlan";
import ActionButton from "./dashboard/ActionButton";

interface DashboardLayoutProps {
  children?: ReactNode;
}

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setHasNotifications(Math.random() > 0.5);
    const fetchSessionAndStore = async () => {
      try {
        const {
          data: sessionData,
          error: sessionError
        } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        setSession(sessionData.session);
        await secureStore('user-id', sessionData.session.user.id);
        const {
          data: storeData,
          error: storeError
        } = await getStoreData(sessionData.session.user.id);
        if (storeError) {
          throw storeError;
        }
        setStore(storeData);
        setCurrentPlan(Math.random() > 0.7 ? "premium" : "free");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchSessionAndStore();
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT') {
        secureRemove('user-id');
        navigate("/");
      } else if (event === 'SIGNED_IN' && newSession) {
        await secureStore('user-id', newSession.user.id);
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      secureRemove('user-id');
      sessionStorage.removeItem('linok-encryption-key');
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    return <Outlet />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 rtl">
      <SidebarProvider defaultExpanded={!isMobile}>
        {isMobile && (
          <MobileHeader 
            storeName={store?.store_name} 
            hasNotifications={hasNotifications} 
          />
        )}

        <div className={cn("flex", isMobile ? "pt-16" : "")}>
          <Sidebar>
            <SidebarHeader>
              <SidebarHeaderContent 
                storeName={store?.store_name}
                domainName={store?.domain_name}
                hasNotifications={hasNotifications}
                onLogout={handleLogout}
              />
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarNavigation />
            </SidebarContent>
            
            <SidebarFooter>
              <SubscriptionPlan currentPlan={currentPlan} />
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-grow py-6 px-4 md:px-6 lg:px-8 transition-all duration-300">
            <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </SidebarProvider>
      
      {isMobile && <MobileNavBar />}
      <ActionButton />
    </div>
  );
};

export default DashboardLayout;
