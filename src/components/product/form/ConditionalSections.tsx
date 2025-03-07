
import React from "react";
import ColorManagementSection from "./ColorManagementSection";
import SizeManagementSection from "./SizeManagementSection";

interface ProductFormData {
  has_colors: boolean;
  has_sizes: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  [key: string]: any;
}

interface ConditionalSectionsProps {
  formData: ProductFormData;
  handleColorsChange: (colors: string[]) => void;
  handleSizesChange: (sizes: string[]) => void;
}

const ConditionalSections: React.FC<ConditionalSectionsProps> = ({
  formData,
  handleColorsChange,
  handleSizesChange
}) => {
  if (!formData.has_colors && !formData.has_sizes) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {formData.has_colors && (
        <div>
          <ColorManagementSection 
            colors={formData.available_colors || []}
            onColorsChange={handleColorsChange}
          />
        </div>
      )}
      
      {formData.has_sizes && (
        <div>
          <SizeManagementSection 
            sizes={formData.available_sizes || []}
            onSizesChange={handleSizesChange}
          />
        </div>
      )}
    </div>
  );
};

export default ConditionalSections;
