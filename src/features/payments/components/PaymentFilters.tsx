
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

const PaymentFilters: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="البحث برقم الطلب أو اسم العميل..." className="pr-10" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentStatus" className="mb-1.5 block text-sm">حالة الدفع</Label>
              <Select defaultValue="all">
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="successful">ناجحة</SelectItem>
                  <SelectItem value="pending">معلقة</SelectItem>
                  <SelectItem value="failed">فاشلة</SelectItem>
                  <SelectItem value="refunded">مستردة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="paymentMethod" className="mb-1.5 block text-sm">طريقة الدفع</Label>
              <Select defaultValue="all">
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="جميع الطرق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="cash_on_delivery">نقد عند الاستلام</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 items-end">
              <Button className="flex-1 gap-1">
                <Filter className="h-4 w-4 ml-1" />
                <span>تطبيق الفلتر</span>
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentFilters;
