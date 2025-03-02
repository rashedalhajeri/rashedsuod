
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ar"); // 'ar' for Arabic, 'en' for English
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(null);
  const [isDomainChecking, setIsDomainChecking] = useState(false);
  
  // Kuwait is the default country and currency
  const country = "Kuwait";
  const currency = "KWD";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Check domain availability when domain name changes
  useEffect(() => {
    const checkDomainAvailability = async () => {
      if (domainName.trim() === '') {
        setIsDomainAvailable(null);
        return;
      }
      
      setIsDomainChecking(true);
      try {
        const { data, error } = await supabase.rpc('check_domain_availability', {
          domain: domainName.trim()
        });
        
        if (error) throw error;
        setIsDomainAvailable(data);
      } catch (error) {
        console.error('Error checking domain availability:', error);
        setIsDomainAvailable(null);
      } finally {
        setIsDomainChecking(false);
      }
    };
    
    // Use debounce to avoid too many API calls
    const debounceTimeout = setTimeout(() => {
      if (domainName) {
        checkDomainAvailability();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [domainName]);
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === "ar" ? "en" : "ar");
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error(language === "ar" ? "الرجاء إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password");
      return;
    }
    
    try {
      setIsLoginLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح" : "Logged in successfully");
      setLoginOpen(false);
      
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || (language === "ar" ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login"));
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !storeName || !domainName || !phoneNumber) {
      toast.error(language === "ar" ? "الرجاء تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    
    if (isDomainAvailable === false) {
      toast.error(language === "ar" ? "اسم النطاق غير متاح، الرجاء اختيار اسم آخر" : "Domain name is not available, please choose another one");
      return;
    }
    
    try {
      setIsSignupLoading(true);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            store_name: storeName,
            domain_name: domainName,
            phone_number: phoneNumber,
            country,
            currency
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Insert store data into the stores table
      const { error: storeError } = await supabase
        .from('stores')
        .insert([
          { 
            user_id: data.user?.id,
            store_name: storeName,
            domain_name: domainName,
            phone_number: phoneNumber,
            country,
            currency
          }
        ]);
      
      if (storeError) {
        throw storeError;
      }
      
      toast.success(language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully");
      setSignupOpen(false);
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || (language === "ar" ? "حدث خطأ أثناء إنشاء الحساب" : "An error occurred during signup"));
    } finally {
      setIsSignupLoading(false);
    }
  };
  
  // Helper function to determine domain input class
  const getDomainInputClass = () => {
    if (isDomainChecking) return "border-yellow-300 focus:border-yellow-400";
    if (isDomainAvailable === true) return "border-green-300 focus:border-green-400";
    if (isDomainAvailable === false) return "border-red-300 focus:border-red-400";
    return "border-gray-300 focus:border-primary-500";
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
            
            <button 
              onClick={() => setLoginOpen(true)} 
              className="btn-primary flex items-center gap-2"
            >
              <LogIn size={16} />
              {language === "ar" ? "تسجيل الدخول" : "Log In"}
            </button>
            
            <button 
              onClick={() => setSignupOpen(true)} 
              className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
                shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2"
            >
              <UserPlus size={16} />
              {language === "ar" ? "إنشاء حساب" : "Sign Up"}
            </button>
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
            
            <button 
              onClick={() => setLoginOpen(true)} 
              className="btn-primary text-center flex items-center gap-2 justify-center"
            >
              <LogIn size={16} />
              {language === "ar" ? "تسجيل الدخول" : "Log In"}
            </button>
            
            <button 
              onClick={() => setSignupOpen(true)} 
              className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border border-gray-300 
                shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] text-center flex items-center gap-2 justify-center"
            >
              <UserPlus size={16} />
              {language === "ar" ? "إنشاء حساب" : "Sign Up"}
            </button>
          </div>
        )}
      </header>
      
      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-5 p-5 rtl">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoginLoading}
            >
              {isLoginLoading 
                ? (language === "ar" ? "جاري تسجيل الدخول..." : "Logging in...") 
                : (language === "ar" ? "تسجيل الدخول" : "Login")}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                <button 
                  type="button"
                  onClick={() => {
                    setLoginOpen(false);
                    setSignupOpen(true);
                  }}
                  className="text-primary-500 hover:underline"
                >
                  {language === "ar" ? "إنشاء حساب جديد" : "Sign up"}
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Signup Dialog */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {language === "ar" ? "إنشاء متجر جديد" : "Create a New Store"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignUp} className="space-y-5 p-5 rtl">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                minLength={6}
                required
              />
            </div>
            
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "اسم المتجر" : "Store Name"}
              </label>
              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "اسم النطاق" : "Domain Name"}
              </label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    id="domainName"
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${getDomainInputClass()} rounded-r-md focus:ring-primary-500`}
                    required
                  />
                  {domainName && !isDomainChecking && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {isDomainAvailable === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {isDomainAvailable === false && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  )}
                </div>
                <span className="bg-gray-100 px-3 py-2.5 border border-gray-300 border-r-0 rounded-l-md text-gray-500">.linok.me</span>
              </div>
              {domainName && (
                <p className="mt-1 text-sm">
                  {isDomainChecking && (
                    <span className="text-yellow-600">
                      {language === "ar" ? "جاري التحقق..." : "Checking availability..."}
                    </span>
                  )}
                  {!isDomainChecking && isDomainAvailable === true && (
                    <span className="text-green-600">
                      {language === "ar" ? "متاح للاستخدام" : "Available"}
                    </span>
                  )}
                  {!isDomainChecking && isDomainAvailable === false && (
                    <span className="text-red-600">
                      {language === "ar" ? "غير متاح، يرجى اختيار اسم آخر" : "Not available, please choose another name"}
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 px-3 py-2.5 border border-gray-300 border-l-0 rounded-r-md text-gray-500">+965</span>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === "ar" ? "الدولة والعملة" : "Country and Currency"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={country}
                  className="w-1/2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                  disabled
                />
                <input
                  type="text"
                  value={currency}
                  className="w-1/2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {language === "ar" ? "حالياً متوفر فقط في الكويت" : "Currently only available in Kuwait"}
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isSignupLoading || isDomainAvailable === false}
            >
              {isSignupLoading 
                ? (language === "ar" ? "جاري إنشاء الحساب..." : "Creating account...") 
                : (language === "ar" ? "إنشاء المتجر" : "Create Store")}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                <button 
                  type="button"
                  onClick={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                  }}
                  className="text-primary-500 hover:underline"
                >
                  {language === "ar" ? "تسجيل الدخول" : "Login"}
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
