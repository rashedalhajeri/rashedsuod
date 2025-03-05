
import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StoreHomePage from '@/features/store/StoreHomePage';
import ProductDetailPage from '@/features/store/ProductDetailPage';
import CartPage from '@/features/store/CartPage';
import { Loader2 } from 'lucide-react';

const StorefrontPreview = () => {
  const { storeId, storeDomain } = useParams<{ storeId?: string; storeDomain?: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [storeExists, setStoreExists] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    // Check if we are in the right context (store preview)
    const fetchStoreData = async () => {
      try {
        // Determine if we're using domain-based or id-based access
        const isDomainBased = !location.pathname.startsWith('/store/') && storeDomain;
        const storeIdentifier = isDomainBased ? storeDomain : storeId;
        
        if (!storeIdentifier) {
          setLoading(false);
          return;
        }
        
        let query = supabase.from('stores').select('*');
        
        // Query by domain_name or id depending on the route accessed
        if (isDomainBased) {
          query = query.eq('domain_name', storeIdentifier);
        } else {
          // Try first as domain name (backwards compatibility)
          query = query.eq('domain_name', storeIdentifier);
        }
        
        const { data, error } = await query.maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setStoreData(data);
          setStoreExists(true);
        } else if (!isDomainBased) {
          // If we didn't find by domain_name when using /store/:storeId, try by ID as fallback
          const { data: storeById, error: idError } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeIdentifier)
            .maybeSingle();
            
          if (idError) throw idError;
          
          if (storeById) {
            setStoreData(storeById);
            setStoreExists(true);
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, storeDomain, location.pathname]);

  // Set RTL direction for Arabic content
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    return () => {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!storeExists && storeId !== 'demo-store' && storeDomain !== 'demo-store') {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">المتجر غير موجود</h1>
        <p className="text-gray-600 mb-6 text-center">
          لم يتم العثور على متجر بهذا الاسم. الرجاء التحقق من الرابط والمحاولة مرة أخرى.
        </p>
        <a href="/" className="text-primary hover:underline">العودة للرئيسية</a>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<StoreHomePage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
};

export default StorefrontPreview;
