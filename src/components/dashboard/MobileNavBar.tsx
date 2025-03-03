
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mobileNavigation } from "./navigation-items";

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white shadow-lg border-t border-gray-100 rounded-t-xl z-50">
      {mobileNavigation.map((item) => (
        <Link 
          key={item.name} 
          to={item.href} 
          className="flex flex-col items-center justify-center space-y-1 w-full h-full"
        >
          <item.icon 
            size={20} 
            className={location.pathname === item.href ? "text-primary-600" : "text-gray-500"} 
          />
          <span className={cn(
            "text-xs font-medium", 
            location.pathname === item.href ? "text-primary-600" : "text-gray-500"
          )}>
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default MobileNavBar;
