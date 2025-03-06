
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  isActive,
  isCollapsed,
  onClick
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200", 
        isActive ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
      )} 
      onClick={onClick}
    >
      <div className={cn("min-w-6 flex items-center justify-center", isActive && "text-primary-600")}>
        {icon}
      </div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default SidebarLink;
