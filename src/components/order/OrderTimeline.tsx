
import React from "react";
import { motion } from "framer-motion";
import { TimelineItem } from "./TimelineItem";
import { Package, Truck, CheckCircle, AlertCircle, CreditCard } from "lucide-react";

interface Order {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  items: number;
}

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  const getTimelineEvents = () => {
    const events = [
      {
        title: "تم استلام الطلب",
        date: order.createdAt,
        description: `تم استلام طلب من ${order.customer.name} بقيمة ${order.total.toFixed(2)} ريال`,
        icon: Package
      }
    ];

    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      events.push({
        title: "قيد المعالجة",
        date: new Date(order.createdAt.getTime() + 1000 * 60 * 60 * 2), // 2 hours after order
        description: "تم تأكيد الطلب وهو الآن قيد المعالجة",
        icon: CreditCard
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      events.push({
        title: "تم الشحن",
        date: new Date(order.createdAt.getTime() + 1000 * 60 * 60 * 24), // 1 day after order
        description: "تم شحن الطلب وهو الآن في الطريق",
        icon: Truck
      });
    }

    if (order.status === "delivered") {
      events.push({
        title: "تم التسليم",
        date: new Date(order.createdAt.getTime() + 1000 * 60 * 60 * 24 * 3), // 3 days after order
        description: "تم تسليم الطلب بنجاح",
        icon: CheckCircle
      });
    }

    if (order.status === "cancelled") {
      events.push({
        title: "تم إلغاء الطلب",
        date: order.updatedAt,
        description: "تم إلغاء الطلب",
        icon: AlertCircle
      });
    }

    return events;
  };

  const timelineEvents = getTimelineEvents();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2 py-2"
    >
      {timelineEvents.map((event, index) => (
        <motion.div key={index} variants={item}>
          <TimelineItem
            title={event.title}
            date={event.date}
            description={event.description}
            icon={event.icon}
            isLast={index === timelineEvents.length - 1}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
