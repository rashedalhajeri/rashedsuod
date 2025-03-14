
import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft, X, Menu, Bell, User, LogOut, Settings, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultExpanded = true
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(defaultExpanded);
    }
  }, [isMobile, defaultExpanded]);
  
  const toggle = () => setExpanded(prev => !prev);
  
  return <SidebarContext.Provider value={{
    expanded,
    setExpanded,
    toggle
  }}>
      {children}
    </SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();
  
  return <aside className={cn(
    "glass-card bg-white/95 backdrop-blur-sm shadow-sm border-l z-50 transition-all duration-300 overflow-hidden",
    expanded ? "w-64" : "w-0 md:w-16", 
    isMobile && !expanded ? "w-0" : "", 
    isMobile ? "fixed top-16 bottom-0" : "sticky top-0 h-screen", 
    className
  )}>
    <div className="h-full flex flex-col">{children}</div>
  </aside>;
}

export function SidebarContent({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("p-4 flex-1 overflow-y-auto", className)}>{children}</div>;
}

export function SidebarGroup({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("space-y-1 mb-6", className)}>{children}</div>;
}

export function SidebarTrigger({
  className
}: {
  className?: string;
}) {
  const { toggle, expanded } = useSidebar();
  const isMobile = useIsMobile();
  
  if (!isMobile && !expanded) {
    return <Button onClick={toggle} variant="ghost" size="icon" className={cn("fixed top-4 right-3 z-50", className)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>;
  }
  
  return <Button onClick={toggle} variant="ghost" size="icon" className={cn(isMobile ? "fixed top-4 right-3 z-50" : "", className)}>
      {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </Button>;
}

export function SidebarMenu({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <li className={className}>{children}</li>;
}

export function SidebarMenuLink({
  to,
  icon: Icon,
  children,
  active = false,
  title
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
  title?: string;
}) {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();
  
  const linkContent = (
    <Link 
      to={to} 
      className={cn(
        "flex items-center p-3 rounded-lg transition-colors", 
        active ? 
          "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 border-r-4 border-primary-500" : 
          "text-gray-700 hover:bg-primary-50/50 hover:text-primary-600", 
        !expanded && "md:justify-center"
      )}
    >
      <Icon className={cn("h-5 w-5", expanded ? "ml-3" : "")} />
      {expanded && <span className="mr-2 font-medium">{children}</span>}
      {active && expanded && <ChevronRight className="mr-auto h-4 w-4 text-primary-500" />}
    </Link>
  );
  
  if (!expanded && !isMobile && title) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="bg-gray-800 text-white border-0">
            <div className="flex flex-col">
              <span className="font-medium">{children}</span>
              {title && <span className="text-xs text-gray-300">{title}</span>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return linkContent;
}

export function SidebarHeader({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();
  
  if (!expanded && !isMobile) return null;
  
  return <div className={cn("p-4 border-b border-gray-100", className)}>
    {children}
  </div>;
}

export function SidebarFooter({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { expanded } = useSidebar();
  
  if (!expanded) return null;
  
  return <div className={cn("p-4 mt-auto border-t border-gray-100", className)}>{children}</div>;
}

export function SidebarUserSection({
  storeName,
  domainName,
  hasNotifications = false,
  onLogout,
  className
}: {
  storeName?: string;
  domainName?: string;
  hasNotifications?: boolean;
  onLogout?: () => void;
  className?: string;
}) {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  return <div className={cn("p-4 border-b border-gray-100", className)}>
      <div className="flex items-center justify-end">
        {expanded && <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Bell className="h-4 w-4" />
              {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white animate-pulse"></span>}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer w-full">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.open(`https://${domainName}.linok.me`, '_blank')} 
                  className="cursor-pointer"
                >
                  <Store className="ml-2 h-4 w-4" />
                  <span>زيارة المتجر</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}
      </div>
    </div>;
}
