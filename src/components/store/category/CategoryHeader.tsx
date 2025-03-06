
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
    <header className="bg-gradient-to-l from-blue-600 to-blue-700 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-800/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Left side: Back button */}
          <Button 
            variant="ghost" 
            className="text-white bg-white/10 hover:bg-white/20 p-0 h-10 w-10 rounded-full shadow-md flex items-center justify-center"
            onClick={handleNavigateToStore}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Cart button with badge */}
            <Link to={`/store/${storeDomain}/cart`} className="block">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-white rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors shadow-md"
                aria-label="عربة التسوق"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-md">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors shadow-md"
                  aria-label="حسابي"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent dir="rtl" align="end" className="w-56 mt-2 border-none shadow-lg rounded-xl overflow-hidden">
                <div className="p-3 pb-2 text-center bg-gradient-to-l from-blue-50 to-blue-100">
                  <h3 className="font-semibold text-blue-600">حسابي</h3>
                </div>
                <DropdownMenuSeparator />
                <Link to={`/store/${storeDomain}/login`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 text-sm">
                    تسجيل الدخول
                  </DropdownMenuItem>
                </Link>
                <Link to={`/store/${storeDomain}/register`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-gray-50 text-sm">
                    إنشاء حساب جديد
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link to={`/store/${storeDomain}/cart`}>
                  <DropdownMenuItem className="cursor-pointer py-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 text-sm">
                    متابعة كزائر
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-3 tracking-wide">
            {headerTitle}
          </h1>
          <div className="h-1 w-20 bg-white/30 rounded-full mx-auto"></div>
        </motion.div>
      </div>
      
      <div className="h-6 bg-gray-50 rounded-t-3xl -mb-1 shadow-inner"></div>
    </header>
  );
};

export default CategoryHeader;
