
import React from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  storeDomain: string;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  storeDomain,
  setIsMobileMenuOpen
}) => {
  return (
    <nav className="mt-4 py-3 border-t border-gray-200 md:hidden animate-slide-down">
      <ul className="space-y-4">
        <li>
          <Link 
            to={`/store/${storeDomain}`} 
            className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            الرئيسية
          </Link>
        </li>
        <li>
          <Link 
            to={`/store/${storeDomain}/products`} 
            className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            المنتجات
          </Link>
        </li>
        <li>
          <Link 
            to={`/store/${storeDomain}/about`} 
            className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            عن المتجر
          </Link>
        </li>
        <li>
          <Link 
            to={`/store/${storeDomain}/login`} 
            className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            تسجيل دخول
          </Link>
        </li>
        <li>
          <Link 
            to={`/store/${storeDomain}/register`}
            className="block bg-primary text-white py-2 px-4 rounded-md text-center font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            تسجيل حساب
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileMenu;
