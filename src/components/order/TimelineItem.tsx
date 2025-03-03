
import React from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  date: Date;
  description?: string;
  icon: React.ElementType | React.ReactNode;
  isLast?: boolean;
}

export function TimelineItem({ title, date, description, icon, isLast = false }: TimelineItemProps) {
  // Determine if the icon is a React component (ElementType) or a React node
  const IconComponent = typeof icon === 'function' ? icon as React.ElementType : null;
  
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
          {IconComponent ? <IconComponent className="h-4 w-4" /> : icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-2"></div>}
      </div>
      <div className={cn("pb-4", isLast ? "" : "pb-6")}>
        <div className="flex items-center">
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="mt-1">
          <time className="text-xs text-muted-foreground" dateTime={date.toISOString()}>
            {format(date, "d MMMM yyyy, HH:mm", { locale: ar })}
          </time>
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
