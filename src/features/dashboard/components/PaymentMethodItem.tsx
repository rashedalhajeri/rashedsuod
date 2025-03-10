
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodItemProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  isPaidPlan: boolean;
  icon: React.ReactNode;
  color: string;
  tooltipContent?: string;
  badges?: Array<{ text: string; color: string }>;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  isPaidPlan,
  icon,
  color,
  tooltipContent,
  badges = []
}) => {
  return (
    <div className={cn(
      "flex items-start justify-between p-4 rounded-lg border",
      disabled && !isPaidPlan 
        ? "bg-gray-50 border-gray-200" 
        : "bg-white border-gray-200 hover:border-gray-300"
    )}>
      <div className="flex gap-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md text-white",
          color
        )}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            {!isPaidPlan && disabled && (
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                باقة مدفوعة
              </Badge>
            )}
            {badges.map((badge, index) => (
              <Badge key={index} className={cn("text-xs", badge.color)}>
                {badge.text}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled && !isPaidPlan}
              />
            </div>
          </TooltipTrigger>
          {tooltipContent && (
            <TooltipContent side="left" className="max-w-xs">
              <p>{tooltipContent}</p>
              {disabled && !isPaidPlan && (
                <p className="text-yellow-600 mt-1 font-medium">
                  هذه الميزة متاحة فقط في الباقات المدفوعة
                </p>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PaymentMethodItem;
