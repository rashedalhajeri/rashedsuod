
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ColorManagementSectionProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

const ColorManagementSection: React.FC<ColorManagementSectionProps> = ({
  colors,
  onColorsChange
}) => {
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#3B82F6");

  const handleAddColor = () => {
    if (!newColor) return;
    
    // Format: colorName|hexCode
    const colorEntry = `${newColor}|${newColorHex}`;
    
    // Check if the color name already exists
    const exists = colors.some(color => color.split('|')[0] === newColor);
    
    if (exists) {
      return; // Do not add duplicate colors
    }
    
    onColorsChange([...colors, colorEntry]);
    setNewColor("");
  };

  const handleRemoveColor = (indexToRemove: number) => {
    onColorsChange(colors.filter((_, index) => index !== indexToRemove));
  };

  // Common color presets
  const colorPresets = [
    { name: "أساسية", colors: [
      "أحمر|#EF4444", 
      "أزرق|#3B82F6", 
      "أخضر|#10B981", 
      "أسود|#000000"
    ]},
    { name: "ألوان فاتحة", colors: [
      "أبيض|#FFFFFF", 
      "بيج|#F5F5DC", 
      "رمادي فاتح|#E5E7EB", 
      "أصفر فاتح|#FEF3C7"
    ]},
    { name: "ألوان غامقة", colors: [
      "أزرق غامق|#1E3A8A", 
      "أحمر غامق|#991B1B", 
      "أخضر غامق|#065F46", 
      "بني|#78350F"
    ]}
  ];

  const handleUsePreset = (presetColors: string[]) => {
    onColorsChange(presetColors);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Palette className="h-4 w-4 text-blue-500" />
          إدارة الألوان
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="sm:flex-1">
            <Label htmlFor="newColor" className="sr-only">اسم اللون</Label>
            <Input
              id="newColor"
              placeholder="اسم اللون (مثال: أحمر)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-24">
            <Label htmlFor="newColorHex" className="sr-only">اختر اللون</Label>
            <div className="flex h-10 items-center">
              <Input
                id="newColorHex"
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-full w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <Button 
            type="button" 
            onClick={handleAddColor} 
            disabled={!newColor} 
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {colorPresets.map((preset, i) => (
            <Button 
              key={i} 
              variant="outline" 
              size="sm" 
              onClick={() => handleUsePreset(preset.colors)}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
        
        {colors.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4 p-3 border rounded-md border-gray-100 bg-gray-50">
            {colors.map((colorEntry, index) => {
              const [name, hex] = colorEntry.split('|');
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 border bg-white"
                >
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: hex || '#000000' }}
                  />
                  <span>{name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveColor(index)}
                    className="h-5 w-5 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 border rounded-md border-gray-200 bg-gray-50">
            لم تتم إضافة أي ألوان بعد. أضف لون أو اختر مجموعة ألوان.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorManagementSection;
