
import React, { useEffect, useState } from "react";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { secureRetrieve } from "@/lib/encryption";
import { motion, AnimatePresence } from "framer-motion";

// Import component files
import LoadingState from "@/components/dashboard/LoadingState";
import CreateStorePrompt from "@/components/dashboard/CreateStorePrompt";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCards from "@/components/dashboard/StatCards";
import OverviewTab from "@/components/dashboard/OverviewTab";
import StoreInfoTab from "@/components/dashboard/StoreInfoTab";
import ActivityTab from "@/components/dashboard/ActivityTab";
import ErrorState from "@/components/dashboard/ErrorState";
import WelcomeWidget from "@/components/dashboard/WelcomeWidget";
import SalesOverviewChart from "@/components/dashboard/SalesOverviewChart";

// Add dependency for framer-motion
import { OrderStats } from "@/components/order/OrderStats";

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

interface DashboardStats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  revenue: number;
}

const mockSalesData = [
  { name: "يناير", amount: 1500 },
  { name: "فبراير", amount: 2500 },
  { name: "مارس", amount: 2000 },
  { name: "أبريل", amount: 3000 },
  { name: "مايو", amount: 2800 },
  { name: "يونيو", amount: 3200 },
  { name: "يوليو", amount: 3800 },
];

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    orderCount: 0,
    customerCount: 0,
    revenue: 1250.75 // قيمة افتراضية للإيرادات
  });
  const [showCreateStoreDialog, setShowCreateStoreDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  useEffect(() => {
    const fetchSessionAndStore = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        const userId = (await secureRetrieve('user-id')) || sessionData.session.user.id;
        
        const {
          data: storeData,
          error: storeError
        } = await getStoreData(userId);
        
        if (storeError) {
          console.error("Store error:", storeError);
          toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
          setError("لا يمكن تحميل بيانات المتجر، يرجى المحاولة مرة أخرى");
          setLoading(false);
          return;
        }
        
        if (!storeData) {
          setShowCreateStoreDialog(true);
          setLoading(false);
          return;
        }
        
        setStore(storeData);
        
        if (storeData) {
          // Load product count
          const {
            count: productCount,
            error: productCountError
          } = await supabase.from('products').select('*', {
            count: 'exact',
            head: true
          }).eq('store_id', storeData.id);
          
          if (productCountError) {
            console.error("Count error:", productCountError);
          } else {
            setStats(prev => ({
              ...prev,
              productCount: productCount || 0
            }));
          }
          
          // We would fetch other stats similarly
          // This is mock data for now
          setStats(prev => ({
            ...prev,
            orderCount: 15,
            customerCount: 8
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        setError("حدث خطأ أثناء تحميل البيانات، يرجى المحاولة مرة أخرى");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionAndStore();
  }, [navigate]);

  const handleCreateStore = () => {
    navigate('/create-store');
  };
  
  const retryLoading = () => {
    setLoading(true);
    setError(null);
    // Re-fetch data
    const fetchDataAgain = async () => {
      try {
        const {
          data: sessionData,
          error: sessionError
        } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        
        // Continue with the rest of the data fetching...
        // This is simplified for brevity
        setLoading(false);
      } catch (error) {
        console.error("Error retrying data fetch:", error);
        setError("استمرت المشكلة، يرجى المحاولة لاحقاً");
        setLoading(false);
      }
    };
    
    fetchDataAgain();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-KW', {
      style: 'currency',
      currency: store?.currency || 'KWD'
    }).format(amount);
  };

  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState message={error} retry={retryLoading} />;
  }

  if (showCreateStoreDialog) {
    return <CreateStorePrompt onCreateStore={handleCreateStore} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader storeName={store?.store_name} domain={store?.domain_name} />
      
      <WelcomeWidget storeName={store?.store_name} />
      
      <OrderStats 
        totalOrders={stats.orderCount}
        completedOrders={Math.floor(stats.orderCount * 0.6)}
        processingOrders={Math.floor(stats.orderCount * 0.3)}
        shippedOrders={Math.floor(stats.orderCount * 0.1)}
        cancelledOrders={0}
        totalRevenue={stats.revenue}
        currencySymbol={store?.currency === 'KWD' ? 'د.ك' : 'ر.س'}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 p-1 border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">نظرة عامة</TabsTrigger>
          <TabsTrigger value="store" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">معلومات المتجر</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">النشاط الأخير</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "store" && (
              <StoreInfoTab 
                store={store} 
                stats={{
                  productCount: stats.productCount,
                  orderCount: stats.orderCount,
                  customerCount: stats.customerCount
                }} 
              />
            )}
            {activeTab === "activity" && <ActivityTab />}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default Dashboard;
