
import React from "react";
import { Link } from "react-router-dom";

interface DesktopNavigationProps {
  storeDomain: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ storeDomain }) => {
  return (
    <nav className="hidden md:flex items-center space-x-6 mr-auto ml-10">
      <Link 
        to={`/store/${storeDomain}`} 
        className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
      >
        الرئيسية
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </Link>
      <Link 
        to={`/store/${storeDomain}/products`} 
        className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
      >
        المنتجات
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </Link>
      <Link 
        to={`/store/${storeDomain}/about`} 
        className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
      >
        عن المتجر
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
