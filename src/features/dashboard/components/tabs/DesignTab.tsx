
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaintBucket } from "lucide-react";
import StoreThemes from "@/features/dashboard/components/StoreThemes";

interface DesignTabProps {
  storeId?: string;
}

const DesignTab: React.FC<DesignTabProps> = ({ storeId }) => {
  return (
    <div className="space-y-4">
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaintBucket className="h-5 w-5 text-primary" />
            <span>تصميم المتجر</span>
          </CardTitle>
          <CardDescription>قم بتخصيص مظهر متجرك وثيم التصميم الذي يناسب علامتك التجارية</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreThemes storeId={storeId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignTab;
