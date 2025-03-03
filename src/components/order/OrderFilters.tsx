
import React from "react";
import { CalendarRange, Package, CreditCard, TruckIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OrderFilters() {
  return (
    <Card>
      <CardContent className="p-3 grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date-range" className="flex items-center text-xs">
              <CalendarRange className="h-3 w-3 ml-1" />
              نطاق التاريخ
            </Label>
            <div className="flex gap-2 items-center">
              <Input 
                id="date-from"
                type="date" 
                className="text-xs h-8" 
              />
              <span className="text-xs text-muted-foreground">إلى</span>
              <Input 
                id="date-to"
                type="date" 
                className="text-xs h-8" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-method" className="flex items-center text-xs">
              <CreditCard className="h-3 w-3 ml-1" />
              طريقة الدفع
            </Label>
            <select 
              id="payment-method"
              className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs"
            >
              <option value="">الكل</option>
              <option value="credit-card">بطاقة ائتمان</option>
              <option value="cod">الدفع عند الاستلام</option>
              <option value="bank-transfer">تحويل بنكي</option>
              <option value="wallet">محفظة إلكترونية</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="price-range" className="flex items-center text-xs">
              <Package className="h-3 w-3 ml-1" />
              نطاق السعر
            </Label>
            <div className="flex gap-2 items-center">
              <Input 
                id="price-min"
                type="number" 
                placeholder="الحد الأدنى"
                className="text-xs h-8" 
              />
              <span className="text-xs text-muted-foreground">إلى</span>
              <Input 
                id="price-max"
                type="number" 
                placeholder="الحد الأقصى"
                className="text-xs h-8" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shipping-method" className="flex items-center text-xs">
              <TruckIcon className="h-3 w-3 ml-1" />
              شركة الشحن
            </Label>
            <select 
              id="shipping-method"
              className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs"
            >
              <option value="">الكل</option>
              <option value="dhl">DHL</option>
              <option value="aramex">Aramex</option>
              <option value="fedex">FedEx</option>
              <option value="other">أخرى</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 space-x-reverse mt-1">
          <Button variant="ghost" size="sm" className="h-8 text-xs">إعادة تعيين</Button>
          <Button size="sm" className="h-8 text-xs">تطبيق الفلتر</Button>
        </div>
      </CardContent>
    </Card>
  );
}
