
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FeaturesList from "./store-features/FeaturesList";
import { Feature, StoreFeaturesProps } from "./store-features/types";

const StoreFeatures: React.FC<StoreFeaturesProps> = ({ storeId }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeaturesSection, setShowFeaturesSection] = useState(true);
  
  useEffect(() => {
    if (storeId) {
      fetchFeatures();
    }
  }, [storeId]);
  
  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      // Set default features - in a real implementation you would fetch these from the database
      setFeatures([
        {
          id: `temp_1`,
          icon: 'star',
          title: 'منتجات مميزة',
          description: 'نقدم لك أفضل المنتجات بأعلى جودة',
          is_active: true
        },
        {
          id: `temp_2`,
          icon: 'percent',
          title: 'خصومات دائمة',
          description: 'استمتع بخصومات حصرية على مشترياتك',
          is_active: true
        },
        {
          id: `temp_3`,
          icon: 'truck',
          title: 'شحن سريع',
          description: 'نوصل طلبك بأسرع وقت ممكن',
          is_active: true
        }
      ]);
      
      // In a real implementation, you would fetch the setting from the database
      setShowFeaturesSection(true);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("حدث خطأ أثناء تحميل مميزات المتجر");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: `temp_${Date.now()}`,
      icon: 'star',
      title: '',
      description: '',
      is_active: true
    };
    
    setFeatures([...features, newFeature]);
  };
  
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };
  
  const handleFeatureChange = (index: number, field: keyof Feature, value: any) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setFeatures(updatedFeatures);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would save to the database
      toast.success("تم حفظ مميزات المتجر بنجاح");
    } catch (error) {
      console.error("Error saving features:", error);
      toast.error("حدث خطأ أثناء حفظ مميزات المتجر");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">جاري تحميل مميزات المتجر...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>مميزات المتجر</CardTitle>
        <CardDescription>
          أضف مميزات متجرك التي سيتم عرضها للعملاء في صفحة المتجر
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border p-4 rounded-md">
            <Switch 
              id="show-features"
              checked={showFeaturesSection}
              onCheckedChange={setShowFeaturesSection}
            />
            <Label htmlFor="show-features">عرض قسم المميزات في صفحة المتجر</Label>
          </div>
          
          {showFeaturesSection && (
            <FeaturesList
              features={features}
              onAddFeature={handleAddFeature}
              onRemoveFeature={handleRemoveFeature}
              onFeatureChange={handleFeatureChange}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <SaveButton isSaving={isSaving} onClick={handleSave} />
      </CardFooter>
    </Card>
  );
};

export default StoreFeatures;
