
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  expanded: boolean;
  currentPath: string;
  title?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  items, 
  expanded, 
  currentPath,
  title
}) => {
  const location = useLocation();
  
  if (items.length === 0) return null;
  
  return (
    <div className="py-1">
      {title && (
        <div className="px-3 mb-1">
          <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        </div>
      )}
      
      <div className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          
          const linkContent = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !expanded && "justify-center py-2 px-0"
              )}
            >
              <item.icon className={cn("h-4 w-4", !expanded && "h-5 w-5")} />
              {expanded && <span>{item.title}</span>}
            </Link>
          );
          
          if (!expanded && item.description) {
            return (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          
          return (
            <div key={item.href}>
              {linkContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationMenu;
