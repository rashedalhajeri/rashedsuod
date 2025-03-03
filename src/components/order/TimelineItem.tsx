
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TimelineItemProps {
  title: string;
  description: string;
  icon: React.ElementType; // Changed from ReactNode to ElementType
  date: string;
  active?: boolean;
  last?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  icon: Icon, // Using ElementType properly
  date,
  active = false,
  last = false,
}) => {
  return (
    <div className="relative">
      <div className="flex items-start mb-4">
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-full p-2 mr-3 shadow-sm",
              active ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400"
            )}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium", active ? "text-primary-700" : "text-gray-700")}>
            {title}
          </h4>
          <div className="text-xs text-gray-500">{date}</div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {!last && (
        <div className="absolute top-0 right-4 bottom-0 flex justify-center">
          <div className={cn("w-0.5 h-full", active ? "bg-primary-500" : "bg-gray-200")}></div>
        </div>
      )}
    </div>
  );
};

export default TimelineItem;
