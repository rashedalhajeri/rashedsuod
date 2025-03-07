
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  imageUrl: string;
  index: number;
  onRemove: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  index,
  onRemove
}) => {
  return (
    <motion.div 
      key={`${imageUrl}-${index}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
    >
      <img 
        src={imageUrl} 
        alt={`صورة المنتج ${index + 1}`} 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => onRemove(index)}
          className="h-7 w-7 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {index === 0 && (
        <div className="absolute top-1 right-1 bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[9px] font-medium">
          رئيسية
        </div>
      )}
    </motion.div>
  );
};

export default ImagePreview;
