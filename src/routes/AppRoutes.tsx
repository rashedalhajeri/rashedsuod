
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateStore from "@/pages/CreateStore";
import NotFound from "@/pages/NotFound";
import DashboardHome from "@/pages/dashboard/Home";
import Orders from "@/pages/dashboard/Orders";
import Products from "@/pages/dashboard/Products";
import Categories from "@/pages/dashboard/Categories";
import Customers from "@/pages/dashboard/Customers";
import Payments from "@/pages/dashboard/Payments";
import Coupons from "@/pages/dashboard/Coupons";
import Settings from "@/pages/dashboard/Settings";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStoresPage from "@/pages/admin/Stores";
import ActivityLogsPage from "@/pages/admin/ActivityLogs";
import ProtectedRoute from "@/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/not-found" element={<NotFound />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute redirectTo="/auth">
            <DashboardHome />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/orders" element={
          <ProtectedRoute redirectTo="/auth">
            <Orders />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/products" element={
          <ProtectedRoute redirectTo="/auth">
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/categories" element={
          <ProtectedRoute redirectTo="/auth">
            <Categories />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/customers" element={
          <ProtectedRoute redirectTo="/auth">
            <Customers />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/payments" element={
          <ProtectedRoute redirectTo="/auth">
            <Payments />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/coupons" element={
          <ProtectedRoute redirectTo="/auth">
            <Coupons />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/settings" element={
          <ProtectedRoute redirectTo="/auth">
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="stores" element={<AdminStoresPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
