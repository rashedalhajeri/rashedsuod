
import React from "react";
import { ImageUploadGrid as ModernImageUploadGrid } from "@/components/ui/image-upload";

interface LegacyImageUploadGridProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  storeId?: string;
}

/**
 * @deprecated Use the ImageUploadGrid component from "@/components/ui/image-upload" instead.
 * This component is maintained for backward compatibility.
 */
const LegacyImageUploadGrid: React.FC<LegacyImageUploadGridProps> = (props) => {
  return <ModernImageUploadGrid {...props} />;
};

export default LegacyImageUploadGrid;
