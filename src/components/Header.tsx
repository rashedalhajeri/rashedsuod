
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ar"); // 'ar' for Arabic, 'en' for English

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === "ar" ? "en" : "ar");
  };
  
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4", isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-primary-600">Linok</span>
          <span className="text-xl font-medium text-gray-600">.me</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "المميزات" : "Features"}
          </a>
          <a href="#pricing" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "الأسعار" : "Pricing"}
          </a>
          
          <a href="#contact" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "تواصل معنا" : "Contact"}
          </a>
          
          <button onClick={toggleLanguage} className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
            {language === "ar" ? "English" : "العربية"}
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
          
          <a href="#login" className="btn-primary flex items-center gap-2">
            <LogIn size={16} />
            {language === "ar" ? "تسجيل الدخول" : "Log In"}
          </a>
          
          <a href="#signup" className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
              shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2">
            <UserPlus size={16} />
            {language === "ar" ? "إنشاء حساب" : "Sign Up"}
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 md:hidden flex flex-col space-y-4 animate-slide-down">
          <a href="#features" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "المميزات" : "Features"}
          </a>
          <a href="#pricing" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "الأسعار" : "Pricing"}
          </a>
          <a href="#testimonials" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "آراء العملاء" : "Testimonials"}
          </a>
          <a href="#contact" className="text-gray-800 hover:text-primary-500 transition-colors">
            {language === "ar" ? "تواصل معنا" : "Contact"}
          </a>
          
          <button onClick={toggleLanguage} className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
            {language === "ar" ? "English" : "العربية"}
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
          
          <a href="#login" className="btn-primary text-center flex items-center gap-2 justify-center">
            <LogIn size={16} />
            {language === "ar" ? "تسجيل الدخول" : "Log In"}
          </a>
          
          <a href="#signup" className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
              shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] text-center flex items-center gap-2 justify-center">
            <UserPlus size={16} />
            {language === "ar" ? "إنشاء حساب" : "Sign Up"}
          </a>
        </div>}
    </header>;
};

export default Header;
