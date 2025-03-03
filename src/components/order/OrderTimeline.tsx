import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, Circle, Clock, Package, Truck } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  orderId: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-pink-100 text-pink-800 border-pink-200"
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: CalendarDays,
  refunded: CalendarDays
};

const statusTranslations = {
  pending: "قيد الانتظار",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
  refunded: "مسترجع"
};

export function OrderTimeline({ events, orderId }: OrderTimelineProps) {
  const formatTimelineDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMMM yyyy", { locale: ar });
    } catch (error) {
      console.error("Error formatting timeline date:", error);
      return dateStr; // Return the original string if there's an error
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-gray-200"></div>
      <ul className="space-y-6">
        {events.map((event, index) => {
          const StatusIcon = statusIcons[event.status as keyof typeof statusIcons] || CalendarDays;
          return (
            <li key={index} className="ml-8">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex-shrink-0">
                  <StatusIcon className="h-5 w-5 text-gray-500" />
                </div>
                <time className="text-sm font-normal leading-none text-gray-500">
                  {formatTimelineDate(event.date)}
                </time>
              </div>
              <div className="mt-2 space-y-3">
                <Badge variant="outline" className={`inline-flex items-center border ${statusColors[event.status as keyof typeof statusColors]}`}>
                  {statusTranslations[event.status as keyof typeof statusTranslations]}
                </Badge>
                <p className="text-base font-semibold text-gray-900">{event.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
