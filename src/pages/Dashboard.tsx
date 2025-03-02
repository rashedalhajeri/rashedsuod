
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Settings, ShoppingBag, Home } from "lucide-react";

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const navigate = useNavigate();

  // Set the document direction to RTL for Arabic language support
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      // Cleanup if needed
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  // Check for auth state and fetch store data
  useEffect(() => {
    const fetchSessionAndStore = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        
        setSession(sessionData.session);
        
        // Fetch store data for the authenticated user
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (storeError) {
          throw storeError;
        }
        
        setStore(storeData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndStore();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_OUT') {
          navigate("/");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">Linok</span>
            <span className="text-lg font-medium text-gray-600">.me</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {store && (
              <div className="text-gray-700 font-medium">
                {store.store_name}
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">لوحة التحكم</h1>
          {store && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">معلومات المتجر</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">اسم المتجر:</span> {store.store_name}</p>
                  <p><span className="font-medium">رابط المتجر:</span> {store.domain_name}.linok.me</p>
                  <p><span className="font-medium">الدولة:</span> {store.country}</p>
                  <p><span className="font-medium">العملة:</span> {store.currency}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">الإحصائيات</h2>
                <p className="text-gray-500">لا توجد إحصائيات متاحة حاليًا</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
              <ShoppingBag className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
            <button className="text-primary-600 font-medium hover:underline">
              إضافة منتج جديد
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
              <Settings className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
            <button className="text-primary-600 font-medium hover:underline">
              تعديل الإعدادات
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
              <Home className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
            <button className="text-primary-600 font-medium hover:underline">
              عرض المتجر
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
