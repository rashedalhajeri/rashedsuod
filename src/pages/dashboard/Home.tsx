
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import SalesChart from "@/features/dashboard/components/SalesChart";
import DashboardStatsSection from "@/features/dashboard/components/DashboardStatsSection";
import SubscriptionAlert from "@/features/dashboard/components/SubscriptionAlert";
import QuickActionButtons from "@/features/dashboard/components/QuickActionButtons";
import ActivitySummarySection from "@/features/dashboard/components/ActivitySummarySection";

// Import mock data
import { 
  mockSalesData, 
  mockRecentOrders, 
  mockRecentProducts,
  statsData
} from "@/features/dashboard/data/mockDashboardData";

// Dashboard Home Page
const DashboardHome: React.FC = () => {
  // Fetch store data using the custom hook
  const { data: storeData, isLoading, error } = useStoreData();
  
  // Fetch user name
  const [userName, setUserName] = React.useState<string>("المدير");
  
  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await secureRetrieve('user-id');
        if (userId) {
          const { data, error } = await supabase.auth.getUser();
          if (data && data.user) {
            setUserName(data.user.user_metadata?.full_name || data.user.email || "المدير");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchUserName();
  }, []);
  
  if (isLoading) {
    return <LoadingState message="جاري تحميل البيانات..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="حدث خطأ"
        message="لم نتمكن من تحميل بيانات لوحة التحكم"
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // Format currency based on store settings
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
  // Subscription plan status
  const subscriptionStatus = "basic"; // Default value since property doesn't exist in type
  const isBasicPlan = subscriptionStatus === "basic";
  
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.store_name || "متجرك"} 
        ownerName={userName}
        newOrdersCount={7}
        lowStockCount={5}
      />
      
      {/* Subscription Alert for Basic Plan */}
      <SubscriptionAlert isBasicPlan={isBasicPlan} />
      
      {/* Stats Cards */}
      <DashboardStatsSection stats={statsData} formatCurrency={formatCurrency} />
      
      {/* Sales Chart */}
      <SalesChart 
        data={mockSalesData}
        currency={storeData?.currency || "SAR"}
      />
      
      {/* Quick Actions */}
      <QuickActionButtons />
      
      {/* Activity Summary Section */}
      <ActivitySummarySection
        orders={mockRecentOrders}
        products={mockRecentProducts}
        currency={storeData?.currency || "SAR"}
      />
    </DashboardLayout>
  );
};

export default DashboardHome;
