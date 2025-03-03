
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface OrderFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

export function OrderFilters({ onSearchChange, onStatusChange, onDateRangeChange }: OrderFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  
  const statuses = [
    { id: "pending", name: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { id: "processing", name: "قيد المعالجة", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { id: "shipped", name: "تم الشحن", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    { id: "delivered", name: "تم التسليم", color: "bg-green-100 text-green-800 border-green-200" },
    { id: "cancelled", name: "ملغي", color: "bg-red-100 text-red-800 border-red-200" },
    { id: "refunded", name: "مسترجع", color: "bg-pink-100 text-pink-800 border-pink-200" },
  ];
  
  const paymentMethods = [
    { id: "cash", name: "نقدي عند الاستلام" },
    { id: "credit_card", name: "بطاقة ائتمان" },
    { id: "mada", name: "مدى" },
    { id: "apple_pay", name: "آبل باي" },
    { id: "stc_pay", name: "STC Pay" },
  ];

  const handleStatusChange = (statusId: string) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusId)) {
        return prev.filter(id => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethods(prev => {
      if (prev.includes(methodId)) {
        return prev.filter(id => id !== methodId);
      } else {
        return [...prev, methodId];
      }
    });
  };

  const handleApplyFilters = () => {
    // Handle status changes
    onStatusChange(selectedStatuses.join(','));
    
    // Handle date range changes
    if (dateRange.from) {
      onDateRangeChange(dateRange.from.toISOString());
    }
    
    // Handle search term
    onSearchChange(searchTerm);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedPaymentMethods([]);
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm("");
    
    // Reset filters in parent component
    onStatusChange("");
    onDateRangeChange("");
    onSearchChange("");
  };
  
  return (
    <motion.div 
      className="space-y-4 py-2 pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label className="text-xs font-medium">البحث في الطلبات</Label>
        <Input
          type="text"
          placeholder="رقم الطلب، اسم العميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">تاريخ الطلب</Label>
        <div className="flex flex-col gap-2">
          <Calendar
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => setDateRange({ ...dateRange, from: date })}
            className="rounded-md border"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">حالة الطلب</Label>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id={`status-${status.id}`} 
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={() => handleStatusChange(status.id)}
              />
              <Label
                htmlFor={`status-${status.id}`}
                className="text-sm font-normal flex items-center cursor-pointer"
              >
                <Badge variant="outline" className={`mr-2 border ${status.color}`}>
                  {status.name}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">طريقة الدفع</Label>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id={`payment-${method.id}`}
                checked={selectedPaymentMethods.includes(method.id)}
                onCheckedChange={() => handlePaymentMethodChange(method.id)}
              />
              <Label
                htmlFor={`payment-${method.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {method.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="flex gap-2">
        <Button className="w-full" onClick={handleApplyFilters} variant="default">
          <Filter className="mr-2 h-4 w-4" />
          تطبيق الفلترة
        </Button>
        
        <Button className="flex-shrink-0" onClick={handleClearFilters} variant="outline">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
