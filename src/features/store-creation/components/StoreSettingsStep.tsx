
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  handleSwitchChange,
  handleChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">إعدادات المتجر</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">إعدادات الشحن</h3>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">طريقة الشحن</Label>
                  <Select
                    value={formData.shippingMethod}
                    onValueChange={(value) => handleSelectChange("shippingMethod", value)}
                  >
                    <SelectTrigger id="shippingMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store_delivery">توصيل المتجر</SelectItem>
                      <SelectItem value="courier">شركة شحن</SelectItem>
                      <SelectItem value="pickup">استلام من المتجر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="freeShipping"
                    checked={formData.freeShipping}
                    onCheckedChange={(checked) => handleSwitchChange("freeShipping", checked)}
                  />
                  <Label htmlFor="freeShipping" className="mr-2">توصيل مجاني</Label>
                </div>
                
                {formData.freeShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingMinOrder">الحد الأدنى للطلب للتوصيل المجاني</Label>
                    <Input
                      id="freeShippingMinOrder"
                      name="freeShippingMinOrder"
                      type="number"
                      value={formData.freeShippingMinOrder.toString()}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">مظهر المتجر</h3>
          <Tabs defaultValue={formData.storeTheme} onValueChange={(value) => handleSelectChange("storeTheme", value)}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="modern">عصري</TabsTrigger>
              <TabsTrigger value="minimal">بسيط</TabsTrigger>
              <TabsTrigger value="classic">كلاسيكي</TabsTrigger>
              <TabsTrigger value="business">أعمال</TabsTrigger>
            </TabsList>
            <div className="grid md:grid-cols-2 gap-4">
              {["modern", "minimal", "classic", "business"].map((theme) => (
                <Card key={theme} className={`overflow-hidden ${formData.storeTheme === theme ? "ring-2 ring-primary" : ""}`}>
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
