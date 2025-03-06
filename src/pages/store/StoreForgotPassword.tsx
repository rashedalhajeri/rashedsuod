
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";

const StoreForgotPassword = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    
    try {
      setLoading(true);
      
      // Send password reset email with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/store/${storeDomain}/reset-password`
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
      
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error(error.message || "حدث خطأ أثناء طلب استعادة كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StoreNavbar storeName={storeData.store_name} logoUrl={storeData.logo_url} />
      
      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">استعادة كلمة المرور</CardTitle>
              <CardDescription className="text-center">
                أدخل بريدك الإلكتروني لاستعادة كلمة المرور الخاصة بك
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-6">
                  <Mail className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">تحقق من بريدك الإلكتروني</h3>
                  <p className="text-gray-500 mb-6">
                    لقد أرسلنا رابط استعادة كلمة المرور إلى البريد الإلكتروني {email}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={() => navigate(`/store/${storeDomain}/login`)}
                  >
                    العودة إلى تسجيل الدخول
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري المعالجة...
                      </>
                    ) : (
                      "إرسال رابط استعادة كلمة المرور"
                    )}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link 
                      to={`/store/${storeDomain}/login`} 
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <ArrowRight className="h-4 w-4 ml-1" />
                      العودة إلى تسجيل الدخول
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <StoreFooter storeName={storeData.store_name} />
    </div>
  );
};

export default StoreForgotPassword;
