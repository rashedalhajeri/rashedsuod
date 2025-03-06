
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoreFilters from "@/components/admin/stores/StoreFilters";
import StoresTable from "@/components/admin/stores/StoresTable";
import SuspensionDialog from "@/components/admin/stores/SuspensionDialog";

interface StoreData {
  id: string;
  store_name: string;
  domain_name: string;
  user_id: string;
  status: string;
  subscription_plan: string;
  subscription_end_date: string | null;
  created_at: string;
  suspension_reason?: string | null;
}

const AdminStoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [suspendedStoreId, setSuspendedStoreId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  
  const { data: stores, isLoading, refetch } = useQuery({
    queryKey: ['adminStores', statusFilter],
    queryFn: async (): Promise<StoreData[]> => {
      let query = supabase
        .from('stores')
        .select('*');
        
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as StoreData[];
    }
  });
  
  const handleSuspendStore = async () => {
    if (!suspendedStoreId || !suspensionReason) return;
    
    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          status: 'suspended',
          suspension_reason: suspensionReason
        })
        .eq('id', suspendedStoreId);
        
      if (error) throw error;
      
      // سجل نشاط المشرف
      await supabase.rpc('log_admin_action', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'suspend_store',
        target_type: 'store',
        target_id: suspendedStoreId,
        details: { reason: suspensionReason }
      });
      
      // إعادة تحميل البيانات
      refetch();
      
      // إعادة تعيين الحالة
      setSuspendedStoreId(null);
      setSuspensionReason("");
    } catch (error) {
      console.error('خطأ في تعليق المتجر:', error);
    }
  };
  
  const handleActivateStore = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          status: 'active',
          suspension_reason: null
        })
        .eq('id', storeId);
        
      if (error) throw error;
      
      // سجل نشاط المشرف
      await supabase.rpc('log_admin_action', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'activate_store',
        target_type: 'store',
        target_id: storeId,
        details: {}
      });
      
      // إعادة تحميل البيانات
      refetch();
    } catch (error) {
      console.error('خطأ في تفعيل المتجر:', error);
    }
  };
  
  const filteredStores = stores?.filter(store => 
    store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.domain_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة المتاجر</h1>
              <p className="mt-1 text-sm text-gray-600">
                عرض وإدارة جميع المتاجر المسجلة في المنصة
              </p>
            </div>
            
            <StoreFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </motion.div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">قائمة المتاجر</CardTitle>
          </CardHeader>
          <CardContent>
            <StoresTable 
              stores={filteredStores || []}
              isLoading={isLoading}
              onSuspend={setSuspendedStoreId}
              onActivate={handleActivateStore}
            />
          </CardContent>
        </Card>
        
        <SuspensionDialog 
          open={!!suspendedStoreId}
          suspensionReason={suspensionReason}
          onSuspensionReasonChange={setSuspensionReason}
          onClose={() => setSuspendedStoreId(null)}
          onSuspend={handleSuspendStore}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminStoresPage;
