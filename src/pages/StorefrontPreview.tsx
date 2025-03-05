
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StoreHomePage from '@/features/store/StoreHomePage';

const StorefrontPreview = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(true);
  const [storeExists, setStoreExists] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    // Check if we are in the right context (store preview)
    const fetchStoreData = async () => {
      try {
        if (!storeId) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
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
  }, [storeId]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!storeExists && storeId !== 'demo-store') {
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

  return <StoreHomePage />;
};

export default StorefrontPreview;
