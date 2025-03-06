
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, CreateStoreRoute } from "./ProtectedRoutes";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateStore from "@/pages/CreateStore";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";

// Import dashboard pages
import DashboardHome from "@/pages/dashboard/Home";
import Products from "@/pages/dashboard/Products";
import Orders from "@/pages/dashboard/Orders";
import Categories from "@/pages/dashboard/Categories";
import Customers from "@/pages/dashboard/Customers";
import Payments from "@/pages/dashboard/Payments";
import Coupons from "@/pages/dashboard/Coupons";
import Settings from "@/pages/dashboard/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<Auth />} />
      
      <Route 
        path="/create-store" 
        element={
          <CreateStoreRoute>
            <CreateStore />
          </CreateStoreRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/coupons"
        element={
          <ProtectedRoute>
            <Coupons />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/products/:productId" 
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
