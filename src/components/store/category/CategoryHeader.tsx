
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

interface CategoryHeaderProps {
  headerTitle: string;
  storeDomain?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  headerTitle, 
  storeDomain 
}) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavigateToStore = () => {
    navigate(`/store/${storeDomain}`);
  };

  return (
    <header className="bg-gradient-to-l from-blue-500 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mt-20 -mr-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -ml-16 blur-lg"></div>
      
      <div className="container mx-auto px-4 py-5 relative z-10">
        <div className="flex items-center justify-between mb-2">
          {/* Left Side: Cart button with badge */}
          <Link to={`/store/${storeDomain}/cart`} className="block">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-white p-1 sm:p-1.5 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
              aria-label="عربة التسوق"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs h-4 min-w-4 sm:h-5 sm:min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-md">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Back button */}
            <Button 
              variant="ghost" 
              className="text-white bg-white/10 hover:bg-white/20 p-0 h-9 w-9 rounded-full"
              onClick={handleNavigateToStore}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-1 sm:p-1.5 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                  aria-label="حسابي"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent dir="rtl" align="end" className="w-48 sm:w-56 mt-2 border-none shadow-lg rounded-xl overflow-hidden">
                <div className="p-3 pb-2 text-center bg-gradient-to-l from-blue-50 to-blue-100">
                  <h3 className="font-semibold text-blue-600">حسابي</h3>
                </div>
                <DropdownMenuSeparator />
                <Link to={`/store/${storeDomain}/login`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 text-xs sm:text-sm">
                    تسجيل الدخول
                  </DropdownMenuItem>
                </Link>
                <Link to={`/store/${storeDomain}/register`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 text-xs sm:text-sm">
                    إنشاء حساب جديد
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link to={`/store/${storeDomain}/cart`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 text-xs sm:text-sm">
                    متابعة كزائر
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text-white tracking-wide mb-1">{headerTitle}</h1>
          <div className="h-1 w-20 bg-white/30 rounded-full mx-auto"></div>
        </div>
      </div>
      
      <div className="h-5 bg-gray-50 rounded-t-3xl -mb-1"></div>
    </header>
  );
};

export default CategoryHeader;
