
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface StoreNotFoundProps {
  storeDomain?: string;
}

const StoreNotFound: React.FC<StoreNotFoundProps> = ({ storeDomain }) => {
  const navigate = useNavigate();
  
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
        <div className="text-sm text-gray-500 mb-4 p-2 bg-gray-100 rounded">
          تأكد من أن الدومين صحيح وأن المتجر نشط.
        </div>
        <button 
          onClick={() => navigate('/')}
          className="inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </motion.div>
  );
};

export default StoreNotFound;
