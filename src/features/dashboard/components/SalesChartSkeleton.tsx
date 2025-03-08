
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SalesChartSkeleton: React.FC = () => {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-1">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="flex justify-center mt-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-4 w-14" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChartSkeleton;
