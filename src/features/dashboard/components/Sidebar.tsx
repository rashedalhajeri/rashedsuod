import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Package, Tags, Users, CreditCard, Settings, ChevronLeft, ChevronRight, LogOut, Menu, FileText } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  isActive,
  isCollapsed,
  onClick
}) => {
  return <Link to={to} className={cn("flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200", isActive ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100")} onClick={onClick}>
      <div className={cn("min-w-6 flex items-center justify-center", isActive && "text-primary-600")}>
        {icon}
      </div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    signOut
  } = useContext(AuthContext);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
  };

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
      label: "التصنيفات"
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

  const sidebarVariants = {
    expanded: {
      width: 250
    },
    collapsed: {
      width: 80
    }
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md bg-white"
            onClick={handleMobileToggle}
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      <motion.div
        className={cn(
          "fixed top-0 right-0 h-screen bg-white shadow-md z-40 overflow-hidden rtl flex flex-col",
          isMobile ? "border-none" : "border-l border-gray-200",
          isMobile && !isMobileOpen ? "-right-80" : "right-0"
        )}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary-500">Linok</span>
                  <span className="text-sm font-medium text-gray-500">.me</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleToggleSidebar}
              >
                {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </Button>
            </div>
          </div>

          <div className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
            {sidebarLinks.map(link => (
              <SidebarLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                label={link.label}
                isActive={getIsActive(link.path)}
                isCollapsed={isCollapsed}
                onClick={closeMobileMenu}
              />
            ))}
          </div>

          {!isCollapsed}

          <div className="p-4 border-t border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <LogOut size={18} className="mr-2" />
                  {!isCollapsed && <span>تسجيل الخروج</span>}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    تسجيل الخروج
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
