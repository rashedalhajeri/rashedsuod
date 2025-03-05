
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
    const fetchStoreData = async () => {
      try {
        // Determine if we're using domain-based or id-based access
        const isDomainBased = !location.pathname.startsWith('/store/');
        
        // Use either the domain name or store ID
        const storeIdentifier = isDomainBased ? storeDomain : storeId;
        
        if (!storeIdentifier) {
          setLoading(false);
          return;
        }
        
        console.log('Fetching store with identifier:', storeIdentifier, 'using domain?', isDomainBased);
        
        let { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeIdentifier)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching by domain_name:', error);
          // If we're using the /store/:storeId route, try to fetch by ID as fallback
          if (!isDomainBased) {
            const { data: storeById, error: idError } = await supabase
              .from('stores')
              .select('*')
              .eq('id', storeIdentifier)
              .maybeSingle();
              
            if (idError) {
              console.error('Error fetching by id:', idError);
            } else if (storeById) {
              data = storeById;
            }
          }
        }
        
        // Handle demo store specially
        if (storeIdentifier === 'demo-store') {
          setStoreExists(true);
          // Set some demo data
          setStoreData({
            id: 'demo-store-id',
            domain_name: 'demo-store',
            store_name: 'متجر تجريبي',
            description: 'هذا متجر تجريبي لعرض الميزات',
            currency: 'SAR',
            country: 'السعودية'
          });
        } else if (data) {
          setStoreData(data);
          setStoreExists(true);
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

  if (!storeExists) {
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
