
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, Phone, Globe, CircleDollarSign, LogIn, UserPlus, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
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
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 rtl">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-1">
            <span className="text-4xl font-bold text-primary">Linok</span>
            <span className="text-2xl font-medium text-gray-600">.me</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {authMode === "login" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
                <CardDescription className="text-center">
                  أدخل بيانات حسابك للوصول إلى متجرك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pr-10"
                        placeholder="example@domain.com"
                        required
                      />
                      <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">كلمة المرور</Label>
                      <button
                        type="button"
                        onClick={() => setAuthMode("reset-password")}
                        className="text-sm text-primary hover:underline"
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
                        className="pr-10"
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
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        أو
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  ليس لديك حساب؟{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    إنشاء حساب
                  </button>
                </p>
              </CardFooter>
            </Card>
          )}
          
          {authMode === "signup" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">إنشاء متجر جديد</CardTitle>
                <CardDescription className="text-center">
                  أنشئ متجرك الإلكتروني في دقائق
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10"
                        placeholder="example@domain.com"
                        required
                      />
                      <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
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
                    <p className="text-xs text-muted-foreground">
                      يجب أن تكون كلمة المرور 6 أحرف على الأقل
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeName">اسم المتجر</Label>
                    <div className="relative">
                      <Input
                        id="storeName"
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <User className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domainName">اسم النطاق</Label>
                    <div className="flex items-center">
                      <div className="relative flex-grow">
                        <Input
                          id="domainName"
                          type="text"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          className={`rounded-r-md ${getDomainInputClass()}`}
                          required
                        />
                        {domainName && !isDomainChecking && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isDomainAvailable === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {isDomainAvailable === false && <AlertCircle className="h-5 w-5 text-red-500" />}
                          </div>
                        )}
                      </div>
                      <span className="bg-muted px-3 py-2 border border-input rounded-l-md text-muted-foreground">.linok.me</span>
                    </div>
                    {domainName && (
                      <p className="text-xs">
                        {isDomainChecking && (
                          <span className="text-yellow-600">
                            جاري التحقق...
                          </span>
                        )}
                        {!isDomainChecking && isDomainAvailable === true && (
                          <span className="text-green-600">
                            متاح للاستخدام
                          </span>
                        )}
                        {!isDomainChecking && isDomainAvailable === false && (
                          <span className="text-red-600">
                            غير متاح، يرجى اختيار اسم آخر
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                    <div className="flex items-center">
                      <span className="bg-muted px-3 py-2 border border-input rounded-r-md text-muted-foreground">+965</span>
                      <div className="relative flex-grow">
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="rounded-l-md"
                          required
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>الدولة والعملة</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <Input
                          type="text"
                          value="الكويت"
                          className="bg-muted"
                          disabled
                        />
                        <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <div className="relative flex-grow">
                        <Input
                          type="text"
                          value="د.ك"
                          className="bg-muted"
                          disabled
                        />
                        <CircleDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      حالياً متوفر فقط في الكويت
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isDomainAvailable === false}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        إنشاء المتجر
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        أو
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              </CardFooter>
            </Card>
          )}
          
          {authMode === "reset-password" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">استعادة كلمة المرور</CardTitle>
                <CardDescription className="text-center">
                  أدخل بريدك الإلكتروني لاستعادة كلمة المرور
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pr-10"
                        placeholder="example@domain.com"
                        required
                      />
                      <Mail className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري إرسال الرابط...
                      </>
                    ) : (
                      "إرسال رابط استعادة كلمة المرور"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  العودة إلى تسجيل الدخول
                </button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
