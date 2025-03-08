import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparklineData?: number[];
}
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconClassName,
  trend,
  sparklineData
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="w-full">
      <Card className="overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-200 hover:shadow-md group h-full">
        <CardContent className="p-4 md:p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5 -mr-6 -mt-6">
            {icon}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <h4 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{value}</h4>
              
              {trend && <p className={`text-xs flex items-center mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} gap-1`}>
                  {trend.isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>
                    {trend.value}%
                  </span>
                  <span className="text-gray-500">
                    {trend.isPositive ? 'زيادة' : 'انخفاض'}
                  </span>
                </p>}
            </div>
            
            <div className={cn("p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110", iconClassName || "bg-primary-100 text-primary-600")}>
              {icon}
            </div>
          </div>
          
          {sparklineData && sparklineData.length > 0}
        </CardContent>
      </Card>
    </motion.div>;
};
export default StatsCard;