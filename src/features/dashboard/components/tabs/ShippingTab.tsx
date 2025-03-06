
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import ShippingMethodForm from "@/features/dashboard/components/ShippingMethodForm";

interface ShippingTabProps {
  isPaidPlan: boolean;
}

const ShippingTab: React.FC<ShippingTabProps> = ({ isPaidPlan }) => {
  return (
    <div className="space-y-4">
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span>إعدادات الشحن والتوصيل</span>
          </CardTitle>
          <CardDescription>قم بتخصيص طرق الشحن المتاحة لعملائك وتحديد التكاليف ومناطق التوصيل</CardDescription>
        </CardHeader>
        <CardContent>
          <ShippingMethodForm isPaidPlan={isPaidPlan} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingTab;
