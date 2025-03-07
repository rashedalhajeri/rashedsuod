
import React from "react";
import { ProductFormData } from "./useProductFormSubmit";
import ColorManagementSection from "./ColorManagementSection";
import SizeManagementSection from "./SizeManagementSection";
import FormSection from "./FormSection";

interface ConditionalSectionsProps {
  formData: Partial<ProductFormData>;
  handleColorsChange: (colors: string[]) => void;
  handleSizesChange: (sizes: string[]) => void;
}

const ConditionalSections: React.FC<ConditionalSectionsProps> = ({
  formData,
  handleColorsChange,
  handleSizesChange
}) => {
  // إذا لم يكن هناك ألوان أو مقاسات مفعلة، لا نعرض هذا القسم
  if (!formData.has_colors && !formData.has_sizes) {
    return null;
  }
  
  return (
    <FormSection>
      <div className="space-y-6">
        {formData.has_colors && (
          <ColorManagementSection 
            colors={formData.available_colors || []}
            onColorsChange={handleColorsChange}
          />
        )}
        
        {formData.has_sizes && (
          <SizeManagementSection 
            sizes={formData.available_sizes || []}
            onSizesChange={handleSizesChange}
          />
        )}
      </div>
    </FormSection>
  );
};

export default ConditionalSections;
