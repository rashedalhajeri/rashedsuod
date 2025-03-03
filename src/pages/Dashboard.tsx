
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Settings, ShoppingBag, Home, Package, BarChart, Users, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [productCount, setProductCount] = useState(0);
  const [showCreateStoreDialog, setShowCreateStoreDialog] = useState(false);
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
        
        // Fetch store data for the authenticated user using maybeSingle() instead of single()
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();
        
        if (storeError) {
          console.error("Store error:", storeError);
          toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
          setLoading(false);
          return;
        }
        
        // Check if store exists
        if (!storeData) {
          setShowCreateStoreDialog(true);
          setLoading(false);
          return;
        }
        
        setStore(storeData);

        // Now that we have the store, fetch product count
        if (storeData) {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', storeData.id);
          
          if (countError) {
            console.error("Count error:", countError);
            // Don't fail the entire operation if just the count fails
            setProductCount(0);
          } else {
            setProductCount(count || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndStore();
  }, [navigate]);

  const handleCreateStore = () => {
    navigate('/create-store');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // If showCreateStoreDialog is true, display a dialog prompting the user to create a store
  if (showCreateStoreDialog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">مرحباً بك في Linok.me</h1>
          <p className="text-gray-600 mb-6 text-center">لم نجد أي متجر مرتبط بحسابك. قم بإنشاء متجرك الآن للبدء!</p>
          <Button 
            onClick={handleCreateStore}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            إنشاء متجر جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">لوحة التحكم</h1>
        
        {store && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
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
                <div className="space-y-2">
                  <p><span className="font-medium">عدد المنتجات:</span> {productCount}</p>
                  <p><span className="font-medium">عدد الطلبات:</span> 0</p>
                  <p><span className="font-medium">عدد العملاء:</span> 0</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
              <Package className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
            <Button 
              onClick={() => navigate('/products')}
              className="text-primary-600 font-medium hover:underline bg-transparent"
              variant="ghost"
            >
              إدارة المنتجات
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
              <Settings className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
            <Button 
              className="text-primary-600 font-medium hover:underline bg-transparent"
              variant="ghost"
            >
              تعديل الإعدادات
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
              <Home className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
            <Button 
              className="text-primary-600 font-medium hover:underline bg-transparent"
              variant="ghost"
            >
              عرض المتجر
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
