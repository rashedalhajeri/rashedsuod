
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Filter, CalendarRange, Check } from "lucide-react";

export function OrderFilters({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) {
  // Placeholder implementation
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  const statuses = [
    { id: "pending", name: "قيد الانتظار", color: "yellow" },
    { id: "processing", name: "قيد المعالجة", color: "blue" },
    { id: "shipped", name: "تم الشحن", color: "indigo" },
    { id: "delivered", name: "تم التسليم", color: "green" },
    { id: "cancelled", name: "ملغي", color: "red" },
    { id: "refunded", name: "مسترجع", color: "pink" },
  ];
  
  const paymentMethods = [
    { id: "cash", name: "نقدي عند الاستلام" },
    { id: "credit_card", name: "بطاقة ائتمان" },
    { id: "mada", name: "مدى" },
    { id: "apple_pay", name: "آبل باي" },
    { id: "stc_pay", name: "STC Pay" },
  ];
  
  return (
    <div className="space-y-4 py-2 pb-6">
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
              <Checkbox id={`status-${status.id}`} />
              <Label
                htmlFor={`status-${status.id}`}
                className="text-sm font-normal flex items-center cursor-pointer"
              >
                <Badge variant="outline" className="mr-2 border-gray-200">
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
              <Checkbox id={`payment-${method.id}`} />
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
      <Button className="w-full" onClick={() => onApplyFilters({})}>
        <Filter className="mr-2 h-4 w-4" />
        تطبيق الفلترة
      </Button>
    </div>
  );
}
