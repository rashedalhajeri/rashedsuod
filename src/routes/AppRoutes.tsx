import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import Home from "@/pages/dashboard/Home";
import Products from "@/pages/dashboard/Products";
import Categories from "@/pages/dashboard/Categories";
import Orders from "@/pages/dashboard/Orders";
import Customers from "@/pages/dashboard/Customers";
import Payments from "@/pages/dashboard/Payments";
import Settings from "@/pages/dashboard/Settings";
import Coupons from "@/pages/dashboard/Coupons";
import Store from "@/pages/Store";
import ProductDetails from "@/pages/ProductDetails";
import CategoryProducts from "@/pages/CategoryProducts";
import Sections from "@/pages/dashboard/Sections";
import StorePreview from "@/pages/dashboard/StorePreview";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />
        
        {/* Store routes */}
        <Route path="/store/:storeDomain" element={<Store />} />
        <Route path="/store/:storeDomain/product/:productId" element={<ProductDetails />} />
        <Route path="/store/:storeDomain/category/:categoryName" element={<CategoryProducts />} />

        {/* Dashboard routes - accessible only when logged in */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="sections" element={<Sections />} />
          <Route path="store-preview/:storeId" element={<StorePreview />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
