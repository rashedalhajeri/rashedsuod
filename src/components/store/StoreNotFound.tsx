
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { normalizeStoreDomain } from "@/utils/url-helpers";

interface StoreNotFoundProps {
  storeDomain?: string;
}

const StoreNotFound: React.FC<StoreNotFoundProps> = ({ storeDomain }) => {
  const navigate = useNavigate();
  const normalizedDomain = normalizeStoreDomain(storeDomain || '');
  
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
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
          <button 
            onClick={() => navigate('/')}
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreNotFound;
