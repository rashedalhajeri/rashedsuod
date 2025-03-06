
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { fetchUniquePaymentMethods } from "@/services/payments";
import { useQuery } from "@tanstack/react-query";
import { useStoreData } from "@/hooks/use-store-data";
import DatePicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types";

interface PaymentFiltersProps {
  onFilterChange: (filters: {
    status: string;
    paymentMethod: string;
    searchQuery: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onReset: () => void;
  initialValues?: {
    status: string;
    paymentMethod: string;
    searchQuery: string;
    startDate?: string;
    endDate?: string;
  };
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  onFilterChange,
  onReset,
  initialValues = {
    status: "all",
    paymentMethod: "all",
    searchQuery: "",
    startDate: "",
    endDate: ""
  }
}) => {
  const { data: storeData } = useStoreData();
  const [status, setStatus] = useState(initialValues.status);
  const [paymentMethod, setPaymentMethod] = useState(initialValues.paymentMethod);
  const [searchQuery, setSearchQuery] = useState(initialValues.searchQuery);
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: initialValues.startDate ? new Date(initialValues.startDate) : null,
    endDate: initialValues.endDate ? new Date(initialValues.endDate) : null
  });
  
  // استرجاع طرق الدفع المتاحة
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['uniquePaymentMethods', storeData?.id],
    queryFn: () => fetchUniquePaymentMethods(storeData?.id || ''),
    enabled: !!storeData?.id,
  });
  
  // استرجاع طرق الدفع المتاحة
  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "successful", label: "ناجحة" },
    { value: "pending", label: "معلقة" },
    { value: "failed", label: "فاشلة" },
    { value: "refunded", label: "مستردة" }
  ];
  
  // تحديث حالة الفلترة عند تغيير الإدخالات
  useEffect(() => {
    onFilterChange({
      status,
      paymentMethod,
      searchQuery,
      startDate: dateRange?.startDate ? new Date(dateRange.startDate as Date).toISOString() : undefined,
      endDate: dateRange?.endDate ? new Date(dateRange.endDate as Date).toISOString() : undefined
    });
  }, [status, paymentMethod, searchQuery, dateRange]);
  
  // إعادة تعيين جميع الفلاتر
  const handleReset = () => {
    setStatus("all");
    setPaymentMethod("all");
    setSearchQuery("");
    setDateRange({ startDate: null, endDate: null });
    onReset();
  };
  
  // التعامل مع تغيير نطاق التاريخ
  const handleDateRangeChange = (newDateRange: DateValueType) => {
    setDateRange(newDateRange);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      <Card className="mb-6 border-gray-200">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* فلتر البحث */}
            <div>
              <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">
                بحث
              </Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="اسم العميل، البريد، الرقم..."
                  className="pl-3 pr-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* فلتر الحالة */}
            <div>
              <Label htmlFor="status" className="text-sm font-medium mb-1.5 block">
                الحالة
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* فلتر طريقة الدفع */}
            <div>
              <Label htmlFor="paymentMethod" className="text-sm font-medium mb-1.5 block">
                طريقة الدفع
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod" className="w-full">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* فلتر التاريخ */}
            <div className="lg:col-span-2">
              <Label htmlFor="dateRange" className="text-sm font-medium mb-1.5 block">
                نطاق التاريخ
              </Label>
              <div className="datepicker-container" dir="ltr">
                <DatePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  showShortcuts={true}
                  primaryColor="indigo"
                  containerClassName="w-full"
                  inputClassName="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  toggleClassName="absolute left-0 h-full px-3 text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>إعادة تعيين</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentFilters;
