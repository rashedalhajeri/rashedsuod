
import React from "react";
import { 
  Package, TrendingUp, ArrowDown, ArrowUp, 
  ShoppingBag, CheckCircle2, TruckIcon, Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function OrderStats() {
  // Mock stats data
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: "125",
      change: "+12%",
      increasing: true,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "طلبات جديدة",
      value: "24",
      change: "+8%",
      increasing: true,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "قيد المعالجة",
      value: "36",
      change: "-3%",
      increasing: false,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "تم التسليم",
      value: "87",
      change: "+15%",
      increasing: true,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const StatIcon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="flex items-center p-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bgColor} mr-4`}>
                <StatIcon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="flex items-center">
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                  <div className={`ml-2 flex items-center text-xs font-medium ${stat.increasing ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.increasing ? (
                      <ArrowUp className="h-3 w-3 ml-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-0.5" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
