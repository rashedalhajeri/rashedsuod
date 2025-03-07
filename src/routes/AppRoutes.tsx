
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoutes } from './ProtectedRoutes';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/dashboard/Home';
import Products from '@/pages/dashboard/Products';
import ProductDetail from '@/pages/ProductDetail';
import Categories from '@/pages/dashboard/Categories';
import Orders from '@/pages/dashboard/Orders';
import Customers from '@/pages/dashboard/Customers';
import Settings from '@/pages/dashboard/Settings';
import Payments from '@/pages/dashboard/Payments';
import Coupons from '@/pages/dashboard/Coupons';
import NotFound from '@/pages/NotFound';
import CreateStore from '@/pages/CreateStore';
import Store from '@/pages/Store';
import StoreLogin from '@/pages/store/StoreLogin';
import StoreRegister from '@/pages/store/StoreRegister';
import StoreForgotPassword from '@/pages/store/StoreForgotPassword';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/create-store" element={<CreateStore />} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Product CRUD Routes */}
      <Route path="/products/:productId" element={<ProtectedRoutes><ProductDetail /></ProtectedRoutes>} />
      <Route path="/products/new" element={<ProtectedRoutes><ProductDetail /></ProtectedRoutes>} />
      
      {/* Store Front Routes */}
      <Route path="/store/:storeDomain" element={<Store />} />
      <Route path="/store/:storeDomain/login" element={<StoreLogin />} />
      <Route path="/store/:storeDomain/register" element={<StoreRegister />} />
      <Route path="/store/:storeDomain/forgot-password" element={<StoreForgotPassword />} />
      <Route path="/store/:storeDomain/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/store/:storeDomain/product/:productSlug" element={<ProductPage />} />
      <Route path="/store/:storeDomain/cart" element={<CartPage />} />
      <Route path="/store/:storeDomain/checkout" element={<CheckoutPage />} />
      <Route path="/store/:storeDomain/order-success" element={<OrderSuccessPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
