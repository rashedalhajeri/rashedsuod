
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, Phone, Globe, CircleDollarSign, LogIn, UserPlus, AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDomainChecking, setIsDomainChecking] = useState(false);
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset-password">("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState("");
  
  // Determine initial auth mode based on URL path
  useEffect(() => {
    if (location.pathname === "/reset-password") {
      setAuthMode("reset-password");
    }
  }, [location.pathname]);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Check domain availability
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
  
  // Helper function for domain input class
  const getDomainInputClass = () => {
    if (isDomainChecking) return "border-yellow-300 focus-visible:ring-yellow-300";
    if (isDomainAvailable === true) return "border-green-300 focus-visible:ring-green-300";
    if (isDomainAvailable === false) return "border-red-300 focus-visible:ring-red-300";
    return "";
  };
  
  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await signInWithEmail(loginEmail, loginPassword);
      
      if (error) {
        throw error;
      }
      
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !storeName || !domainName || !phoneNumber) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }
    
    if (isDomainAvailable === false) {
      toast.error("اسم النطاق غير متاح، الرجاء اختيار اسم آخر");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Register user with Supabase
      const { data, error } = await signUpWithEmail(
        email,
        password,
        {
          store_name: storeName,
          domain_name: domainName,
          phone_number: phoneNumber,
          country: "Kuwait",
          currency: "KWD"
        }
      );
      
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
            country: "Kuwait",
            currency: "KWD"
          }
        ]);
      
      if (storeError) {
        throw storeError;
      }
      
      toast.success("تم إنشاء الحساب بنجاح، تفقد بريدك الإلكتروني للتحقق من حسابك");
      setAuthMode("login");
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        throw error;
      }
      
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
      setAuthMode("login");
      
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google");
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-gray-50 pb-20 rtl">
      {/* Top navigation */}
      <div className="py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>العودة إلى الصفحة الرئيسية</span>
          </button>
          
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold text-primary-500">Linok</span>
            <span className="text-xl font-medium text-gray-600">.me</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-2">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
              className="w-full"
            >
              {authMode === "login" && (
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                  <CardHeader className="space-y-2 pb-2">
                    <CardTitle className="text-2xl text-center font-bold">مرحباً بعودتك</CardTitle>
                    <CardDescription className="text-center text-base">
                      قم بتسجيل الدخول للوصول إلى متجرك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="font-medium">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Input
                            id="login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            placeholder="example@domain.com"
                            required
                          />
                          <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="font-medium">كلمة المرور</Label>
                          <button
                            type="button"
                            onClick={() => setAuthMode("reset-password")}
                            className="text-sm text-primary-500 hover:text-primary-600 hover:underline font-medium"
                          >
                            نسيت كلمة المرور؟
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 transform -translate-y-1/2 right-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white transition-colors rounded-md font-medium text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            جاري تسجيل الدخول...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-5 w-5" />
                            تسجيل الدخول
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-4 text-gray-500">
                            أو
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-gray-300 hover:bg-gray-50 rounded-md text-base font-medium"
                        onClick={handleGoogleLogin}
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        تسجيل الدخول باستخدام Google
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-8">
                    <p className="text-gray-600">
                      ليس لديك حساب؟{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup")}
                        className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                      >
                        إنشاء حساب جديد
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              )}
              
              {authMode === "signup" && (
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                  <CardHeader className="space-y-2 pb-2">
                    <CardTitle className="text-2xl text-center font-bold">بدء رحلتك مع Linok</CardTitle>
                    <CardDescription className="text-center text-base">
                      أنشئ متجرك الإلكتروني في دقائق معدودة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            placeholder="example@domain.com"
                            required
                          />
                          <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-medium">كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 transform -translate-y-1/2 right-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          يجب أن تكون كلمة المرور 6 أحرف على الأقل
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="storeName" className="font-medium">اسم المتجر</Label>
                        <div className="relative">
                          <Input
                            id="storeName"
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            required
                          />
                          <User className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="domainName" className="font-medium">اسم النطاق</Label>
                        <div className="flex items-center">
                          <div className="relative flex-grow">
                            <Input
                              id="domainName"
                              type="text"
                              value={domainName}
                              onChange={(e) => setDomainName(e.target.value)}
                              className={`rounded-r-md bg-white pl-3 py-2 ${getDomainInputClass()}`}
                              required
                            />
                            {domainName && !isDomainChecking && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {isDomainAvailable === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                                {isDomainAvailable === false && <AlertCircle className="h-5 w-5 text-red-500" />}
                              </div>
                            )}
                          </div>
                          <span className="bg-gray-100 px-4 py-2 border border-gray-200 rounded-l-md text-gray-600 font-medium">.linok.me</span>
                        </div>
                        {domainName && (
                          <p className="text-xs">
                            {isDomainChecking && (
                              <span className="text-yellow-600 flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                جاري التحقق...
                              </span>
                            )}
                            {!isDomainChecking && isDomainAvailable === true && (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                متاح للاستخدام
                              </span>
                            )}
                            {!isDomainChecking && isDomainAvailable === false && (
                              <span className="text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                غير متاح، يرجى اختيار اسم آخر
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="font-medium">رقم الهاتف</Label>
                        <div className="flex items-center">
                          <span className="bg-gray-100 px-4 py-2 border border-gray-200 rounded-r-md text-gray-600 font-medium">+965</span>
                          <div className="relative flex-grow">
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="rounded-l-md bg-white border-gray-200 pl-10 py-2 focus-visible:ring-primary-400"
                              required
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">الدولة والعملة</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <Input
                              type="text"
                              value="الكويت"
                              className="bg-gray-50 border-gray-200 pr-10 py-2"
                              disabled
                            />
                            <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <div className="relative flex-grow">
                            <Input
                              type="text"
                              value="د.ك"
                              className="bg-gray-50 border-gray-200 pr-10 py-2"
                              disabled
                            />
                            <CircleDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <InfoIcon className="h-3 w-3" />
                          حالياً متوفر فقط في الكويت
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white transition-colors rounded-md font-medium text-base"
                        disabled={isLoading || isDomainAvailable === false}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-5 w-5" />
                            إنشاء المتجر
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-4 text-gray-500">
                            أو
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-gray-300 hover:bg-gray-50 rounded-md text-base font-medium"
                        onClick={handleGoogleLogin}
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        إنشاء حساب باستخدام Google
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-8">
                    <p className="text-gray-600">
                      لديك حساب بالفعل؟{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                      >
                        تسجيل الدخول
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              )}
              
              {authMode === "reset-password" && (
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                  <CardHeader className="space-y-2 pb-2">
                    <CardTitle className="text-2xl text-center font-bold">استعادة كلمة المرور</CardTitle>
                    <CardDescription className="text-center text-base">
                      أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="font-medium">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pr-10 pl-3 py-2 bg-white border-gray-200 focus-visible:ring-primary-400"
                            placeholder="example@domain.com"
                            required
                          />
                          <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white transition-colors rounded-md font-medium text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            جاري إرسال الرابط...
                          </>
                        ) : (
                          "إرسال رابط استعادة كلمة المرور"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-8">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                    >
                      العودة إلى تسجيل الدخول
                    </button>
                  </CardFooter>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-100/60 via-white to-white"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

// InfoIcon component to avoid import error since it's not in lucide-react
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    <path d="M12 16v-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    <path d="M12 8h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export default Auth;
