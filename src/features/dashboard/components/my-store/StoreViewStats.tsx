
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye } from "lucide-react";

const StoreViewStats: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-primary" />
          إحصائيات المعاينة
        </CardTitle>
        <CardDescription className="text-xs">
          عدد مرات معاينة متجرك خلال الأسبوع الماضي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/20">
          <div className="text-2xl font-bold text-primary">24</div>
          <div className="text-xs text-muted-foreground">معاينة</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreViewStats;
