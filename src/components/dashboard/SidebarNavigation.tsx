
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuLink, SidebarGroup, useSidebar } from "@/components/ui/sidebar";
import { mainNavigation, analyticsNavigation, communicationNavigation, settingsNavigation } from "./navigation-items";

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const { expanded } = useSidebar();
  
  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/dashboard' && location.pathname.startsWith(href));
  };
  
  return (
    <div className="space-y-6">
      <SidebarGroup>
        {expanded && <div className="px-3 py-2 text-xs font-semibold text-gray-500">القائمة الرئيسية</div>}
        <SidebarMenu>
          {mainNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuLink 
                to={item.href}
                icon={item.icon}
                active={isActive(item.href)}
                title={expanded ? undefined : item.description}
              >
                {item.name}
              </SidebarMenuLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        {expanded && <div className="px-3 py-2 text-xs font-semibold text-gray-500">التحليلات</div>}
        <SidebarMenu>
          {analyticsNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuLink 
                to={item.href}
                icon={item.icon}
                active={isActive(item.href)}
                title={expanded ? undefined : item.description}
              >
                {item.name}
              </SidebarMenuLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        {expanded && <div className="px-3 py-2 text-xs font-semibold text-gray-500">التواصل</div>}
        <SidebarMenu>
          {communicationNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuLink 
                to={item.href}
                icon={item.icon}
                active={isActive(item.href)}
                title={expanded ? undefined : item.description}
              >
                {item.name}
              </SidebarMenuLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        {expanded && <div className="px-3 py-2 text-xs font-semibold text-gray-500">الإعدادات</div>}
        <SidebarMenu>
          {settingsNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuLink 
                to={item.href}
                icon={item.icon}
                active={isActive(item.href)}
                title={expanded ? undefined : item.description}
              >
                {item.name}
              </SidebarMenuLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
};

export default SidebarNavigation;
