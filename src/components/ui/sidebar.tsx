
import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// إنشاء سياق للشريط الجانبي
type SidebarContextType = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// مزود السياق للشريط الجانبي
export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isMobile = useIsMobile();

  // ضبط الحالة الافتراضية حسب حجم الشاشة
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(defaultExpanded);
    }
  }, [isMobile, defaultExpanded]);

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// هوك للوصول إلى حالة الشريط الجانبي
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// مكون الشريط الجانبي الرئيسي
export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        "glass-card bg-white/90 backdrop-blur-sm shadow-sm border-l z-50 transition-all duration-300 overflow-hidden",
        expanded ? "w-64" : "w-0 md:w-16",
        isMobile && !expanded ? "w-0" : "",
        isMobile ? "fixed top-16 bottom-0" : "sticky top-16 h-[calc(100vh-64px)]",
        className
      )}
    >
      <div className="h-full flex flex-col">{children}</div>
    </aside>
  );
}

// مكون محتوى الشريط الجانبي
export function SidebarContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("p-4 flex-1 overflow-y-auto", className)}>{children}</div>;
}

// مكون مجموعة عناصر الشريط الجانبي
export function SidebarGroup({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("space-y-1 mb-6", className)}>{children}</div>;
}

// مكون زر التبديل للشريط الجانبي
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, expanded } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile && !expanded) {
    return (
      <Button
        onClick={toggle}
        variant="ghost"
        size="icon"
        className={cn("fixed top-20 right-3 z-50", className)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
  }

  if (isMobile) {
    return (
      <Button
        onClick={toggle}
        variant="ghost"
        size="icon"
        className={cn("fixed top-20 right-3 z-50", className)}
      >
        {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
    );
  }

  return null;
}

// مكون قائمة الشريط الجانبي
export function SidebarMenu({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

// مكون عنصر قائمة الشريط الجانبي
export function SidebarMenuItem({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <li className={className}>{children}</li>;
}

// مكون زر قائمة الشريط الجانبي
export function SidebarMenuLink({
  href,
  icon: Icon,
  children,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
}) {
  const { expanded } = useSidebar();

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center p-3 rounded-md transition-colors",
        active
          ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 border-r-4 border-primary-500"
          : "text-gray-700 hover:bg-gray-50",
        !expanded && "md:justify-center"
      )}
    >
      <Icon className={cn("h-5 w-5", expanded ? "ml-3" : "")} />
      {expanded && <span className="mr-2">{children}</span>}
      {active && expanded && <ChevronRight className="mr-auto h-4 w-4 text-primary-500" />}
    </Link>
  );
}

// مكون رأس الشريط الجانبي
export function SidebarHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { expanded } = useSidebar();

  if (!expanded) return null;

  return (
    <div className={cn("p-4 border-b border-gray-100", className)}>
      {children}
    </div>
  );
}

// مكون ذيل الشريط الجانبي
export function SidebarFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { expanded } = useSidebar();

  if (!expanded) return null;

  return <div className={cn("p-4 mt-auto border-t border-gray-100", className)}>{children}</div>;
}
