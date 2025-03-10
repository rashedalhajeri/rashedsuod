
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FeatureItem from "./FeatureItem";
import { Feature } from "./types";

interface FeaturesListProps {
  features: Feature[];
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onFeatureChange: (index: number, field: keyof Feature, value: any) => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ 
  features, 
  onAddFeature, 
  onRemoveFeature, 
  onFeatureChange 
}) => {
  return (
    <div className="space-y-6 mt-6">
      {features.map((feature, index) => (
        <FeatureItem
          key={feature.id}
          feature={feature}
          index={index}
          onRemove={() => onRemoveFeature(index)}
          onChange={(field, value) => onFeatureChange(index, field, value)}
        />
      ))}
      
      <Button 
        onClick={onAddFeature} 
        className="w-full"
        disabled={features.length >= 4}
      >
        <Plus className="h-4 w-4 me-2" /> إضافة ميزة جديدة
      </Button>
      
      {features.length >= 4 && (
        <p className="text-xs text-muted-foreground text-center">
          الحد الأقصى للمميزات هو 4 مميزات
        </p>
      )}
    </div>
  );
};

export default FeaturesList;
