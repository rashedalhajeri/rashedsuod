
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Tags, ShoppingBag, Settings, BarChart4, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const QuickActions: React.FC = () => {
  const actionItems = [
    {
      icon: <Package className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />,
      label: "إضافة منتج",
      path: "/dashboard/products/new",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Tags className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />,
      label: "إدارة التصنيفات",
      path: "/dashboard/categories",
      bgColor: "bg-orange-50"
    },
    {
      icon: <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-green-500" />,
      label: "تتبع الطلبات",
      path: "/dashboard/orders",
      bgColor: "bg-green-50"
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />,
      label: "العملاء",
      path: "/dashboard/customers",
      bgColor: "bg-purple-50"
    },
    {
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-pink-500" />,
      label: "المدفوعات",
      path: "/dashboard/payments",
      bgColor: "bg-pink-50"
    },
    {
      icon: <BarChart4 className="h-5 w-5 md:h-6 md:w-6 text-cyan-500" />,
      label: "الإحصائيات",
      path: "/dashboard",
      bgColor: "bg-cyan-50"
    },
    {
      icon: <Settings className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />,
      label: "إعدادات المتجر",
      path: "/dashboard/settings",
      bgColor: "bg-gray-50"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {actionItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Button 
            asChild 
            variant="outline" 
            className={`h-auto py-4 w-full border-gray-200 hover:border-primary-200 hover:bg-primary-50 ${item.bgColor}`}
          >
            <Link to={item.path} className="flex flex-col items-center gap-2">
              {item.icon}
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
