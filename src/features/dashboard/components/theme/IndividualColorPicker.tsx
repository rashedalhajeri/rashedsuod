
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from '@/features/dashboard/types/theme-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface IndividualColorPickerProps {
  id: string;
  label: string;
  value: string;
  options: ColorOption[];
  onChange: (value: string) => void;
  tooltip?: string;
}

const IndividualColorPicker: React.FC<IndividualColorPickerProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  tooltip
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-md border"
          style={{ backgroundColor: value }}
        />
        <Select 
          value={value} 
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`اختر ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map(color => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: color.value }}
                  />
                  <span>{color.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IndividualColorPicker;
