
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

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
  tooltipContent: string;
  badges?: Array<{
    text: string;
    color: string;
  }>;
  additionalContent?: React.ReactNode;
}

const SettingTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mr-1" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-60 text-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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
  badges = [],
  additionalContent
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg border hover:border-primary/20 hover:bg-gray-50/50 transition-colors">
      <div className="space-y-1 mb-3 sm:mb-0">
        <div className="flex items-center">
          {icon}
          <Label htmlFor={id} className="text-base font-medium mr-1">{title}</Label>
          <SettingTooltip content={tooltipContent} />
        </div>
        
        {badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 mr-7">
            {badges.map((badge, index) => (
              <div key={index} className={`h-7 px-2 py-1 ${badge.color} rounded text-xs`}>
                {badge.text}
              </div>
            ))}
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mr-7">{description}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2 sm:min-w-28">
        {!isPaidPlan && id !== "cash-on-delivery" && id !== "standard-shipping" && (
          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
            الباقات المدفوعة فقط
          </Badge>
        )}
        <div className="flex items-center justify-end">
          <Switch 
            id={id} 
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            activeColor={color}
          />
          <Label htmlFor={id} className="mr-2 text-sm font-medium text-gray-600">
            {checked ? "مفعل" : "معطل"}
          </Label>
        </div>
      </div>

      {additionalContent && (
        <div className="mt-3 w-full">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodItem;
