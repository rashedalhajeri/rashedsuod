
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
  const [storeData, setStoreData] = useState<any>({
    store_name: storeDomain?.charAt(0).toUpperCase() + storeDomain?.slice(1) || "المتجر"
  });

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeDomain) return;
      
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('store_name, logo_url')
          .eq('domain_name', storeDomain)
          .single();
          
        if (error) throw error;
        if (data) {
          setStoreData(data);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };
    
    fetchStoreData();
  }, [storeDomain]);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData.store_name} logoUrl={storeData.logo_url} />
      
      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Link 
            to={`/store/${storeDomain}`} 
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
                storeDomain={storeDomain} 
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
