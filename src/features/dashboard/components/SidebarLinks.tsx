
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags, 
  Users, 
  Settings, 
  FileText, 
  Store 
} from "lucide-react";
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
  // Group the sidebar links by category
  const sidebarLinkGroups = [
    {
      title: "الرئيسية",
      links: [
        {
          path: "/dashboard",
          icon: <LayoutDashboard size={20} />,
          label: "لوحة التحكم"
        }
      ]
    },
    {
      title: "المتجر",
      links: [
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
          path: "/dashboard/my-store",
          icon: <Store size={20} />,
          label: "متجري"
        }
      ]
    },
    {
      title: "النظام",
      links: [
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
      ]
    }
  ];

  return (
    <div className="flex-1 py-3 px-2 overflow-y-auto">
      {sidebarLinkGroups.map((group, groupIndex) => (
        <div key={group.title} className={groupIndex > 0 ? "mt-6" : ""}>
          {(!isCollapsed || isMobile) && (
            <h2 className="px-3 text-xs font-semibold text-gray-500 mb-2">{group.title}</h2>
          )}
          <div className="space-y-1">
            {group.links.map((link) => (
              <div key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-medium",
                      isActive
                        ? "bg-primary-50 text-primary-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-primary-600",
                      isCollapsed && !isMobile && "justify-center px-2"
                    )
                  }
                  end={link.path === "/dashboard"}
                >
                  <span className={cn(
                    "flex items-center justify-center rounded-md text-inherit",
                    isCollapsed && !iMobile ? "w-9 h-9 bg-gray-100" : ""
                  )}>
                    {link.icon}
                  </span>
                  {(!isCollapsed || isMobile) && (
                    <span>{link.label}</span>
                  )}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarLinks;
