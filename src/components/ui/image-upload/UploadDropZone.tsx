
import React from "react";
import { FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UploadDropZoneProps {
  isDragging: boolean;
  isUploading: boolean;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  isEmpty: boolean;
}

const UploadDropZone: React.FC<UploadDropZoneProps> = ({
  isDragging,
  isUploading,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
  isEmpty
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      className={cn(
        "border-2 border-dashed rounded-md p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square",
        isDragging 
          ? "border-purple-400 bg-purple-50" 
          : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50",
        isEmpty && "col-span-full h-28 md:h-40",
        isUploading && "opacity-50 pointer-events-none"
      )}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isUploading ? (
        <>
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-medium text-purple-700">
            جاري الرفع...
          </p>
        </>
      ) : (
        <>
          <div className="rounded-full bg-purple-100 p-2 mb-1">
            <FileImage className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-xs font-medium mb-1 text-purple-700">
            إضافة صورة
          </p>
          <p className="text-[10px] text-gray-500">
            اضغط لاختيار ملف أو اسحب وأفلت
          </p>
        </>
      )}
    </motion.div>
  );
};

export default UploadDropZone;
