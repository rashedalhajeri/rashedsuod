
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
  isCollapsed?: boolean;
  isMobile?: boolean;
  onLogout: () => Promise<void>;
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  isCollapsed, 
  isMobile, 
  onLogout,
  className,
  children
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? children : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg",
              isCollapsed && !isMobile && "justify-center px-2",
              className
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {(!isCollapsed || isMobile) && <span>تسجيل الخروج</span>}
          </Button>
        )}
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
          <AlertDialogAction onClick={onLogout} className="bg-red-500 hover:bg-red-600">
            تسجيل الخروج
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
