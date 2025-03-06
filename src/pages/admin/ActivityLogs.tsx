
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFormatter } from "@/hooks/use-formatter";
import { Activity, Filter, Search, Store, ShoppingBag, Users, FileText, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActivityLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
  admin_email?: string;
}

const getActionTypeColor = (actionType: string) => {
  switch (actionType) {
    case 'suspend_store':
      return 'bg-red-100 text-red-800';
    case 'activate_store':
      return 'bg-green-100 text-green-800';
    case 'delete_store':
      return 'bg-red-100 text-red-800';
    case 'ban_user':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const getActionTypeLabel = (actionType: string) => {
  switch (actionType) {
    case 'suspend_store':
      return 'تعليق متجر';
    case 'activate_store':
      return 'تفعيل متجر';
    case 'delete_store':
      return 'حذف متجر';
    case 'ban_user':
      return 'حظر مستخدم';
    default:
      return actionType;
  }
};

const getTargetTypeIcon = (targetType: string) => {
  switch (targetType) {
    case 'store':
      return <Store className="h-4 w-4" />;
    case 'order':
      return <ShoppingBag className="h-4 w-4" />;
    case 'user':
      return <Users className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const ActivityLogsPage = () => {
  const formatter = useFormatter();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['activityLogs', actionFilter],
    queryFn: async (): Promise<ActivityLog[]> => {
      let query = supabase
        .from('admin_activity_logs')
        .select('*, admin:admin_id(email)');
        
      if (actionFilter !== 'all') {
        query = query.eq('action_type', actionFilter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((log: any) => ({
        ...log,
        admin_email: log.admin?.email
      }));
    },
  });
  
  const filteredLogs = activityLogs?.filter(log => 
    log.admin_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سجل النشاطات</h1>
              <p className="mt-1 text-sm text-gray-600">
                جميع نشاطات المشرفين في النظام
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
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-400 ml-2" />
                    <SelectValue placeholder="جميع النشاطات" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع النشاطات</SelectItem>
                  <SelectItem value="suspend_store">تعليق متجر</SelectItem>
                  <SelectItem value="activate_store">تفعيل متجر</SelectItem>
                  <SelectItem value="delete_store">حذف متجر</SelectItem>
                  <SelectItem value="ban_user">حظر مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">سجل النشاطات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المشرف</TableHead>
                      <TableHead>النشاط</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>معرف الهدف</TableHead>
                      <TableHead>التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center text-gray-500 text-sm">
                            {formatter.date(new Date(log.created_at))}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="font-medium">{log.admin_email || "غير متاح"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionTypeColor(log.action_type)}>
                            <Activity className="h-3 w-3 ml-1" />
                            {getActionTypeLabel(log.action_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center ml-1">
                              {getTargetTypeIcon(log.target_type)}
                            </div>
                            <span className="text-sm">{log.target_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded truncate max-w-[120px]">
                            {log.target_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.details ? (
                              Object.keys(log.details).map(key => (
                                <div key={key} className="mb-1">
                                  <span className="text-gray-600">{key}: </span>
                                  <span>{typeof log.details[key] === 'object' 
                                    ? JSON.stringify(log.details[key]) 
                                    : log.details[key]}
                                  </span>
                                </div>
                              ))
                            ) : (
                              "لا توجد تفاصيل"
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
                <Trash className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد سجلات نشاطات</h3>
                <p className="text-gray-500">لم يتم العثور على سجلات نشاطات مطابقة للفلتر المحدد.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogsPage;
