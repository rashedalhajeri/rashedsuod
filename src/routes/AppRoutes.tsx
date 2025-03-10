
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, CreateStoreRoute } from "./ProtectedRoutes";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateStore from "@/pages/CreateStore";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import CategoryPage from "@/pages/CategoryPage";

// Import store auth pages
import StoreLogin from "@/pages/store/StoreLogin";
import StoreRegister from "@/pages/store/StoreRegister";
import StoreForgotPassword from "@/pages/store/StoreForgotPassword";

// Import dashboard pages
import DashboardHome from "@/pages/dashboard/Home";
import Products from "@/pages/dashboard/Products";
import Orders from "@/pages/dashboard/Orders";
import Categories from "@/pages/dashboard/Categories";
import Customers from "@/pages/dashboard/Customers";
import Payments from "@/pages/dashboard/Payments";
import Coupons from "@/pages/dashboard/Coupons";
import Settings from "@/pages/dashboard/Settings";
import MyStore from "@/pages/dashboard/MyStore";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<Auth />} />
      
      {/* Store routes with case insensitive domain parameter */}
      <Route path="/store/:storeDomain" element={<Store />} />
      <Route path="/store/:storeDomain/category/:categoryName" element={<CategoryPage />} />
      <Route path="/store/:storeDomain/product/:productId" element={<ProductPage />} />
      <Route path="/store/:storeDomain/cart" element={<CartPage />} />
      <Route path="/store/:storeDomain/checkout" element={<CheckoutPage />} />
      <Route path="/store/:storeDomain/order-success/:orderId" element={<OrderSuccessPage />} />
      
      <Route path="/store/:storeDomain/login" element={<StoreLogin />} />
      <Route path="/store/:storeDomain/register" element={<StoreRegister />} />
      <Route path="/store/:storeDomain/forgot-password" element={<StoreForgotPassword />} />
      
      {/* Dashboard routes */}
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
        path="/dashboard/my-store"
        element={
          <ProtectedRoute>
            <MyStore />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/products/:productId" 
        element={
          <ProtectedRoute>
            <ProductDetail storeId={null} />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
