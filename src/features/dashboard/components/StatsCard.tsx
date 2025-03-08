
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  // Handle currency display with currency symbol at the end
  const renderValue = () => {
    if (isCurrency && typeof value === 'string') {
      // Find the currency symbol and separate it from the number
      const match = value.match(/^([^\d]+)(.+)$/);
      
      if (match) {
        const [_, currencySymbol, amount] = match;
        return (
          <div className="flex justify-center items-center relative">
            <span className="text-xl md:text-2xl">{amount}</span>
            <span className="text-xs opacity-60 mr-1 ml-1">{currencySymbol}</span>
          </div>
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
              <div className={cn(
                "p-1.5 rounded-md shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110 mr-2",
                iconClassName || "bg-primary-100 text-primary-600"
              )}>
                {React.cloneElement(icon as React.ReactElement, { className: 'h-3.5 w-3.5' })}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            
            <div className="text-center">
              <h4 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 ${isCurrency ? 'inline-flex justify-center' : 'text-xl md:text-2xl'}`}>
                {renderValue()}
              </h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
