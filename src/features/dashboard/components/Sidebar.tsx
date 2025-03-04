import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, ShoppingBag, Package, Tags, Users, 
  CreditCard, Settings, ChevronLeft, ChevronRight, LogOut, 
  BarChart3, Menu, FileText, MessageSquare, HelpCircle, 
  ChevronDown, Home, Star, AlertTriangle, Info
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
  badge?: number;
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  defaultOpen?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  badge
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200", 
        isActive 
          ? "bg-primary-100 text-primary-700 font-medium" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      )} 
      onClick={onClick}
    >
      <div className={cn("min-w-6 flex items-center justify-center", isActive && "text-primary-600")}>
        {icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="font-medium flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <div className="bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 text-xs font-semibold">
              {badge}
            </div>
          )}
        </>
      )}
      {isCollapsed && badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {badge}
        </div>
      )}
    </Link>
  );
};

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  children, 
  isCollapsed,
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (isCollapsed) {
    return (
      <div className="mb-2">
        {React.Children.map(children, (child) => child)}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button 
        className="flex items-center justify-between w-full py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform", 
            isOpen ? "" : "-rotate-90"
          )} 
        />
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { signOut } = useContext(AuthContext);

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
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/dashboard";
  };

  const handleLogout = async () => {
    await signOut();
  };

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
      {/* Mobile Menu Button - Always Visible on Mobile */}
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

      {/* Sidebar - Responsive */}
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
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-1">
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

          {/* Navigation Links */}
          <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto custom-scrollbar">
            {/* Main Section */}
            <SidebarSection title="الرئيسية" isCollapsed={isCollapsed}>
              <SidebarLink 
                to="/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label="لوحة التحكم" 
                isActive={getIsActive("/dashboard") && location.pathname === "/dashboard"} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/" 
                icon={<Home size={20} />} 
                label="الموقع الرئيسي" 
                isActive={false} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
            </SidebarSection>
            
            {/* Store Section */}
            <SidebarSection title="المتجر" isCollapsed={isCollapsed}>
              <SidebarLink 
                to="/dashboard/orders" 
                icon={<ShoppingBag size={20} />} 
                label="الطلبات" 
                isActive={getIsActive("/dashboard/orders")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
                badge={3}
              />
              <SidebarLink 
                to="/dashboard/products" 
                icon={<Package size={20} />} 
                label="المنتجات" 
                isActive={getIsActive("/dashboard/products")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/categories" 
                icon={<Tags size={20} />} 
                label="التصنيفات" 
                isActive={getIsActive("/dashboard/categories")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/customers" 
                icon={<Users size={20} />} 
                label="العملاء" 
                isActive={getIsActive("/dashboard/customers")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
            </SidebarSection>
            
            {/* Finance Section */}
            <SidebarSection title="المالية" isCollapsed={isCollapsed}>
              <SidebarLink 
                to="/dashboard/payments" 
                icon={<CreditCard size={20} />} 
                label="المدفوعات" 
                isActive={getIsActive("/dashboard/payments")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/reports" 
                icon={<BarChart3 size={20} />} 
                label="التقارير" 
                isActive={getIsActive("/dashboard/reports")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/coupons" 
                icon={<FileText size={20} />} 
                label="الكوبونات" 
                isActive={getIsActive("/dashboard/coupons")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
            </SidebarSection>
            
            {/* Other Section */}
            <SidebarSection title="أخرى" isCollapsed={isCollapsed}>
              <SidebarLink 
                to="/dashboard/support" 
                icon={<MessageSquare size={20} />} 
                label="الدعم" 
                isActive={getIsActive("/dashboard/support")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/settings" 
                icon={<Settings size={20} />} 
                label="الإعدادات" 
                isActive={getIsActive("/dashboard/settings")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
            </SidebarSection>

            {/* Admin Section - Conditionally Rendered */}
            {/* <SidebarSection title="إدارة" isCollapsed={isCollapsed} defaultOpen={false}>
              <SidebarLink 
                to="/dashboard/admin/users" 
                icon={<Users size={20} />} 
                label="المستخدمين" 
                isActive={getIsActive("/dashboard/admin/users")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
              <SidebarLink 
                to="/dashboard/admin/settings" 
                icon={<Settings size={20} />} 
                label="إعدادات النظام" 
                isActive={getIsActive("/dashboard/admin/settings")} 
                isCollapsed={isCollapsed} 
                onClick={closeMobileMenu} 
              />
            </SidebarSection> */}
          </div>

          {/* Help Section - Optional */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">تحتاج مساعدة؟</h4>
                    <p className="text-xs text-gray-500 mt-1">اتصل بفريق الدعم أو قم بزيارة مركز المساعدة</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Footer with Logout */}
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
