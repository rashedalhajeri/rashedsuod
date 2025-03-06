
import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  isScrolled?: boolean;
}

const NavActions: React.FC<NavActionsProps> = ({
  storeDomain,
  totalItems,
  isScrolled = false
}) => {
  return (
    <div className="flex items-center gap-5">
      {/* Cart button */}
      <Link to={`/store/${storeDomain}/cart`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-1 h-10 w-10 rounded-full text-white bg-white/10 hover:bg-white/20"
          aria-label="عربة التسوق"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Authentication Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-10 w-10 rounded-full text-white bg-white/10 hover:bg-white/20"
            aria-label="حسابي"
          >
            <User className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent dir="rtl" align="end" className="w-56 mt-2 border-none shadow-lg rounded-xl overflow-hidden">
          <div className="p-3 pb-2 text-center bg-gradient-to-l from-purple-50 to-indigo-50">
            <h3 className="font-semibold text-primary">حسابي</h3>
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
            <DropdownMenuItem className="cursor-pointer py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 text-sm">
              متابعة كزائر
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavActions;
