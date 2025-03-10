
import React from "react";
import { Store, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import StorePreviewButton from "@/features/dashboard/components/StorePreviewButton";

interface StoreHeaderProps {
  storePreviewUrl: string;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ storePreviewUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Store className="w-7 h-7 text-primary" />
          متجري
        </h1>
        <p className="text-muted-foreground mt-1">
          قم بإدارة مظهر متجرك وتخصيص العناصر المرئية لتحسين تجربة عملائك
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="text-sm gap-1.5"
          variant="outline"
          asChild
        >
          <a href={`/dashboard/settings`}>
            <Settings className="h-4 w-4" />
            إعدادات المتجر
          </a>
        </Button>
        <StorePreviewButton 
          storeUrl={storePreviewUrl} 
          className="shadow-sm bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all text-white"
        />
      </div>
    </div>
  );
};

export default StoreHeader;
