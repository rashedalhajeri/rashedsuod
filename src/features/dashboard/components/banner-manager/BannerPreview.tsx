
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banner } from "./types";
import { Monitor, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BannerPreviewProps {
  banners: Banner[];
  transitionTime: number;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({ 
  banners, 
  transitionTime 
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Filter to only show active banners
  const activeBanners = banners.filter(banner => banner.is_active && banner.image_url);
  
  // Auto-advance the banner
  useEffect(() => {
    if (!activeBanners.length || !isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, transitionTime * 1000);
    
    return () => clearTimeout(timer);
  }, [currentBannerIndex, transitionTime, activeBanners.length, isAutoPlaying]);
  
  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  if (!activeBanners.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5" /> معاينة البنرات
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-md">
          <div className="text-gray-500 mb-2">لا توجد بنرات نشطة للعرض</div>
          <div className="text-sm text-gray-400">قم بإضافة بنرات وتفعيلها للمعاينة</div>
        </CardContent>
      </Card>
    );
  }
  
  const currentBanner = activeBanners[currentBannerIndex];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="mr-2 h-5 w-5" /> معاينة البنرات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden rounded-b-lg aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={currentBanner.image_url} 
                alt={currentBanner.title || "Banner"} 
                className="w-full h-full object-cover"
              />
              
              {currentBanner.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-xl">{currentBanner.title}</h3>
                  {currentBanner.link_type !== 'none' && (
                    <p className="text-white/80 text-sm">
                      {currentBanner.link_type === 'product' ? 'رابط لمنتج' : 
                       currentBanner.link_type === 'category' ? 'رابط لفئة' : 
                       'رابط خارجي'}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1 rtl:space-x-reverse">
            {activeBanners.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/60"
                }`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentBannerIndex(index);
                }}
              ></div>
            ))}
          </div>
          
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="h-9 w-9 rounded-full bg-black/20 text-white hover:bg-black/40 mr-1"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-9 w-9 rounded-full bg-black/20 text-white hover:bg-black/40 ml-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 text-sm text-center text-gray-500 border-t">
          زمن التبديل: {transitionTime} ثواني | بنر {currentBannerIndex + 1} من {activeBanners.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerPreview;
