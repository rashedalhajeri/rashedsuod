
import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";

// Import dashboard components
import AppSidebar from "@/features/dashboard/components/AppSidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardFooter from "@/features/dashboard/components/DashboardFooter";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // استخدام React Query لجلب بيانات المتجر
  const { 
    data: storeData, 
    isLoading: isStoreLoading, 
    error: storeError,
    refetch: refetchStore
  } = useStoreData();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          navigate("/auth");
          return;
        }
        
        setSession(sessionData.session);
        await secureStore('user-id', sessionData.session.user.id);
      } catch (error: any) {
        console.error("Error fetching session:", error);
        toast.error("حدث خطأ أثناء التحقق من الجلسة");
        navigate("/auth");
      } finally {
        setIsAuthLoading(false);
      }
    };
    
    fetchSessionData();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT') {
        secureRemove('user-id');
        navigate("/auth");
      } else if (event === 'SIGNED_IN' && newSession) {
        await secureStore('user-id', newSession.user.id);
        // إعادة جلب بيانات المتجر عند تسجيل الدخول
        queryClient.invalidateQueries({ queryKey: ['storeData'] });
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

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

  if (isAuthLoading || isStoreLoading) {
    return <LoadingState message="جاري تحميل لوحة التحكم..." />;
  }

  if (storeError) {
    return (
      <ErrorState 
        title="خطأ في تحميل بيانات المتجر" 
        message="لم نتمكن من تحميل بيانات المتجر الخاص بك" 
        onRetry={() => refetchStore()}
      />
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
                  {children}
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
