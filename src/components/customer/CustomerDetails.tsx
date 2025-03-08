
import React from "react";
import { Customer, updateCustomer } from "@/services/customer-service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogFooter } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
  currency: string;
  onUpdateStatus: (customerId: string, status: "active" | "inactive") => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ 
  customer, 
  onClose, 
  currency, 
  onUpdateStatus 
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6 rtl">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20 border">
          <AvatarFallback className="bg-primary-50 text-primary-700 text-2xl">
            {customer.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p className="text-gray-500">عميل منذ {formatDate(customer.created_at)}</p>
        </div>
      </div>
      
      <Tabs defaultValue="info" dir="rtl">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="info">معلومات العميل</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                <p className="text-sm font-medium">{customer.email || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="text-sm font-medium">{customer.phone || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">المدينة</p>
                <p className="text-sm font-medium">{customer.city || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">الحالة</p>
                <div className="text-sm font-medium flex items-center mt-1">
                  <Badge
                    variant={customer.status === "active" ? "outline" : "secondary"}
                    className={`
                      ${customer.status === "active" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-200 text-gray-600"}
                    `}
                  >
                    {customer.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 mr-2 text-xs"
                    onClick={() => onUpdateStatus(
                      customer.id, 
                      customer.status === "active" ? "inactive" : "active"
                    )}
                  >
                    تغيير الحالة
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">مجموع الطلبات</p>
              <p className="text-xl font-bold text-primary-700">{customer.total_orders}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
              <p className="text-xl font-bold text-primary-700">{formatCurrency(customer.total_spent)}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">آخر طلب</p>
              <p className="text-lg font-bold text-primary-700">
                {customer.last_order_date 
                  ? formatDate(customer.last_order_date) 
                  : "لا يوجد"}
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="pt-4">
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">لا توجد طلبات سابقة لهذا العميل</p>
            <Button variant="outline" className="mt-2">
              إنشاء طلب جديد
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="pt-4">
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">لا يوجد نشاط مسجل لهذا العميل</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          إغلاق
        </Button>
        <Button>
          تعديل بيانات العميل
        </Button>
      </DialogFooter>
    </div>
  );
};

export default CustomerDetails;
