
import React from "react";
import { Bell, ShoppingCart, User } from "lucide-react";
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
}

const NavActions: React.FC<NavActionsProps> = ({
  storeDomain,
  totalItems
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Authentication Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white p-0 hover:bg-white/15 active:bg-white/20 transition-colors"
            aria-label="حسابي"
          >
            <User className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 border-none shadow-lg rounded-xl">
          <div className="p-3 pb-2 text-center">
            <h3 className="font-semibold text-primary">حسابي</h3>
          </div>
          <DropdownMenuSeparator />
          <Link to={`/store/${storeDomain}/login`}>
            <DropdownMenuItem className="cursor-pointer py-2 hover:bg-gray-50">
              تسجيل الدخول
            </DropdownMenuItem>
          </Link>
          <Link to={`/store/${storeDomain}/register`}>
            <DropdownMenuItem className="cursor-pointer py-2 hover:bg-gray-50">
              إنشاء حساب
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link to={`/store/${storeDomain}/cart`}>
            <DropdownMenuItem className="cursor-pointer py-2 text-gray-600 hover:text-primary hover:bg-gray-50">
              متابعة كزائر
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cart button */}
      <Link to={`/store/${storeDomain}/cart`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-white p-0 hover:bg-white/15 active:bg-white/20 transition-colors"
          aria-label="عربة التسوق"
        >
          <ShoppingCart className="h-7 w-7" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-md">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>
      
      {/* Notification bell */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white p-0 hover:bg-white/15 active:bg-white/20 transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default NavActions;
