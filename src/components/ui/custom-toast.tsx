
import React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, X, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  title: string;
  description?: string;
  type?: ToastType;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <Check className="h-5 w-5 text-green-500" />;
    case "error":
      return <X className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  type = "info"
}) => {
  return (
    <div className="flex items-start gap-3 w-full">
      <div className={cn(
        "flex-shrink-0 flex items-center justify-center rounded-full p-1.5",
        type === "success" && "bg-green-100",
        type === "error" && "bg-red-100",
        type === "warning" && "bg-yellow-100",
        type === "info" && "bg-blue-100"
      )}>
        {getToastIcon(type)}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
    </div>
  );
};

export const showToast = (options: CustomToastProps) => {
  toast(<CustomToast {...options} />);
};

export default CustomToast;
