
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mobileNavigation } from "./navigation-items";

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="mobile-nav bg-white shadow-lg border-t border-gray-100 rounded-t-xl">
      {mobileNavigation.map((item) => (
        <Link key={item.name} to={item.href} className="mobile-nav-item">
          <item.icon 
            size={20} 
            className={location.pathname === item.href ? "text-primary-600" : "text-gray-500"} 
          />
          <span className={cn(
            "mobile-nav-label", 
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
