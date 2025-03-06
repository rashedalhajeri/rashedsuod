import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreFormData } from "../types";

interface StoreSettingsStepProps {
  formData: StoreFormData;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StoreSettingsStep: React.FC<StoreSettingsStepProps> = ({
  formData,
  handleSelectChange,
}) => {
  // This component is currently unused, but we're keeping it for potential future use
  // with a simplified implementation that matches our current StoreFormData type
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">إعدادات المتجر</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">مظهر المتجر</h3>
          <Tabs defaultValue="modern" onValueChange={(value) => handleSelectChange("themeId", value)}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="modern">عصري</TabsTrigger>
              <TabsTrigger value="minimal">بسيط</TabsTrigger>
              <TabsTrigger value="classic">كلاسيكي</TabsTrigger>
              <TabsTrigger value="business">أعمال</TabsTrigger>
            </TabsList>
            <div className="grid md:grid-cols-2 gap-4">
              {["modern", "minimal", "classic", "business"].map((theme) => (
                <Card key={theme} className="overflow-hidden">
                  <img 
                    src={`/themes/${theme}.jpg`} 
                    alt={theme} 
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-2 flex justify-center">
                    <span className="text-sm">
                      {theme === "modern" && "عصري"}
                      {theme === "minimal" && "بسيط"}
                      {theme === "classic" && "كلاسيكي"}
                      {theme === "business" && "أعمال"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsStep;
