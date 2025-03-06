
import React from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreFooterProps {
  storeData: any;
}

const StoreFooter: React.FC<StoreFooterProps> = ({ storeData }) => {
  const { storeId } = useParams();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* معلومات المتجر */}
          <div>
            <div className="flex items-center mb-4">
              {storeData?.logo_url ? (
                <img 
                  src={storeData.logo_url} 
                  alt={storeData.store_name} 
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {storeData?.store_name?.charAt(0) || 'S'}
                </div>
              )}
              
              <h3 className="mr-2 text-xl font-bold">
                {storeData?.store_name || 'المتجر'}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              تسوق أفضل المنتجات بأسعار تنافسية مع ضمان الجودة والتوصيل السريع.
            </p>
            
            {/* معلومات التواصل */}
            <div className="space-y-2">
              {storeData?.phone_number && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 ml-2 text-gray-400" />
                  <span>{storeData.phone_number}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 ml-2 text-gray-400" />
                <span>info@{storeData?.domain_name || 'example'}.com</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 ml-2 text-gray-400" />
                <span>{storeData?.country || 'الكويت'}</span>
              </div>
            </div>
          </div>
          
          {/* روابط سريعة */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/store/${storeId}`} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeId}/products`} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeId}/cart`} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  سلة التسوق
                </Link>
              </li>
            </ul>
          </div>
          
          {/* وسائل التواصل الاجتماعي */}
          <div>
            <h3 className="text-lg font-bold mb-4">تابعنا</h3>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">طرق الدفع</h3>
              <div className="flex items-center space-x-3 space-x-reverse">
                <img src="/payment-icons/visa-master.png" alt="Visa/Mastercard" className="h-8" />
                <img src="/payment-icons/mada.png" alt="Mada" className="h-6" />
                <img src="/payment-icons/knet.png" alt="KNET" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {currentYear} {storeData?.store_name || 'المتجر'}. جميع الحقوق محفوظة.
          </p>
          <p className="mt-1">
            مدعوم بواسطة <a href="/" className="text-blue-400 hover:underline">Linok</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
