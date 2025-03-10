
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BannerItem from "./BannerItem";
import { Banner } from "./types";

interface BannersListProps {
  banners: Banner[];
  storeId: string;
  categories: any[];
  products: any[];
  onAddBanner: () => void;
  onRemoveBanner: (index: number) => void;
  onBannerChange: (index: number, field: keyof Banner, value: any) => void;
  onBannerImageChange: (index: number, images: string[]) => void;
  onMoveBanner: (index: number, direction: 'up' | 'down') => void;
}

const BannersList: React.FC<BannersListProps> = ({
  banners,
  storeId,
  categories,
  products,
  onAddBanner,
  onRemoveBanner,
  onBannerChange,
  onBannerImageChange,
  onMoveBanner
}) => {
  return (
    <div className="space-y-6 mt-6">
      {banners.map((banner, index) => (
        <BannerItem
          key={banner.id}
          banner={banner}
          index={index}
          storeId={storeId}
          categories={categories}
          products={products}
          isFirstBanner={index === 0}
          isLastBanner={index === banners.length - 1}
          onBannerChange={onBannerChange}
          onBannerImageChange={onBannerImageChange}
          onRemoveBanner={onRemoveBanner}
          onMoveBanner={onMoveBanner}
        />
      ))}
      
      <Button onClick={onAddBanner} className="w-full">
        <Plus className="h-4 w-4 me-2" /> إضافة بنر جديد
      </Button>
    </div>
  );
};

export default BannersList;
