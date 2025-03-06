
import React from "react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface LogoutButtonProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onLogout: () => Promise<void>;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  isCollapsed, 
  isMobile, 
  onLogout 
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
        >
          <LogOut size={18} className="mr-2" />
          {(!isCollapsed || isMobile) && <span>تسجيل الخروج</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout} className="bg-red-600 hover:bg-red-700">
            تسجيل الخروج
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
