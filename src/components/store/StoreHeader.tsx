
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

interface StoreHeaderProps {
  storeData: any;
  isLoading: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ storeData, isLoading }) => {
  const { storeId } = useParams();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* شعار المتجر والاسم - للشاشات الكبيرة */}
          <div className="flex items-center">
            <Link to={`/store/${storeId}`} className="flex items-center">
              {isLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : storeData?.logo_url ? (
                <img 
                  src={storeData.logo_url} 
                  alt={storeData.store_name} 
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {storeData?.store_name?.charAt(0) || 'S'}
                </div>
              )}
              
              {isLoading ? (
                <Skeleton className="h-6 w-24 mr-2" />
              ) : (
                <span className="mr-2 font-bold text-lg hidden sm:block">
                  {storeData?.store_name || 'المتجر'}
                </span>
              )}
            </Link>
          </div>
          
          {/* روابط التنقل - للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link 
              to={`/store/${storeId}`} 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              الرئيسية
            </Link>
            <Link 
              to={`/store/${storeId}/products`} 
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              المنتجات
            </Link>
          </nav>
          
          {/* أزرار الإجراءات */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* سلة التسوق */}
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/store/${storeId}/cart`}>
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* قائمة الموبايل */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="text-right">
                    <SheetTitle>
                      {isLoading ? (
                        <Skeleton className="h-6 w-24" />
                      ) : (
                        storeData?.store_name || 'المتجر'
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <SheetClose asChild>
                      <Link 
                        to={`/store/${storeId}`} 
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                      >
                        الرئيسية
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to={`/store/${storeId}/products`} 
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                      >
                        المنتجات
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to={`/store/${storeId}/cart`} 
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                      >
                        سلة التسوق
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
