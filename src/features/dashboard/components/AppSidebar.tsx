
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  CreditCard, Tag, ChevronRight, Store, LogOut, BarChart, Bell, Gift, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Navigation menus
import NavigationMenu from "./NavigationMenu";

interface AppSidebarProps {
  storeData: any;
  onLogout: () => Promise<void>;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ storeData, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { expanded } = useSidebar();
  
  // حل مشكلة التنقل - استخدام useMemo للحفاظ على ثبات مصفوفات عناصر القائمة
  const mainNavItems = useMemo(() => [
    {
      title: "لوحة التحكم",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "نظرة عامة على المتجر والإحصائيات"
    },
    {
      title: "المنتجات",
      href: "/dashboard/products",
      icon: Package,
      description: "إدارة منتجات المتجر والمخزون"
    },
    {
      title: "الطلبات",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      description: "إدارة الطلبات وتتبع الشحنات"
    },
    {
      title: "العملاء",
      href: "/dashboard/customers",
      icon: Users,
      description: "إدارة قاعدة العملاء"
    },
    {
      title: "التصنيفات",
      href: "/dashboard/categories",
      icon: Tag,
      description: "إدارة تصنيفات المنتجات"
    },
    {
      title: "كوبونات الخصم",
      href: "/dashboard/marketing", 
      icon: Gift,
      description: "إدارة العروض والكوبونات"
    },
    {
      title: "الشحن",
      href: "/dashboard/shipping",
      icon: Truck,
      description: "إدارة طرق الشحن والتوصيل"
    }
  ], []);
  
  const analyticItems = useMemo(() => [
    {
      title: "التقارير",
      href: "/dashboard/reports",
      icon: BarChart,
      description: "تقارير المبيعات والأداء"
    },
    {
      title: "الإشعارات",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "إدارة إشعارات المتجر"
    }
  ], []);
  
  const settingItems = useMemo(() => [
    {
      title: "إعدادات المتجر",
      href: "/dashboard/store",
      icon: Store,
      description: "تخصيص إعدادات المتجر"
    },
    {
      title: "المدفوعات",
      href: "/dashboard/payment",
      icon: CreditCard,
      description: "إدارة طرق الدفع والمعاملات"
    },
    {
      title: "إعدادات النظام",
      href: "/dashboard/settings",
      icon: Settings,
      description: "إعدادات النظام العامة"
    }
  ], []);
  
  const getInitials = (name: string) => {
    if (!name) return "MT";
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // حل مشكلة عدم تحديث القائمة عند تغيير المسار
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-l border-gray-200">
      <SidebarHeader className="py-4">
        {expanded ? (
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(storeData?.store_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{storeData?.store_name || "متجري"}</span>
                <span className="text-xs text-muted-foreground">{storeData?.domain_name || "domain"}.linok.me</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => window.open(`https://${storeData?.domain_name || 'domain'}.linok.me`, '_blank')}
              >
                <Store className="h-3.5 w-3.5 ml-1" />
                زيارة المتجر
                <ChevronRight className="h-3 w-3 mr-auto" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(storeData?.store_name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{storeData?.store_name || "متجري"}</p>
                  <p className="text-xs text-muted-foreground">{storeData?.domain_name || "domain"}.linok.me</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="py-0">
        <NavigationMenu 
          items={mainNavItems} 
          expanded={expanded} 
          currentPath={currentPath}
        />
        
        {expanded && <div className="px-3 py-2">
          <Separator />
        </div>}
        
        <NavigationMenu 
          title={expanded ? "التحليلات" : undefined}
          items={analyticItems} 
          expanded={expanded} 
          currentPath={currentPath}
        />
        
        {expanded && <div className="px-3 py-2">
          <Separator />
        </div>}
        
        <NavigationMenu 
          title={expanded ? "الإعدادات" : undefined}
          items={settingItems} 
          expanded={expanded} 
          currentPath={currentPath}
        />
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
            !expanded && "justify-center"
          )} 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 ml-2" />
          {expanded && "تسجيل الخروج"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
