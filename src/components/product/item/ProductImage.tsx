
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImageProps {
  imageUrl: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  zoomable?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  name,
  size = "md",
  className,
  zoomable = true
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  let dimensions = "h-12 w-12";
  if (size === "sm") dimensions = "h-10 w-10";
  if (size === "lg") dimensions = "h-16 w-16";
  
  const handleZoom = (e: React.MouseEvent) => {
    if (zoomable) {
      e.stopPropagation();
      setIsZoomed(true);
    }
  };

  return (
    <>
      <div 
        className={cn(
          `relative ${dimensions} rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200`,
          className
        )}
      >
        <div className="w-full h-full relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes={size === "lg" ? "128px" : size === "md" ? "48px" : "40px"}
            className="object-cover"
            onClick={handleZoom}
          />
          
          {zoomable && (
            <button
              className="absolute bottom-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleZoom}
              title="تكبير الصورة"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      
      {zoomable && (
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogContent className="p-0 max-w-3xl overflow-hidden bg-transparent border-0 shadow-none">
            <div className="relative w-full h-[80vh] bg-black/80 rounded-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="80vw"
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
