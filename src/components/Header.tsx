
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, UserPlus, CheckCircle2, XCircle, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

interface HeaderProps {
  session: Session | null;
  onLogout?: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ session, onLogout }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ar"); // 'ar' for Arabic, 'en' for English
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check if user has a store when session changes
    const checkUserStore = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (error) throw error;
          setHasStore(!!data);
        } catch (error) {
          console.error("Error checking store:", error);
          setHasStore(false);
        }
      } else {
        setHasStore(null);
      }
    };
    
    checkUserStore();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [session]);
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === "ar" ? "en" : "ar");
  };
  
  const handleLogin = () => {
    navigate("/auth");
  };
  
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        toast.success(language === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
        navigate("/");
      } catch (error: any) {
        console.error("Error logging out:", error);
        toast.error(language === "ar" ? "حدث خطأ أثناء تسجيل الخروج" : "An error occurred during logout");
      }
    }
  };
  
  const handleDashboardClick = () => {
    if (hasStore) {
      navigate("/dashboard");
    } else {
      navigate("/create-store");
    }
  };
  
  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4", isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent")}>
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
            
            {session ? (
              <>
                <button 
                  onClick={handleDashboardClick} 
                  className="flex items-center gap-2 text-gray-800 hover:text-primary-500 transition-colors"
                >
                  <User size={16} />
                  {language === "ar" ? "حسابي" : "My Account"}
                </button>
                
                <button 
                  onClick={handleLogout} 
                  className="btn-primary flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {language === "ar" ? "تسجيل الخروج" : "Log Out"}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin} 
                  className="btn-primary flex items-center gap-2"
                >
                  <LogIn size={16} />
                  {language === "ar" ? "تسجيل الدخول" : "Log In"}
                </button>
                
                <button 
                  onClick={() => navigate("/auth")} 
                  className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
                    shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 md:hidden flex flex-col space-y-4 animate-slide-down">
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
            
            {session ? (
              <>
                <button 
                  onClick={handleDashboardClick} 
                  className="flex items-center gap-2 justify-center text-gray-800 hover:text-primary-500 transition-colors"
                >
                  <User size={16} />
                  {language === "ar" ? "حسابي" : "My Account"}
                </button>
                
                <button 
                  onClick={handleLogout} 
                  className="btn-primary text-center flex items-center gap-2 justify-center"
                >
                  <LogOut size={16} />
                  {language === "ar" ? "تسجيل الخروج" : "Log Out"}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin} 
                  className="btn-primary text-center flex items-center gap-2 justify-center"
                >
                  <LogIn size={16} />
                  {language === "ar" ? "تسجيل الدخول" : "Log In"}
                </button>
                
                <button 
                  onClick={() => navigate("/auth")} 
                  className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
                    shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] text-center flex items-center gap-2 justify-center"
                >
                  <UserPlus size={16} />
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
