
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Package, Tags, Users, CreditCard, Settings, ChevronLeft, ChevronRight, LogOut, Menu, FileText, X } from "lucide-react";
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

interface SidebarProps {
  isMobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const {
    signOut
  } = useContext(AuthContext);

  // إعادة تعيين حالة القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    setIsCollapsed(isMobile && !isMobileMenuOpen);
  }, [isMobile, isMobileMenuOpen]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      // فقط إغلاق في حال العرض المحمول
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
    },
    mobile: {
      width: "100%",
      maxWidth: 280
    }
  };

  // تحديد النمط المناسب للقائمة الجانبية
  const currentVariant = isMobile 
    ? "mobile" 
    : isCollapsed 
      ? "collapsed" 
      : "expanded";

  return (
    <AnimatePresence>
      {/* طبقة التعتيم عند فتح القائمة في الجوال */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileMenu}
        />
      )}

      <motion.div
        className={cn(
          "fixed top-0 right-0 h-screen bg-white shadow-md z-40 overflow-hidden rtl flex flex-col",
          isMobile ? "border-none" : "border-l border-gray-200"
        )}
        initial={false}
        animate={currentVariant}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        style={{ 
          right: isMobile && !isMobileMenuOpen ? "-100%" : 0,
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {(!isCollapsed || isMobile) && (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary-500">Linok</span>
                  <span className="text-sm font-medium text-gray-500">.me</span>
                </div>
              )}
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={closeMobileMenu}
                >
                  <X size={18} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleToggleSidebar}
                >
                  {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </Button>
              )}
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
                isCollapsed={isCollapsed && !isMobile}
                onClick={closeMobileMenu}
              />
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
                    isCollapsed && !isMobile && "justify-center px-2"
                  )}
                >
                  <LogOut size={18} className="mr-2" />
                  {(!isCollapsed || isMobile) && <span>تسجيل الخروج</span>}
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
    </AnimatePresence>
  );
};

export default Sidebar;
