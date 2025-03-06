
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "@/hooks/use-auth-state";
import { checkIsAdmin } from "@/utils/auth-utils";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const AdminLayout = () => {
  const { userId, authenticated, loading } = useAuthState();
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async () => {
      if (!userId) return false;
      return await checkIsAdmin();
    },
    enabled: !!userId && authenticated,
  });
  
  // إذا كان المستخدم قيد التحميل أو التحقق من صلاحياته، نعرض حالة التحميل
  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">جاري التحقق من الصلاحيات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // إذا كان المستخدم غير مصرح له، نعرض رسالة خطأ
  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-800">غير مصرح لك</h2>
            </div>
            <p className="text-red-700 mb-4">
              عذراً، ليس لديك صلاحيات كافية للوصول إلى لوحة تحكم المشرفين. هذا القسم مخصص فقط للمشرفين المعتمدين في النظام.
            </p>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              العودة للخلف
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // إذا كان مصرح له، نعرض محتوى لوحة التحكم
  return <Outlet />;
};

export default AdminLayout;
