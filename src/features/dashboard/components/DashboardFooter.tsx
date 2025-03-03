
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardFooterProps {
  className?: string;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "border-t border-border py-3 px-4 text-center text-xs text-muted-foreground",
      className
    )}>
      <p>© {currentYear} Linok.me - جميع الحقوق محفوظة</p>
    </footer>
  );
};

export default DashboardFooter;
