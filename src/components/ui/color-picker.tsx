
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const presetColors = [
  "#22C55E", // Primary green
  "#3B82F6", // Blue
  "#F97316", // Orange
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#000000", // Black
  "#6B7280", // Gray
  "#FFFFFF", // White
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full h-10 rounded-md border border-input flex items-center justify-between px-3",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{color}</span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-full h-10 cursor-pointer"
              />
            </div>
            
            <div>
              <Label className="text-xs mb-1.5 block">الألوان الشائعة</Label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={cn(
                      "w-full aspect-square rounded-md border border-input",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      color === presetColor && "ring-2 ring-ring"
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetClick(presetColor)}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
