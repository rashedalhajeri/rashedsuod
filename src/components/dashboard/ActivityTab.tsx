
import React from "react";
import { Bell, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityTab: React.FC = () => {
  return (
    <Card className="border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="flex items-center">
          <Bell className="inline-block ml-2 h-5 w-5 text-primary-500" />
          النشاط الأخير
        </CardTitle>
        <CardDescription>سجل نشاط متجرك خلال الأيام الأخيرة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-white rounded-lg mt-4">
          <Activity className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد أنشطة بعد</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            ستظهر هنا سجلات الأنشطة الجديدة مثل الطلبات والعملاء وغيرها.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
