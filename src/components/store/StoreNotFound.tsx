
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface StoreNotFoundProps {
  storeDomain?: string;
}

const StoreNotFound: React.FC<StoreNotFoundProps> = ({ storeDomain }) => {
  const navigate = useNavigate();
  const normalizedDomain = normalizeStoreDomain(storeDomain || '');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkStore = async () => {
      setIsChecking(true);
      try {
        // Collect debug info
        const info: any = {
          timestamp: new Date().toISOString(),
          normalizedDomain,
          originalDomain: storeDomain,
          url: window.location.href
        };
        
        // Check direct domain match
        const { data: directMatch, error: directError } = await supabase
          .from('stores')
          .select('id, domain_name, store_name, status')
          .eq('domain_name', normalizedDomain)
          .maybeSingle();
          
        info.directMatch = directMatch;
        info.directError = directError;
        
        // Check case insensitive match
        const { data: caseInsensitiveMatch, error: caseError } = await supabase
          .from('stores')
          .select('id, domain_name, store_name, status')
          .ilike('domain_name', normalizedDomain)
          .maybeSingle();
          
        info.caseInsensitiveMatch = caseInsensitiveMatch;
        info.caseError = caseError;
        
        // Get all stores for reference
        const { data: allStores } = await supabase
          .from('stores')
          .select('id, domain_name, store_name, status')
          .order('created_at', { ascending: false })
          .limit(10);
          
        info.recentStores = allStores;
        
        setDebugInfo(info);
      } catch (error) {
        console.error("خطأ في فحص المتجر:", error);
        setDebugInfo({ error: String(error) });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkStore();
  }, [normalizedDomain, storeDomain]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">المتجر غير موجود</h1>
        <p className="text-gray-600 mb-6">
          عذراً، لا يمكن العثور على متجر بالدومين: 
          <span className="font-bold text-gray-800 mx-1 dir-ltr inline-block">{storeDomain || 'غير محدد'}</span>
        </p>
        
        <div className="text-sm text-gray-500 mb-6 p-3 bg-gray-100 rounded">
          <div className="mb-2">تأكد من:</div>
          <ul className="list-disc list-inside text-right">
            <li>أن اسم الدومين مكتوب بشكل صحيح</li>
            <li>أن المتجر نشط وغير معلق</li>
            <li>أن المتجر تم إنشاؤه بالفعل</li>
          </ul>
          <div className="mt-2 text-xs bg-gray-200 p-2 rounded dir-ltr text-center">
            URL: {window.location.href}
          </div>
        </div>
        
        {isChecking ? (
          <div className="flex justify-center items-center my-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="mr-2">جاري التحقق من المتجر...</span>
          </div>
        ) : debugInfo && (
          <div className="mt-2 text-xs text-left bg-gray-100 p-2 rounded dir-ltr overflow-auto max-h-40">
            <details>
              <summary className="cursor-pointer font-medium text-primary">معلومات تصحيح الخطأ (للمطورين)</summary>
              <pre className="text-[9px] text-gray-700 mt-2 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
          <button 
            onClick={() => navigate('/')}
            className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreNotFound;
