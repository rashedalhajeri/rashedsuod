
import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Import dashboard components
import AppSidebar from "@/features/dashboard/components/AppSidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardFooter from "@/features/dashboard/components/DashboardFooter";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSessionAndStore = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          navigate("/auth");
          return;
        }
        
        setSession(sessionData.session);
        await secureStore('user-id', sessionData.session.user.id);
        
        // Fetch store data
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();
          
        if (storeError) throw storeError;
        setStoreData(store);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionAndStore();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT') {
        secureRemove('user-id');
        navigate("/auth");
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
      await supabase.auth.signOut();
      secureRemove('user-id');
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 rtl">
      <SidebarProvider defaultExpanded={isDesktop}>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AppSidebar 
            storeData={storeData} 
            onLogout={handleLogout}
          />
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-auto">
            <DashboardHeader 
              storeName={storeData?.store_name} 
              domainName={storeData?.domain_name}
            />
            
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-w-7xl mx-auto"
                >
                  {children || <Outlet />}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <DashboardFooter />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
