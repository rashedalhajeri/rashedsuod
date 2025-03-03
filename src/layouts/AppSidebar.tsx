
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavigationMenu from "@/features/dashboard/components/NavigationMenu";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  List,
  Percent,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Store,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { secureRemove } from "@/lib/encryption";
import { toast } from "sonner";

interface AppSidebarProps {
  storeData?: any;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ storeData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      secureRemove('user-id');
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const mainMenuItems = [
    {
      title: "الرئيسية",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "نظرة عامة على متجرك",
    },
    {
      title: "الطلبات",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      description: "إدارة طلبات العملاء",
    },
    {
      title: "المنتجات",
      href: "/dashboard/products",
      icon: Package,
      description: "إدارة منتجات متجرك",
    },
    {
      title: "العملاء",
      href: "/dashboard/customers",
      icon: Users,
      description: "إدارة قاعدة عملائك",
    },
    {
      title: "الفئات",
      href: "/dashboard/categories",
      icon: List,
      description: "تنظيم منتجاتك بالفئات",
    },
    {
      title: "كوبونات خصم",
      href: "/dashboard/coupons",
      icon: Percent,
      description: "إدارة العروض والخصومات",
    },
    {
      title: "نظام الدفع",
      href: "/dashboard/payments",
      icon: CreditCard,
      description: "إدارة طرق الدفع",
    },
  ];

  const settingsMenuItems = [
    {
      title: "الإعدادات",
      href: "/dashboard/settings",
      icon: Settings,
      description: "إعدادات المتجر والحساب",
    },
  ];

  // استخدام className للتحكم في عرض/إخفاء المحتوى بدلاً من onExpand/onCollapse
  return (
    <Sidebar className={isExpanded ? "w-64" : "w-20"}>
      <SidebarHeader className="border-b py-3.5 px-3">
        <div className="flex items-center justify-between">
          {isExpanded ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded text-white">
                <Store className="h-5 w-5" />
              </div>
              <div className="font-semibold">
                {storeData?.store_name || "متجري"}
              </div>
            </Link>
          ) : (
            <div className="bg-primary p-1 rounded text-white">
              <Store className="h-5 w-5" />
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <div className="space-y-4 py-2">
          <NavigationMenu
            items={mainMenuItems}
            expanded={isExpanded}
            currentPath={location.pathname}
          />
          <NavigationMenu
            items={settingsMenuItems}
            expanded={isExpanded}
            currentPath={location.pathname}
            title="الإعدادات"
          />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t py-3 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                مستخدم
              </AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">المستخدم</span>
                <span className="text-xs text-muted-foreground">مالك المتجر</span>
              </div>
            )}
          </div>
          {isExpanded ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/profile">
                    <Avatar className="h-4 w-4 mr-2">
                      <AvatarFallback className="text-[10px]">م</AvatarFallback>
                    </Avatar>
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/store">
                    <Store className="h-4 w-4 mr-2" />
                    إعدادات المتجر
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
