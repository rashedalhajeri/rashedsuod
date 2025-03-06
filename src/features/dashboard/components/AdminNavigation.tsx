
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, ShoppingBag, ActivitySquare, Users, BarChart4, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthState } from "@/hooks/use-auth-state";
import { useQuery } from "@tanstack/react-query";
import { checkIsAdmin } from "@/utils/auth-utils";

const AdminNavigation = () => {
  const location = useLocation();
  const { userId } = useAuthState();
  
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async () => {
      if (!userId) return false;
      return await checkIsAdmin();
    },
    enabled: !!userId,
  });
  
  // إذا لم يكن المستخدم مشرفًا، لا نعرض القائمة
  if (!isAdmin) {
    return null;
  }
  
  const adminLinks = [
    {
      title: "لوحة المشرف",
      path: "/admin",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "المتاجر",
      path: "/admin/stores",
      icon: <Store className="h-5 w-5" />,
    },
    {
      title: "الطلبات",
      path: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "المشرفون",
      path: "/admin/admins",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "الإحصائيات",
      path: "/admin/statistics",
      icon: <BarChart4 className="h-5 w-5" />,
    },
    {
      title: "سجل النشاطات",
      path: "/admin/activity-logs",
      icon: <ActivitySquare className="h-5 w-5" />,
    }
  ];
  
  return (
    <div className="py-3">
      <div className="px-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          إدارة المنصة
        </h3>
      </div>
      <nav className="space-y-1 px-2">
        {adminLinks.map((link) => {
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {React.cloneElement(link.icon, {
                className: cn(
                  "ml-3 flex-shrink-0 h-5 w-5",
                  isActive ? "text-primary-700" : "text-gray-500 group-hover:text-gray-600"
                ),
              })}
              <span>{link.title}</span>
              
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="mr-auto h-2 w-2 rounded-full bg-primary-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminNavigation;
