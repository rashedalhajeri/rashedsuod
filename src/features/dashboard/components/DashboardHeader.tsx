
import React from "react";
import { Link } from "react-router-dom";
import { 
  MenuIcon, Bell, Search, ChevronDown, 
  Store, ArrowLeft, Sun, Moon, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DashboardHeaderProps {
  storeName: string | null;
  domainName: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  storeName,
  domainName
}) => {
  const { toggle, expanded } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:mr-2" 
            onClick={toggle}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          
          {isDesktop && (
            <div className="relative w-64">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث في لوحة التحكم..." 
                className="pr-9 bg-muted border-none" 
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to={`https://${domainName || 'domain'}.linok.me`} target="_blank">
              <Store className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {storeName?.substring(0, 2) || 'ST'}
                  </AvatarFallback>
                </Avatar>
                {isDesktop && (
                  <>
                    <span className="text-sm font-normal">
                      {storeName || "متجري"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer">
                  الملف الشخصي
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 ml-2" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-between">
                <Link to="/dashboard/theme" className="cursor-pointer w-full">
                  سمة النظام
                  <div className="flex items-center gap-1">
                    <Sun className="h-4 w-4" />
                    <Moon className="h-4 w-4" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="https://linok.me/help" target="_blank" className="cursor-pointer">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  مركز المساعدة
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
