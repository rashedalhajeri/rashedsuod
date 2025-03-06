
import React from "react";
import { Bell, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavActionsProps {
  storeDomain: string;
  totalItems: number;
}

const NavActions: React.FC<NavActionsProps> = ({
  storeDomain,
  totalItems
}) => {
  return (
    <div className="flex items-center gap-5">
      {/* Notification bell */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white p-0 hover:bg-transparent"
        aria-label="الإشعارات"
      >
        <Bell className="h-7 w-7" />
      </Button>
      
      {/* Cart button */}
      <Link to={`/store/${storeDomain}/cart`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-white p-0 hover:bg-transparent"
          aria-label="عربة التسوق"
        >
          <ShoppingCart className="h-7 w-7" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-sm">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>
    </div>
  );
};

export default NavActions;
