
import React from "react";
import { ImageUploadGrid } from "@/components/ui/image-upload";

interface ImageUploadGridProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  storeId?: string;
}

/**
 * @deprecated Use the ImageUploadGrid component from "@/components/ui/image-upload" instead.
 * This component is maintained for backward compatibility.
 */
const ImageUploadGrid: React.FC<ImageUploadGridProps> = (props) => {
  return <ImageUploadGrid {...props} />;
};

export default ImageUploadGrid;
