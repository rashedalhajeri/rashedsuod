
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title,
  value,
  icon,
  trend,
  trendLabel = "منذ الشهر الماضي",
  className,
  valueClassName,
  iconClassName
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
              
              {trend && (
                <div className="flex items-center mt-1">
                  <span className={cn(
                    "text-xs inline-flex items-center",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground mr-1">
                    {trendLabel}
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              iconClassName || "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
