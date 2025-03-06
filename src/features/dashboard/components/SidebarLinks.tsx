
import React from "react";
import { LayoutDashboard, ShoppingBag, Package, Tags, Users, CreditCard, Settings, FileText, Palette } from "lucide-react";
import SidebarLink from "./SidebarLink";

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
      path: "/dashboard/store-design",
      icon: <Palette size={20} />,
      label: "تصميم المتجر"
    },
    {
      path: "/dashboard/settings",
      icon: <Settings size={20} />,
      label: "الإعدادات"
    }
  ];

  const getIsActive = (path: string) => {
    return currentPath === path;
  };

  return (
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
  );
};

export default SidebarLinks;
