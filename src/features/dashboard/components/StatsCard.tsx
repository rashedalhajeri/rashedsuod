
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
  isCurrency?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconClassName,
  trend,
  sparklineData,
  isCurrency = false
}) => {
  // Handle currency display with smaller currency symbol
  const renderValue = () => {
    if (isCurrency && typeof value === 'string') {
      // Find the currency symbol and separate it from the number
      const match = value.match(/^([^\d]+)(.+)$/);
      
      if (match) {
        const [_, currencySymbol, amount] = match;
        return (
          <>
            <span className="text-xs align-super mr-0.5 opacity-65">{currencySymbol}</span>
            <span className="text-lg md:text-xl">{amount}</span>
          </>
        );
      }
    }
    
    return value;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-200 hover:shadow-md group h-full">
        <CardContent className="p-4 md:p-6 relative">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className={cn(
                "p-1.5 rounded-md shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110 mr-2",
                iconClassName || "bg-primary-100 text-primary-600"
              )}>
                {React.cloneElement(icon as React.ReactElement, { className: 'h-3.5 w-3.5' })}
              </div>
            </div>
            
            <h4 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 ${isCurrency ? 'flex items-baseline' : 'text-xl md:text-2xl'}`}>
              {renderValue()}
            </h4>
            
            {trend && (
              <p className={`text-xs flex items-center mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} gap-1`}>
                {trend.isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>
                  {trend.value}%
                </span>
                <span className="text-gray-500">
                  {trend.isPositive ? 'زيادة' : 'انخفاض'}
                </span>
              </p>
            )}
          </div>
          
          {sparklineData && sparklineData.length > 0 && (
            // Here you could add a mini sparkline chart if needed
            <div className="mt-3 h-8">
              {/* Sparkline chart would go here */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
