
import React from "react";
import { Button } from "@/components/ui/button";
import { Star, BadgePercent, ShieldCheck, Truck } from "lucide-react";

export const icons = [
  { value: 'star', label: 'نجمة', component: <Star className="h-4 w-4" /> },
  { value: 'percent', label: 'خصم', component: <BadgePercent className="h-4 w-4" /> },
  { value: 'shield', label: 'حماية', component: <ShieldCheck className="h-4 w-4" /> },
  { value: 'truck', label: 'شحن', component: <Truck className="h-4 w-4" /> },
];

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2">
      {icons.map((icon) => (
        <Button
          key={icon.value}
          type="button"
          variant={value === icon.value ? "default" : "outline"}
          className={`h-10 w-10 p-0 ${value === icon.value ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => onChange(icon.value)}
        >
          {icon.component}
        </Button>
      ))}
    </div>
  );
};

export default IconSelector;
