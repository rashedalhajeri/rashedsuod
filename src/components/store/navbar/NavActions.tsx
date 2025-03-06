
import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavActionsProps {
  storeDomain: string;
  totalItems: number;
}

const NavActions: React.FC<NavActionsProps> = ({
  storeDomain,
  totalItems
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {/* Authentication Button with improved styling */}
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
          <div className="p-3 pb-2 text-center bg-gradient-to-l from-purple-50 to-indigo-50">
            <h3 className="font-semibold text-primary">حسابي</h3>
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
            <DropdownMenuItem className="cursor-pointer py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 text-xs sm:text-sm">
              متابعة كزائر
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cart button with improved styling */}
      <Link to={`/store/${storeDomain}/cart`}>
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
    </div>
  );
};

export default NavActions;
