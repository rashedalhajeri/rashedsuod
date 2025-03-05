
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck } from "lucide-react";
import ShippingMethodForm from "@/features/dashboard/components/ShippingMethodForm";

interface ShippingSettingsProps {
  storeData: any;
}

const ShippingSettings: React.FC<ShippingSettingsProps> = ({ storeData }) => {
  const subscriptionType = storeData?.subscription_plan || "free";
  const isPaidPlan = subscriptionType !== "free";
  
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

export default ShippingSettings;
