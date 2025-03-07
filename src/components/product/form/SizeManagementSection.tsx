
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SizeManagementSectionProps {
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
}

const SizeManagementSection: React.FC<SizeManagementSectionProps> = ({
  sizes,
  onSizesChange
}) => {
  const [newSize, setNewSize] = useState("");

  const handleAddSize = () => {
    if (!newSize) return;
    
    // Check if the size already exists
    if (sizes.includes(newSize)) {
      return; // Do not add duplicate sizes
    }
    
    onSizesChange([...sizes, newSize]);
    setNewSize("");
  };

  const handleRemoveSize = (indexToRemove: number) => {
    onSizesChange(sizes.filter((_, index) => index !== indexToRemove));
  };

  // Common size presets
  const sizePresets = [
    { label: "S, M, L, XL", values: ["S", "M", "L", "XL"] },
    { label: "XS-XXL", values: ["XS", "S", "M", "L", "XL", "XXL"] },
    { label: "أرقام", values: ["36", "38", "40", "42", "44", "46"] }
  ];

  const handleUsePreset = (preset: string[]) => {
    onSizesChange(preset);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Ruler className="h-4 w-4 text-green-500" />
          إدارة المقاسات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSize" className="sr-only">المقاس</Label>
            <Input
              id="newSize"
              placeholder="أدخل المقاس (مثال: M)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="button" 
            onClick={handleAddSize} 
            disabled={!newSize} 
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {sizePresets.map((preset, i) => (
            <Button 
              key={i} 
              variant="outline" 
              size="sm" 
              onClick={() => handleUsePreset(preset.values)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
        
        {sizes.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {sizes.map((size, index) => (
              <Badge
                key={index}
                variant="outline"
                className="pl-2 pr-1 py-1 flex items-center gap-1 border bg-white"
              >
                <span>{size}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSize(index)}
                  className="h-5 w-5 p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            لم تتم إضافة أي مقاسات بعد
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SizeManagementSection;
