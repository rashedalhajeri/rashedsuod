
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";

interface StoreFooterProps {
  storeName: string;
}

const StoreFooter: React.FC<StoreFooterProps> = ({ storeName }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
  return (
    <footer className="bg-gray-100 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h3 className="font-bold text-lg mb-3">{storeName}</h3>
          
          <div className="space-x-4 space-x-reverse mb-6">
            <Link 
              to={`/store/${storeDomain}`} 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              الرئيسية
            </Link>
            <Link 
              to={`/store/${storeDomain}/cart`} 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              السلة
            </Link>
          </div>
          
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
          </div>
          
          <div className="text-gray-400 text-xs mt-2 flex items-center">
            <span>تم تطويره بواسطة</span>
            <Heart className="h-3 w-3 mx-1 text-red-400" />
            <span>لينوك - منصة المتاجر الإلكترونية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
