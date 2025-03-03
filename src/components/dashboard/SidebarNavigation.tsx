
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuLink } from "@/components/ui/sidebar";
import { 
  mainNavigation, 
  analyticsNavigation, 
  communicationNavigation, 
  settingsNavigation 
} from "./navigation-items";

const SidebarNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <SidebarGroup>
        <div className="px-3 py-2">
          <h4 className="text-xs font-medium text-gray-500 mb-2">القائمة الرئيسية</h4>
        </div>
        <SidebarMenu>
          {mainNavigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuLink to={item.href} icon={item.icon} active={isActive} title={item.description}>
                  {item.name}
                </SidebarMenuLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        <div className="px-3 py-2 mt-2">
          <h4 className="text-xs font-medium text-gray-500 mb-2">التقارير والإحصائيات</h4>
        </div>
        <SidebarMenu>
          {analyticsNavigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuLink to={item.href} icon={item.icon} active={isActive} title={item.description}>
                  {item.name}
                </SidebarMenuLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        <div className="px-3 py-2 mt-2">
          <h4 className="text-xs font-medium text-gray-500 mb-2">التواصل والدعم</h4>
        </div>
        <SidebarMenu>
          {communicationNavigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuLink to={item.href} icon={item.icon} active={isActive} title={item.description}>
                  {item.name}
                </SidebarMenuLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
      
      <SidebarGroup>
        <div className="px-3 py-2 mt-2">
          <h4 className="text-xs font-medium text-gray-500 mb-2">الإعدادات</h4>
        </div>
        <SidebarMenu>
          {settingsNavigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuLink to={item.href} icon={item.icon} active={isActive} title={item.description}>
                  {item.name}
                </SidebarMenuLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};

export default SidebarNavigation;
