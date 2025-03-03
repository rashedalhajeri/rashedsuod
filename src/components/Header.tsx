import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, UserPlus, CheckCircle2, XCircle, LogOut, User, Store, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
interface HeaderProps {
  session: Session | null;
  onLogout?: () => Promise<void>;
}
const Header: React.FC<HeaderProps> = ({
  session,
  onLogout
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ar"); // 'ar' for Arabic, 'en' for English
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Check if user has a store when session changes
    const checkUserStore = async () => {
      if (session) {
        try {
          const {
            data,
            error
          } = await supabase.from('stores').select('id').eq('user_id', session.user.id).maybeSingle();
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
        const {
          error
        } = await supabase.auth.signOut();
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
  return <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-8 py-3", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Linok</span>
            <span className="text-lg md:text-xl font-medium text-gray-700">.me</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {showSearch ? <div className="relative w-60 ml-6">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder={language === "ar" ? "ابحث هنا..." : "Search..."} className="pr-9 rounded-full border-gray-200 focus-visible:ring-primary-500" autoFocus onBlur={() => setShowSearch(false)} />
              </div> : <>
                <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {language === "ar" ? "المميزات" : "Features"}
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {language === "ar" ? "الأسعار" : "Pricing"}
                </a>
                <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {language === "ar" ? "تواصل معنا" : "Contact"}
                </a>
                
              </>}
            
            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center text-gray-600 hover:text-primary-600 hover:bg-gray-100/80 font-medium">
              {language === "ar" ? "English" : "العربية"}
              <ChevronDown className="h-4 w-4 mr-0 ml-1" />
            </Button>
            
            {session ? <div className="flex items-center space-x-2">
                
                
                <Button variant="ghost" onClick={handleDashboardClick} className="flex items-center gap-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100/80 font-medium">
                  <Store size={16} />
                  {language === "ar" ? "متجري" : "My Store"}
                </Button>
                
                <Button onClick={handleLogout} variant="outline" className="border-primary-500 font-medium bg-green-500 hover:bg-green-400 text-slate-800 text-base rounded-sm">
                  <LogOut size={16} className="ml-1" />
                  {language === "ar" ? "تسجيل الخروج" : "Log Out"}
                </Button>
              </div> : <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={handleLogin} className="text-gray-700 hover:text-primary-600 hover:bg-gray-100/80 font-medium">
                  <LogIn size={16} className="ml-1" />
                  {language === "ar" ? "تسجيل الدخول" : "Log In"}
                </Button>
                
                <Button onClick={() => navigate("/auth")} className="bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all">
                  <UserPlus size={16} className="ml-1" />
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Button>
              </div>}
          </nav>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden flex flex-col space-y-3 animate-slide-down rounded-b-xl border-t border-gray-100">
            <div className="relative mb-2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder={language === "ar" ? "ابحث هنا..." : "Search..."} className="pr-9 rounded-lg border-gray-200" />
            </div>
            
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-gray-50">
              {language === "ar" ? "المميزات" : "Features"}
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-gray-50">
              {language === "ar" ? "الأسعار" : "Pricing"}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-md hover:bg-gray-50">
              {language === "ar" ? "تواصل معنا" : "Contact"}
            </a>
            
            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors justify-start p-2">
              {language === "ar" ? "English" : "العربية"}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            
            <div className="h-px w-full bg-gray-100 my-2"></div>
            
            {session ? <>
                <Button variant="ghost" onClick={handleDashboardClick} className="flex items-center gap-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors justify-start p-2">
                  <Store size={16} />
                  {language === "ar" ? "متجري" : "My Store"}
                </Button>
                
                <Button onClick={handleLogout} className="bg-primary-500 hover:bg-primary-600 text-white w-full justify-center mt-2">
                  <LogOut size={16} className="ml-1" />
                  {language === "ar" ? "تسجيل الخروج" : "Log Out"}
                </Button>
              </> : <>
                <Button variant="ghost" onClick={handleLogin} className="flex items-center gap-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors justify-start p-2">
                  <LogIn size={16} />
                  {language === "ar" ? "تسجيل الدخول" : "Log In"}
                </Button>
                
                <Button onClick={() => navigate("/auth")} className="bg-primary-500 hover:bg-primary-600 text-white w-full justify-center mt-2">
                  <UserPlus size={16} className="ml-1" />
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Button>
              </>}
          </div>}
      </header>
    </>;
};
export default Header;