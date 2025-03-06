
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormatter } from "@/hooks/use-formatter";
import { Search, Filter, Check, X, AlertTriangle, Store, Calendar, Package, User, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StoreData {
  id: string;
  store_name: string;
  domain_name: string;
  user_id: string;
  status: string;
  subscription_plan: string;
  subscription_end_date: string | null;
  created_at: string;
}

const AdminStoresPage = () => {
  const formatter = useFormatter();
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
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="بحث..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9 w-full md:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-400 ml-2" />
                    <SelectValue placeholder="جميع المتاجر" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المتاجر</SelectItem>
                  <SelectItem value="active">المتاجر النشطة</SelectItem>
                  <SelectItem value="suspended">المتاجر المعلقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">قائمة المتاجر</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredStores && filteredStores.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center">
                          اسم المتجر
                          <ArrowUpDown className="h-3 w-3 text-gray-400 mr-1" />
                        </div>
                      </TableHead>
                      <TableHead>النطاق</TableHead>
                      <TableHead>خطة الاشتراك</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((store) => (
                      <TableRow key={store.id} className="group hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 ml-2">
                              <Store className="h-4 w-4" />
                            </div>
                            <span>{store.store_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{store.domain_name}.linok.me</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2">
                              {store.subscription_plan}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatter.date(new Date(store.created_at))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {store.status === 'active' ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="h-3 w-3 ml-1" /> نشط
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <AlertTriangle className="h-3 w-3 ml-1" /> معلق
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                  التفاصيل
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>تفاصيل المتجر</DialogTitle>
                                  <DialogDescription>
                                    معلومات مفصلة عن المتجر
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex flex-col space-y-4">
                                    <div className="flex items-center">
                                      <Store className="h-5 w-5 text-gray-500 ml-2" />
                                      <span className="text-sm font-semibold">اسم المتجر:</span>
                                      <span className="text-sm mr-1">{store.store_name}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Package className="h-5 w-5 text-gray-500 ml-2" />
                                      <span className="text-sm font-semibold">الاشتراك:</span>
                                      <span className="text-sm mr-1">{store.subscription_plan}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-5 w-5 text-gray-500 ml-2" />
                                      <span className="text-sm font-semibold">معرف المستخدم:</span>
                                      <span className="text-sm mr-1 truncate" style={{ maxWidth: "200px" }}>{store.user_id}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-5 w-5 text-gray-500 ml-2" />
                                      <span className="text-sm font-semibold">تاريخ الإنشاء:</span>
                                      <span className="text-sm mr-1">{formatter.date(new Date(store.created_at))}</span>
                                    </div>
                                    {store.status === 'suspended' && (
                                      <div className="p-3 bg-red-50 rounded-md border border-red-200 text-sm text-red-700">
                                        <div className="font-semibold mb-1">سبب التعليق:</div>
                                        <div>{store.suspension_reason || "غير محدد"}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <DialogFooter>
                                  {store.status === 'active' ? (
                                    <Button
                                      variant="destructive"
                                      onClick={() => setSuspendedStoreId(store.id)}
                                    >
                                      تعليق المتجر
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => handleActivateStore(store.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      إعادة تفعيل المتجر
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            {store.status === 'active' ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => setSuspendedStoreId(store.id)}
                              >
                                <X className="h-3 w-3 ml-1" />
                                تعليق
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2 text-xs text-green-600 border-green-300 hover:bg-green-50"
                                onClick={() => handleActivateStore(store.id)}
                              >
                                <Check className="h-3 w-3 ml-1" />
                                تفعيل
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد متاجر</h3>
                <p className="text-gray-500">لم يتم العثور على متاجر مطابقة للفلتر المحدد.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* مربع حوار سبب التعليق */}
        <Dialog open={!!suspendedStoreId} onOpenChange={(open) => !open && setSuspendedStoreId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعليق المتجر</DialogTitle>
              <DialogDescription>
                الرجاء إدخال سبب تعليق المتجر. سيتم عرض هذا السبب لصاحب المتجر.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="سبب التعليق..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendedStoreId(null)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive"
                onClick={handleSuspendStore}
                disabled={!suspensionReason}
              >
                تعليق المتجر
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminStoresPage;
