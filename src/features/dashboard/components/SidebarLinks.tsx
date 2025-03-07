
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Tags, Users, CreditCard, Settings, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarLinksProps {
  isCollapsed: boolean;
  isMobile: boolean;
  currentPath: string;
  closeMobileMenu: () => void;
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({
  isCollapsed,
  isMobile,
  currentPath,
  closeMobileMenu
}) => {
  const sidebarLinks = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "لوحة التحكم"
    },
    {
      path: "/dashboard/orders",
      icon: <ShoppingBag size={20} />,
      label: "الطلبات"
    },
    {
      path: "/dashboard/products",
      icon: <Package size={20} />,
      label: "المنتجات"
    },
    {
      path: "/dashboard/categories",
      icon: <Tags size={20} />,
      label: "الفئات والأقسام"
    },
    {
      path: "/dashboard/customers",
      icon: <Users size={20} />,
      label: "العملاء"
    },
    {
      path: "/dashboard/payments",
      icon: <CreditCard size={20} />,
      label: "المدفوعات"
    },
    {
      path: "/dashboard/coupons",
      icon: <FileText size={20} />,
      label: "الكوبونات"
    },
    {
      path: "/dashboard/settings",
      icon: <Settings size={20} />,
      label: "الإعدادات"
    }
  ];

  // Use staggered entrance animation for links
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex-1 py-3 px-2 space-y-1 overflow-y-auto"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {sidebarLinks.map((link, index) => (
        <motion.div key={link.path} variants={itemVariants}>
          <NavLink
            to={link.path}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary-100 text-primary-800"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-700",
                isCollapsed && !isMobile && "justify-center px-2"
              )
            }
            end={link.path === "/dashboard"}
          >
            <span className="text-inherit">{link.icon}</span>
            {(!isCollapsed || isMobile) && (
              <span>{link.label}</span>
            )}
          </NavLink>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SidebarLinks;
