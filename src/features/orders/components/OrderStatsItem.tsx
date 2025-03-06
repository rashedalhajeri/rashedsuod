
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface OrderStatsItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  href: string;
  hoverBgColor: string;
  index: number;
}

const OrderStatsItem: React.FC<OrderStatsItemProps> = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
  href,
  hoverBgColor,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full"
    >
      <Link to={href} className="block">
        <div className={cn(
          "flex flex-col items-center justify-center p-3 rounded-lg transition-all h-full",
          bgColor,
          hoverBgColor
        )}>
          <div className={cn("p-2 rounded-full mb-2", `${bgColor}/60`)}>
            <span className={textColor}>{icon}</span>
          </div>
          <span className="text-xs font-medium mb-1 text-center">{label}</span>
          <span className={cn("text-lg font-bold", textColor)}>{value}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default OrderStatsItem;
