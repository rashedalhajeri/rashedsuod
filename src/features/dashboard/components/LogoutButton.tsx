
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
            "w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {(!isCollapsed || isMobile) && <span>تسجيل الخروج</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">تسجيل الخروج</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-start gap-2">
          <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout} className="bg-red-600 hover:bg-red-700">
            تسجيل الخروج
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
