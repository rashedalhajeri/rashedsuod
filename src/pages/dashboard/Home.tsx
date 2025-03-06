
import React from "react";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingState from "@/components/ui/loading-state";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import SalesChart from "@/features/dashboard/components/SalesChart";
import DashboardStatsSection from "@/features/dashboard/components/DashboardStatsSection";
import SubscriptionAlert from "@/features/dashboard/components/SubscriptionAlert";
import QuickActionButtons from "@/features/dashboard/components/QuickActionButtons";
import ActivitySummarySection from "@/features/dashboard/components/ActivitySummarySection";
import DashboardErrorHandler from "@/features/dashboard/components/DashboardErrorHandler";

// Import data fetching hook
import useDashboardData from "@/features/dashboard/hooks/useDashboardData";

// Dashboard Home Page
const DashboardHome: React.FC = () => {
  // Use the custom hook to get all dashboard data
  const {
    storeData,
    userName,
    statsData,
    salesData,
    ordersData,
    productsData,
    isLoading,
    storeError,
    statsError,
    salesError,
    ordersError,
    productsError
  } = useDashboardData();
  
  // Handle errors
  const hasErrors = storeError || statsError || salesError || ordersError || productsError;
  if (hasErrors) {
    return (
      <DashboardErrorHandler
        storeError={storeError}
        statsError={statsError}
        salesError={salesError}
        ordersError={ordersError}
        productsError={productsError}
      />
    );
  }
  
  if (isLoading && (!storeData || !statsData)) {
    return <LoadingState message="جاري تحميل البيانات..." />;
  }
  
  // Format currency based on store settings
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  // Subscription plan status
  const subscriptionStatus = storeData?.subscription_plan || "free";
  const isBasicPlan = subscriptionStatus === "basic";
  
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.store_name || "متجرك"} 
        ownerName={userName}
        newOrdersCount={statsData?.orders || 0}
        lowStockCount={0} // We'll implement this later
      />
      
      {/* Subscription Alert for Basic Plan */}
      <SubscriptionAlert isBasicPlan={isBasicPlan} />
      
      {/* Stats Cards */}
      <DashboardStatsSection stats={statsData || {
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0
      }} formatCurrency={formatCurrency} />
      
      {/* Sales Chart */}
      <SalesChart 
        data={salesData || []}
        currency="د.ك"
      />
      
      {/* Quick Actions */}
      <QuickActionButtons />
      
      {/* Activity Summary Section */}
      <ActivitySummarySection
        orders={ordersData?.orders || []}
        products={productsData || []}
        currency="KWD"
      />
    </DashboardLayout>
  );
};

export default DashboardHome;
