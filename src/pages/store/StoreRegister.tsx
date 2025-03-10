
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import StoreHeader from "@/components/store/auth/StoreHeader";
import RegisterForm from "@/components/store/auth/RegisterForm";

const StoreRegister = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>({
    store_name: storeDomain?.charAt(0).toUpperCase() + storeDomain?.slice(1) || "المتجر"
  });
  const [storeNotFound, setStoreNotFound] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeDomain) return;
      
      try {
        // Clean and standardize domain
        const cleanDomain = storeDomain.trim().toLowerCase();
        
        const { data, error } = await supabase
          .from('stores')
          .select('store_name, logo_url, domain_name')
          .eq('domain_name', cleanDomain)
          .eq('status', 'active')
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching store:", error);
          setStoreNotFound(true);
          return;
        }
        
        if (data) {
          setStoreData(data);
          setStoreNotFound(false);
        } else {
          setStoreNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
        setStoreNotFound(true);
      }
    };
    
    fetchStoreData();
  }, [storeDomain]);

  if (storeNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">المتجر غير موجود</h1>
          <p className="text-gray-600 mb-6">
            عذراً، لا يمكن العثور على متجر بالدومين: 
            <span className="font-bold text-gray-800 mx-1 dir-ltr inline-block">{storeDomain}</span>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData.store_name} logoUrl={storeData.logo_url} />
      
      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Link 
            to={`/store/${storeData.domain_name?.toLowerCase() || storeDomain?.toLowerCase()}`} 
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="ml-1 h-4 w-4" />
            العودة إلى المتجر
          </Link>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-0">
              <StoreHeader 
                storeName={storeData.store_name} 
                logoUrl={storeData.logo_url} 
              />
            </CardHeader>
            
            <CardContent>
              <RegisterForm 
                storeDomain={storeData.domain_name?.toLowerCase() || storeDomain?.toLowerCase()} 
                storeData={storeData} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <StoreFooter storeName={storeData.store_name} />
    </div>
  );
};

export default StoreRegister;
