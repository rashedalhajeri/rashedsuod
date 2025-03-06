
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StoreLogin = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [storeData, setStoreData] = useState<any>({
    store_name: storeDomain?.charAt(0).toUpperCase() + storeDomain?.slice(1) || "المتجر"
  });

  // Fetch basic store data for header/footer
  React.useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeDomain) return;
      
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('store_name, logo_url')
          .eq('domain_name', storeDomain)
          .single();
          
        if (error) throw error;
        if (data) {
          setStoreData(data);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };
    
    fetchStoreData();
  }, [storeDomain]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("تم تسجيل الدخول بنجاح");
      navigate(`/store/${storeDomain}`);
      
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  // Extract initial for avatar display
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeData.store_name || "Store");

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData.store_name} logoUrl={storeData.logo_url} />
      
      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Link 
            to={`/store/${storeDomain}`} 
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="ml-1 h-4 w-4" />
            العودة إلى المتجر
          </Link>
        
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 items-center pb-2">
              <Avatar className="h-20 w-20 mb-4">
                {storeData.logo_url ? (
                  <AvatarImage src={storeData.logo_url} alt={storeData.store_name} />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle className="text-2xl text-center font-bold">تسجيل الدخول</CardTitle>
              <CardDescription className="text-center">
                قم بتسجيل الدخول للوصول إلى حسابك في {storeData.store_name}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Link to={`/store/${storeDomain}/forgot-password`} className="text-sm text-primary hover:underline">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري تسجيل الدخول...
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-500">
                  ليس لديك حساب؟{" "}
                  <Link to={`/store/${storeDomain}/register`} className="text-primary hover:underline font-medium">
                    إنشاء حساب جديد
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <StoreFooter storeName={storeData.store_name} />
    </div>
  );
};

export default StoreLogin;
