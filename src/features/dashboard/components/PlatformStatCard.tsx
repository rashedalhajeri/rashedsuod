
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlatformStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  iconClassName?: string;
  delay?: number;
}

const PlatformStatCard: React.FC<PlatformStatCardProps> = ({
  title,
  value,
  icon,
  description,
  iconClassName,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className="w-full"
    >
      <Card className="hover:border-primary-200 transition-colors h-full">
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <h4 className="text-xl md:text-2xl font-bold">{value}</h4>
              
              {description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {description}
                </p>
              )}
            </div>
            
            <div
              className={cn(
                "p-2 rounded-full",
                iconClassName || "bg-primary-100 text-primary-600"
              )}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlatformStatCard;
