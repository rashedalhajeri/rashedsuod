
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface PromoBannerProps {
  storeDomain?: string;
}

interface Banner {
  id: string;
  image_url: string;
  link_type: "category" | "product" | "external" | "none";
  link_url: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ storeDomain }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [transitionTime, setTransitionTime] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch banners and settings when the component mounts
  useEffect(() => {
    const fetchBanners = async () => {
      if (!storeDomain) return;
      
      try {
        // Get store ID from the domain name
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('domain_name', storeDomain)
          .single();
        
        if (storeError || !storeData) {
          console.error("Error fetching store:", storeError);
          setIsLoading(false);
          return;
        }
        
        // Fetch banners for the store
        const { data: bannersData, error: bannersError } = await supabase
          .from('banners')
          .select('*')
          .eq('store_id', storeData.id)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        if (bannersError) {
          console.error("Error fetching banners:", bannersError);
          setIsLoading(false);
          return;
        }
        
        // Fetch banner settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('banner_settings')
          .select('transition_time')
          .eq('store_id', storeData.id)
          .single();
        
        if (!settingsError && settingsData) {
          setTransitionTime(settingsData.transition_time);
        }
        
        setBanners(bannersData || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in PromoBanner:", error);
        setIsLoading(false);
      }
    };
    
    fetchBanners();
  }, [storeDomain]);
  
  // Auto-advance the banner
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setTimeout(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, transitionTime * 1000);
    
    return () => clearTimeout(timer);
  }, [currentBannerIndex, transitionTime, banners.length]);
  
  // If loading or no banners, return default or nothing
  if (isLoading) {
    return null;
  }
  
  if (banners.length === 0) {
    return null;
  }
  
  const currentBanner = banners[currentBannerIndex];
  
  // Build the link URL based on the link type
  const getLinkUrl = () => {
    switch (currentBanner.link_type) {
      case 'product':
        return `/store/${storeDomain}/product/${currentBanner.link_url}`;
      case 'category':
        return `/store/${storeDomain}/category/${currentBanner.link_url}`;
      case 'external':
        return currentBanner.link_url;
      default:
        return '#';
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentBannerIndex}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-l from-blue-500 to-blue-600 py-6 px-4 sm:px-5 rounded-xl shadow-md mt-4 mb-6 overflow-hidden border border-blue-100/80 w-full"
      >
        {currentBanner.link_type !== 'none' ? (
          <a href={getLinkUrl()} target={currentBanner.link_type === 'external' ? '_blank' : '_self'} className="block">
            <BannerContent banner={currentBanner} />
          </a>
        ) : (
          <BannerContent banner={currentBanner} />
        )}
        
        {banners.length > 1 && (
          <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mt-4 sm:mt-6">
            {banners.map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentBannerIndex ? "bg-white w-3 sm:w-4" : "bg-white/50 hover:bg-white/60"
                }`}
                onClick={() => setCurrentBannerIndex(index)}
              ></div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Helper component for the banner content
const BannerContent = ({ banner }: { banner: Banner }) => (
  <div className="flex items-center justify-between gap-3 sm:gap-4 relative w-full">
    <div className="flex-1 flex flex-col items-end text-right">
      <h3 className="text-white font-bold text-lg sm:text-2xl mb-2 flex items-center gap-1 sm:gap-2">
        {banner.title || "عرض خاص"}
      </h3>
      <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base max-w-md">
        اكتشف أحدث المنتجات والعروض المميزة
      </p>
    </div>
    
    {banner.image_url && (
      <div className="hidden md:block w-32 h-32 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <img src={banner.image_url} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
      </div>
    )}
  </div>
);

export default PromoBanner;
